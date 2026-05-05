// Phoneme pronunciation spike: validates whether facebook/wav2vec2-xlsr-53-espeak-cv-ft
// produces usable IPA for Romanian when self-hosted on RunPod, AND whether ASR-of-TTS-audio
// is a viable reference (replacing the missing g2p step).
//
// Source: VoxPopuli RO (European Parliament — studio quality, gold transcripts).
// (Earlier iteration used YODAS-Granary; switched after audio quality issues
// inflated the comparison PER and made model evaluation impossible.)
//
// Pipeline per sample:
//   1. Pull native RO audio + transcript from VoxPopuli
//   2. Run native audio through RunPod phoneme ASR → "native IPA" (ground truth)
//   3. Generate TTS audio for the same text via Google TTS
//   4. Run TTS audio through RunPod phoneme ASR → "TTS reference IPA"
//   5. Diff native vs TTS IPA → does symmetric ASR work?
//   6. If user dropped a recording at spike-audio/NN-*.* → also process + compare
//
// Prereq: RUNPOD_PHONEME_RO_ENDPOINT_ID + RUNPOD_API_KEY in .env.local
// (see runpod/wav2vec2-phoneme/README.md for endpoint deployment)
//
// Run: npx tsx scripts/spike-phoneme-pronunciation.ts

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import textToSpeech from '@google-cloud/text-to-speech';

const PHONEME_MODEL = 'facebook/wav2vec2-xlsr-53-espeak-cv-ft (self-hosted on RunPod)';
const DATASET_URL =
  'https://datasets-server.huggingface.co/first-rows?dataset=facebook%2Fvoxpopuli&config=ro&split=train';
const DATASET_NAME = 'VoxPopuli RO (European Parliament, gold transcripts)';
const SAMPLE_COUNT = 5;
const OUT_DIR = path.join(process.cwd(), 'scripts', 'spike-phoneme-output');
const USER_AUDIO_DIR = path.join(process.cwd(), 'scripts', 'spike-audio');

interface DatasetRow {
  audio_id: string;
  audio_url: string;
  text: string;
  is_gold: boolean;
}

interface SampleResult {
  index: number;
  text: string;
  audioId: string;
  nativeIpa: string | null;
  ttsIpa: string | null;
  userIpa: string | null;
  userFile: string | null;
  errors: string[];
}

// ── Setup ──────────────────────────────────────────────────

function checkEnv() {
  const missing: string[] = [];
  if (!process.env.RUNPOD_API_KEY) missing.push('RUNPOD_API_KEY');
  if (!process.env.RUNPOD_PHONEME_RO_ENDPOINT_ID) missing.push('RUNPOD_PHONEME_RO_ENDPOINT_ID');
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_TTS_CREDENTIALS_JSON) {
    missing.push('GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_CREDENTIALS_JSON');
  }
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    if (missing.some((m) => m.startsWith('RUNPOD'))) {
      console.error('See apps/chaoslimba/runpod/wav2vec2-phoneme/README.md for deployment steps.');
    }
    process.exit(1);
  }
  // Fail fast if creds path is set but file doesn't exist (otherwise Google SDK
  // throws asynchronously deep in a callback that's hard to catch cleanly).
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && !fs.existsSync(credsPath)) {
    console.error(`GOOGLE_APPLICATION_CREDENTIALS points at a missing file: ${credsPath}`);
    process.exit(1);
  }
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// ── YODAS dataset fetch ────────────────────────────────────

async function fetchDatasetSamples(n: number): Promise<DatasetRow[]> {
  const res = await fetch(DATASET_URL);
  if (!res.ok) throw new Error(`Dataset fetch failed: ${res.status}`);
  const json = (await res.json()) as {
    rows: Array<{
      row: {
        audio_id: string;
        audio: Array<{ src: string; type: string }>;
        raw_text: string;
        is_gold_transcript: boolean;
      };
    }>;
  };
  return json.rows.slice(0, n).map((r) => ({
    audio_id: r.row.audio_id,
    audio_url: r.row.audio[0].src,
    text: r.row.raw_text,
    is_gold: r.row.is_gold_transcript,
  }));
}

async function downloadAudio(url: string, dest: string): Promise<void> {
  if (fs.existsSync(dest)) return; // cached
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audio download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

// ── Google TTS ─────────────────────────────────────────────

const ttsClient = new textToSpeech.TextToSpeechClient();

async function generateTtsWav(text: string, dest: string): Promise<void> {
  if (fs.existsSync(dest)) return; // cached

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'ro-RO', name: 'ro-RO-Wavenet-A' },
    audioConfig: {
      audioEncoding: 'LINEAR16',
      sampleRateHertz: 16000, // match wav2vec2 expected rate
    },
  });

  if (!response.audioContent) throw new Error('TTS returned empty audio');
  fs.writeFileSync(dest, response.audioContent as Uint8Array);
}

// ── RunPod Phoneme ASR ─────────────────────────────────────

interface RunPodResponse {
  status: 'COMPLETED' | 'FAILED' | 'IN_QUEUE' | 'IN_PROGRESS' | 'CANCELLED' | 'TIMED_OUT';
  output?: { ipa?: string; duration_sec?: number; device?: string; error?: string };
  error?: string;
  delayTime?: number;
  executionTime?: number;
}

async function getPhonemeIpa(audioPath: string): Promise<string> {
  const audioBuf = fs.readFileSync(audioPath);
  const audioB64 = audioBuf.toString('base64');

  const endpointId = process.env.RUNPOD_PHONEME_RO_ENDPOINT_ID!;
  const apiKey = process.env.RUNPOD_API_KEY!;
  const url = `https://api.runpod.ai/v2/${endpointId}/runsync`;

  // runsync waits up to 90s. Cold starts can exceed that — handle by falling through to async on timeout.
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: { audio: audioB64 } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RunPod HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as RunPodResponse;

  if (data.status === 'FAILED' || data.status === 'CANCELLED' || data.status === 'TIMED_OUT') {
    throw new Error(`RunPod job ${data.status}: ${data.error ?? data.output?.error ?? 'unknown'}`);
  }
  if (data.status !== 'COMPLETED') {
    // runsync timed out before cold start finished — would need polling. For spike, surface clearly.
    throw new Error(
      `RunPod returned status=${data.status} (likely cold-start exceeded 90s; re-run when warmed up)`
    );
  }
  if (data.output?.error) {
    throw new Error(`Handler error: ${data.output.error}`);
  }
  if (!data.output?.ipa) {
    throw new Error(`RunPod returned no IPA: ${JSON.stringify(data).slice(0, 200)}`);
  }

  if (data.delayTime && data.delayTime > 1000) {
    console.log(`    (cold start: ${(data.delayTime / 1000).toFixed(1)}s queue + ${(data.executionTime ?? 0) / 1000}s inference)`);
  }
  return data.output.ipa;
}

// ── IPA diff (simple Needleman-Wunsch on phoneme tokens) ──

function tokenize(ipa: string): string[] {
  return ipa.trim().split(/\s+/).filter(Boolean);
}

interface AlignedPair {
  a: string | null;
  b: string | null;
  match: boolean;
}

function alignIpa(a: string[], b: string[]): AlignedPair[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const GAP = -1;
  const MISMATCH = -1;
  const MATCH = 2;

  for (let i = 0; i <= m; i++) dp[i][0] = i * GAP;
  for (let j = 0; j <= n; j++) dp[0][j] = j * GAP;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const score = a[i - 1] === b[j - 1] ? MATCH : MISMATCH;
      dp[i][j] = Math.max(dp[i - 1][j - 1] + score, dp[i - 1][j] + GAP, dp[i][j - 1] + GAP);
    }
  }

  const aligned: AlignedPair[] = [];
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? MATCH : MISMATCH)) {
      aligned.push({ a: a[i - 1], b: b[j - 1], match: a[i - 1] === b[j - 1] });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + GAP) {
      aligned.push({ a: a[i - 1], b: null, match: false });
      i--;
    } else {
      aligned.push({ a: null, b: b[j - 1], match: false });
      j--;
    }
  }
  return aligned.reverse();
}

function diffStats(aligned: AlignedPair[]): {
  matches: number;
  substitutions: number;
  insertions: number;
  deletions: number;
  per: number;
} {
  let matches = 0,
    sub = 0,
    ins = 0,
    del = 0;
  for (const p of aligned) {
    if (p.match) matches++;
    else if (p.a && p.b) sub++;
    else if (!p.a) ins++;
    else del++;
  }
  const total = matches + sub + Math.max(ins, del);
  return {
    matches,
    substitutions: sub,
    insertions: ins,
    deletions: del,
    per: total > 0 ? (sub + ins + del) / total : 0,
  };
}

function renderAligned(aligned: AlignedPair[]): string {
  const top = aligned.map((p) => (p.a ?? '·').padEnd(3)).join(' ');
  const bot = aligned.map((p) => (p.b ?? '·').padEnd(3)).join(' ');
  const mark = aligned.map((p) => (p.match ? ' ' : '✗').padEnd(3)).join(' ');
  return `${top}\n${bot}\n${mark}`;
}

// ── User audio detection ──────────────────────────────────

function findUserAudio(index: number): string | null {
  if (!fs.existsSync(USER_AUDIO_DIR)) return null;
  const prefix = String(index).padStart(2, '0') + '-';
  const files = fs.readdirSync(USER_AUDIO_DIR);
  const match = files.find((f) => f.startsWith(prefix) && /\.(wav|mp3|webm|ogg|m4a)$/i.test(f));
  return match ? path.join(USER_AUDIO_DIR, match) : null;
}

// ── Report ─────────────────────────────────────────────────

function writeReport(results: SampleResult[]) {
  const lines: string[] = [];
  lines.push('# Phoneme Pronunciation Spike — Findings');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Model: \`${PHONEME_MODEL}\``);
  lines.push(`Source: ${DATASET_NAME}`);
  lines.push('');
  lines.push('## Per-sample results');
  lines.push('');

  for (const r of results) {
    lines.push(`### Sample ${r.index}`);
    lines.push('');
    lines.push(`**Transcript:** _${r.text}_  `);
    lines.push(`**Audio ID:** \`${r.audioId}\``);
    lines.push('');

    if (r.errors.length) {
      lines.push('**Errors:**');
      for (const e of r.errors) lines.push(`- ${e}`);
      lines.push('');
      continue;
    }

    if (r.nativeIpa !== null) {
      lines.push('**Native IPA:** `' + r.nativeIpa + '`');
    }
    if (r.ttsIpa !== null) {
      lines.push('**TTS reference IPA:** `' + r.ttsIpa + '`');
    }
    if (r.userIpa !== null) {
      lines.push(`**User IPA** (\`${path.basename(r.userFile!)}\`): \`${r.userIpa}\``);
    }
    lines.push('');

    // Native vs TTS comparison (the architecture-validating one)
    if (r.nativeIpa && r.ttsIpa) {
      const a = tokenize(r.nativeIpa);
      const b = tokenize(r.ttsIpa);
      const aligned = alignIpa(a, b);
      const stats = diffStats(aligned);
      lines.push('#### Native vs TTS reference');
      lines.push('');
      lines.push(
        `Phoneme error rate: **${(stats.per * 100).toFixed(1)}%** ` +
          `(matches=${stats.matches}, substitutions=${stats.substitutions}, ` +
          `insertions=${stats.insertions}, deletions=${stats.deletions})`
      );
      lines.push('');
      lines.push('```');
      lines.push(renderAligned(aligned));
      lines.push('```');
      lines.push('');
    }

    if (r.userIpa && r.ttsIpa) {
      const a = tokenize(r.userIpa);
      const b = tokenize(r.ttsIpa);
      const aligned = alignIpa(a, b);
      const stats = diffStats(aligned);
      lines.push('#### User vs TTS reference');
      lines.push('');
      lines.push(`Phoneme error rate: **${(stats.per * 100).toFixed(1)}%**`);
      lines.push('');
      lines.push('```');
      lines.push(renderAligned(aligned));
      lines.push('```');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // Aggregate
  const validPairs = results.filter((r) => r.nativeIpa && r.ttsIpa);
  if (validPairs.length) {
    const pers = validPairs.map((r) => {
      const a = tokenize(r.nativeIpa!);
      const b = tokenize(r.ttsIpa!);
      return diffStats(alignIpa(a, b)).per;
    });
    const avgPer = pers.reduce((s, x) => s + x, 0) / pers.length;
    lines.push('## Architecture-decision summary');
    lines.push('');
    lines.push(
      `Average phoneme error rate (native vs TTS reference): **${(avgPer * 100).toFixed(1)}%** ` +
        `across ${validPairs.length} samples`
    );
    lines.push('');
    lines.push(
      'If this is **<15%**, the symmetric-ASR-via-TTS approach is viable — ' +
        'real learner errors will stand out clearly above this baseline noise.'
    );
    lines.push(
      'If **15-30%**, marginal — model may need fine-tuning or a different reference strategy.'
    );
    lines.push('If **>30%**, the model is too noisy on Romanian for this approach.');
  }

  const reportPath = path.join(OUT_DIR, 'report.md');
  fs.writeFileSync(reportPath, lines.join('\n'));
  console.log(`\nReport written: ${reportPath}`);
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  checkEnv();
  ensureDir(OUT_DIR);
  ensureDir(USER_AUDIO_DIR);

  console.log(`Pulling ${SAMPLE_COUNT} samples from ${DATASET_NAME}…`);
  const samples = await fetchDatasetSamples(SAMPLE_COUNT);

  const results: SampleResult[] = [];

  for (let i = 0; i < samples.length; i++) {
    const idx = i + 1;
    const sample = samples[i];
    const result: SampleResult = {
      index: idx,
      text: sample.text,
      audioId: sample.audio_id,
      nativeIpa: null,
      ttsIpa: null,
      userIpa: null,
      userFile: null,
      errors: [],
    };

    const idxStr = String(idx).padStart(2, '0');
    const nativePath = path.join(OUT_DIR, `native-${idxStr}.wav`);
    const ttsPath = path.join(OUT_DIR, `tts-${idxStr}.wav`);

    console.log(`\n[${idx}/${samples.length}] ${sample.text.slice(0, 70)}…`);

    try {
      console.log(`  Downloading native audio…`);
      await downloadAudio(sample.audio_url, nativePath);

      console.log(`  Running phoneme ASR on native audio…`);
      result.nativeIpa = await getPhonemeIpa(nativePath);
      console.log(`    → ${result.nativeIpa.slice(0, 80)}${result.nativeIpa.length > 80 ? '…' : ''}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ✗ Native pipeline failed: ${msg}`);
      result.errors.push(`native: ${msg}`);
    }

    try {
      console.log(`  Generating TTS audio…`);
      await generateTtsWav(sample.text, ttsPath);

      console.log(`  Running phoneme ASR on TTS audio…`);
      result.ttsIpa = await getPhonemeIpa(ttsPath);
      console.log(`    → ${result.ttsIpa.slice(0, 80)}${result.ttsIpa.length > 80 ? '…' : ''}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ✗ TTS pipeline failed: ${msg}`);
      result.errors.push(`tts: ${msg}`);
    }

    const userFile = findUserAudio(idx);
    if (userFile) {
      result.userFile = userFile;
      try {
        console.log(`  Running phoneme ASR on user audio (${path.basename(userFile)})…`);
        result.userIpa = await getPhonemeIpa(userFile);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`  ✗ User pipeline failed: ${msg}`);
        result.errors.push(`user: ${msg}`);
      }
    }

    results.push(result);
  }

  writeReport(results);
}

main().catch((e) => {
  console.error('Spike failed:', e);
  process.exit(1);
});
