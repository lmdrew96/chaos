/**
 * Phoneme-level pronunciation primitives.
 *
 * Two concerns split apart for flexibility:
 *   1. transcribeToIpa  — calls a self-hosted RunPod wav2vec2-phoneme endpoint
 *                         to convert an audio buffer to IPA tokens (space-separated).
 *   2. comparePhonemes  — Needleman-Wunsch alignment of two IPA token streams,
 *                         returning per-phoneme alignment + error stats.
 *
 * The TTS-reference generation and caching strategy live in the consuming app
 * (e.g., chaoslimba's lib/pronunciation/reference-cache) so that this package
 * stays free of provider deps and apps can choose their own cache backend.
 *
 * Required env (per language):
 *   RUNPOD_API_KEY                   — shared across all phoneme endpoints
 *   RUNPOD_PHONEME_RO_ENDPOINT_ID    — Romanian endpoint (chaoslimba)
 *   RUNPOD_PHONEME_ES_ENDPOINT_ID    — Spanish endpoint (chaoslengua, future)
 */

export type PhonemeLanguage = 'ro' | 'es';

const ENDPOINT_ENV_VAR: Record<PhonemeLanguage, string> = {
  ro: 'RUNPOD_PHONEME_RO_ENDPOINT_ID',
  es: 'RUNPOD_PHONEME_ES_ENDPOINT_ID',
};

export interface PhonemeAlignment {
  user: string | null;       // null = phoneme appears in reference, not user (deletion from user's POV)
  reference: string | null;  // null = phoneme appears in user, not reference (insertion)
  match: boolean;
}

export interface PhonemeAnalysis {
  userIpa: string;
  referenceIpa: string;
  alignment: PhonemeAlignment[];
  matches: number;
  substitutions: number;
  insertions: number;        // user said extra phonemes not in reference
  deletions: number;         // user missed phonemes that should have been there
  phonemeErrorRate: number;  // 0-1, lower better
  phonemeAccuracy: number;   // clamp(1 - PER, 0, 1)
}

export class PhonemeAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhonemeAnalysisError';
  }
}

export class PhonemeNotConfiguredError extends PhonemeAnalysisError {
  constructor(language: PhonemeLanguage) {
    super(
      `Phoneme analysis not configured for language="${language}". ` +
      `Set ${ENDPOINT_ENV_VAR[language]} and RUNPOD_API_KEY in env.`
    );
    this.name = 'PhonemeNotConfiguredError';
  }
}

/**
 * Returns true iff RUNPOD_API_KEY and the language-specific endpoint env var are both set.
 * Use this to decide whether to enable phoneme analysis without throwing.
 */
export function isPhonemeAnalysisAvailable(language: PhonemeLanguage): boolean {
  const endpoint = process.env[ENDPOINT_ENV_VAR[language]];
  const apiKey = process.env.RUNPOD_API_KEY;
  return Boolean(endpoint && apiKey);
}

interface RunPodResponse {
  status: string;
  output?: { ipa?: string; error?: string; duration_sec?: number; device?: string };
  error?: string;
  delayTime?: number;
  executionTime?: number;
}

/**
 * Send an audio buffer to the RunPod phoneme ASR endpoint and return the IPA transcription.
 * IPA is returned as a single string with phoneme tokens separated by whitespace
 * (matching the wav2vec2-xlsr-53-espeak-cv-ft tokenizer's decode format).
 *
 * @throws PhonemeNotConfiguredError if env vars are missing
 * @throws PhonemeAnalysisError on RunPod errors or unexpected response shapes
 */
export async function transcribeToIpa(
  audioBuffer: Buffer,
  language: PhonemeLanguage
): Promise<string> {
  if (!isPhonemeAnalysisAvailable(language)) {
    throw new PhonemeNotConfiguredError(language);
  }

  const endpointId = process.env[ENDPOINT_ENV_VAR[language]]!;
  const apiKey = process.env.RUNPOD_API_KEY!;
  const audioB64 = audioBuffer.toString('base64');
  const url = `https://api.runpod.ai/v2/${endpointId}/runsync`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: { audio: audioB64 } }),
    });
  } catch (e) {
    throw new PhonemeAnalysisError(
      `RunPod request failed: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new PhonemeAnalysisError(`RunPod HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  let data: RunPodResponse;
  try {
    data = (await res.json()) as RunPodResponse;
  } catch {
    throw new PhonemeAnalysisError('RunPod returned non-JSON response');
  }

  if (data.status !== 'COMPLETED') {
    throw new PhonemeAnalysisError(
      `RunPod job status=${data.status}: ${data.error ?? data.output?.error ?? 'unknown error'}`
    );
  }
  if (data.output?.error) {
    throw new PhonemeAnalysisError(`Phoneme handler error: ${data.output.error}`);
  }
  if (typeof data.output?.ipa !== 'string') {
    throw new PhonemeAnalysisError('RunPod returned no IPA');
  }

  return data.output.ipa;
}

/**
 * Tokenize an IPA string into individual phoneme tokens.
 * The wav2vec2-xlsr-53-espeak-cv-ft model emits space-separated tokens; multi-char
 * tokens like "tʃ", "aʊ", "iː" are preserved as single tokens.
 */
export function tokenizeIpa(ipa: string): string[] {
  return ipa.trim().split(/\s+/).filter(Boolean);
}

/**
 * Compare two IPA token streams using Needleman-Wunsch global alignment.
 * Returns per-position alignment and error stats.
 */
export function comparePhonemes(userIpa: string, referenceIpa: string): PhonemeAnalysis {
  const userTokens = tokenizeIpa(userIpa);
  const refTokens = tokenizeIpa(referenceIpa);

  const alignment = alignTokens(userTokens, refTokens);
  const stats = computeStats(alignment);

  return {
    userIpa,
    referenceIpa,
    alignment,
    ...stats,
  };
}

function alignTokens(a: string[], b: string[]): PhonemeAlignment[] {
  const m = a.length;
  const n = b.length;
  const GAP = -1;
  const MISMATCH = -1;
  const MATCH = 2;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i * GAP;
  for (let j = 0; j <= n; j++) dp[0][j] = j * GAP;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const score = a[i - 1] === b[j - 1] ? MATCH : MISMATCH;
      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + score,
        dp[i - 1][j] + GAP,
        dp[i][j - 1] + GAP
      );
    }
  }

  const aligned: PhonemeAlignment[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const matchScore = a[i - 1] === b[j - 1] ? MATCH : MISMATCH;
      if (dp[i][j] === dp[i - 1][j - 1] + matchScore) {
        aligned.push({ user: a[i - 1], reference: b[j - 1], match: a[i - 1] === b[j - 1] });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + GAP)) {
      aligned.push({ user: a[i - 1], reference: null, match: false });
      i--;
    } else {
      aligned.push({ user: null, reference: b[j - 1], match: false });
      j--;
    }
  }
  return aligned.reverse();
}

function computeStats(aligned: PhonemeAlignment[]) {
  let matches = 0;
  let substitutions = 0;
  let insertions = 0; // user said extra phonemes (reference is null)
  let deletions = 0;  // user missed phonemes (user is null)

  for (const p of aligned) {
    if (p.match) matches++;
    else if (p.user && p.reference) substitutions++;
    else if (p.reference === null) insertions++;
    else deletions++;
  }

  // Standard PER denominator: reference length (= matches + substitutions + deletions).
  // Falls back to alignment length when reference is empty.
  const refLen = matches + substitutions + deletions;
  const denom = refLen > 0 ? refLen : aligned.length || 1;
  const phonemeErrorRate = (substitutions + insertions + deletions) / denom;
  const phonemeAccuracy = Math.max(0, Math.min(1, 1 - phonemeErrorRate));

  return {
    matches,
    substitutions,
    insertions,
    deletions,
    phonemeErrorRate,
    phonemeAccuracy,
  };
}
