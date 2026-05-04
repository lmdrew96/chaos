// scripts/import-vocab-subtlex-es.ts
// ChaosLengua — Phase 1A vocab catalog importer.
//
// Pipeline:
//   1. Read SUBTLEX-ESP wordform frequencies from a local TSV/CSV
//   2. Take top N wordforms (default 4000)
//   3. Batch through Claude Haiku 4.5 to enrich:
//        wordform → { lemma, partOfSpeech, glossEn, gender?, ipa, exampleEs,
//                     exampleEn, cefrLevel }
//   4. Cache enriched results to disk so re-runs skip the API
//   5. Group by lemma (sum frequencies, keep first/best gloss)
//   6. Take top 1500 lemmas, insert into vocab_items
//
// SUBTLEX-ESP source:
//   Cuetos, F., Glez-Nosti, M., Barbón, A., & Brysbaert, M. (2011).
//   SUBTLEX-ESP: Spanish word frequencies based on film subtitles.
//   Psicológica, 32, 133–143.
//
// To get the file:
//   1. Visit https://www.um.es/lincoling/web/php/cog/subtlex-esp.php
//      (Universidad de Murcia — official distribution page)
//   2. Download SUBTLEX-ESP.zip and unzip
//   3. Save SUBTLEX-ESP.xlsx to apps/chaoslengua/content/
//
// The script reads .xlsx directly (preferred — handles encoding correctly
// and finds the canonical full-wordlist sheet automatically). It will also
// accept .tsv/.txt if you converted manually, but the xlsx route avoids
// encoding pitfalls (Excel's "Save As Text" on Mac defaults to Latin-1)
// and the multi-sheet hazard (Excel exports only the active sheet).
//
// Column auto-detect: needs a "Word" column and a frequency column
// (prefers "Freq. per million" / SUBTLWF, then "Freq. count" / FREQcount,
// then any column containing "freq").
//
// Usage:
//   npx tsx scripts/import-vocab-subtlex-es.ts --limit=50              (test run, 50 wordforms)
//   npx tsx scripts/import-vocab-subtlex-es.ts --full                  (production, ~4000 wordforms → 1500 lemmas)
//   npx tsx scripts/import-vocab-subtlex-es.ts --skip-enrich           (re-import from cached enrichment)
//   npx tsx scripts/import-vocab-subtlex-es.ts --dry-run               (skip the DB insert)
//   npx tsx scripts/import-vocab-subtlex-es.ts --input=path/to/file    (custom input path)

import { db } from '@/lib/db';
import { vocabItems, partOfSpeechEnum } from '@/lib/db/schema';
import type { NewVocabItem, PartOfSpeech, CEFRLevelEnum } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// ─── Config ───────────────────────────────────────────────

// Auto-detect: prefers .xlsx (most reliable), falls back to .tsv/.txt if present
const DEFAULT_INPUT = (() => {
  const candidates = [
    'content/SUBTLEX-ESP.xlsx',
    'content/subtlex-esp.xlsx',
    'content/subtlex-esp.tsv',
    'content/SUBTLEX-ESP.txt',
    'content/subtlex-esp.txt',
  ];
  for (const c of candidates) {
    const abs = resolve(process.cwd(), c);
    if (fs.existsSync(abs)) return abs;
  }
  return resolve(process.cwd(), 'content/SUBTLEX-ESP.xlsx');
})();
const ENRICH_CACHE = resolve(process.cwd(), 'content/vocab-enriched.json');
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
const ENRICH_BATCH_SIZE = 25;
const TOP_LEMMAS_TARGET = 1500;
const DEFAULT_WORDFORM_LIMIT = 4000;

// ─── CLI args ─────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (name: string) => args.some(a => a === name || a.startsWith(`${name}=`));
const arg = (name: string) => {
  const found = args.find(a => a.startsWith(`${name}=`));
  return found ? found.split('=')[1] : undefined;
};

const isFull = flag('--full');
const isDryRun = flag('--dry-run');
const skipEnrich = flag('--skip-enrich');
const inputPath = arg('--input') ?? DEFAULT_INPUT;
const wordformLimit = isFull
  ? DEFAULT_WORDFORM_LIMIT
  : parseInt(arg('--limit') ?? '50', 10);

// ─── Types ────────────────────────────────────────────────

type SubtlexRow = { wordform: string; freq: number };

type EnrichedWord = {
  wordform: string;
  freq: number;
  lemma: string;
  partOfSpeech: PartOfSpeech;
  glossEn: string;
  gender?: 'm' | 'f' | 'mf' | 'n';
  ipa?: string;
  exampleEs?: string;
  exampleEn?: string;
  cefrLevel?: CEFRLevelEnum;
};

// ─── SUBTLEX-ESP parser ───────────────────────────────────

// SUBTLEX-ESP's distributed xlsx has multiple sheets; the canonical full
// wordform list is named "Words sorted by frequency" (or similar). We
// auto-detect by picking the sheet with the most rows, which is reliably
// the full wordform corpus.
function loadRowsFromXlsx(filePath: string): { headers: string[]; rows: string[][] } {
  const workbook = XLSX.readFile(filePath);
  let bestSheet: string | null = null;
  let bestRowCount = 0;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1');
    const rowCount = range.e.r - range.s.r + 1;
    if (rowCount > bestRowCount) {
      bestRowCount = rowCount;
      bestSheet = sheetName;
    }
  }
  if (!bestSheet) throw new Error('xlsx contained no sheets with data');
  console.log(`   xlsx sheets: [${workbook.SheetNames.join(', ')}] → using "${bestSheet}" (${bestRowCount} rows)`);

  const sheet = workbook.Sheets[bestSheet];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: '' });
  if (matrix.length < 2) throw new Error(`xlsx sheet "${bestSheet}" has no data rows`);
  const headers = (matrix[0] as unknown[]).map(c => String(c ?? '').trim());
  const rows = matrix.slice(1).map(r => (r as unknown[]).map(c => String(c ?? '').trim()));
  return { headers, rows };
}

function loadRowsFromText(filePath: string): { headers: string[]; rows: string[][] } {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) throw new Error(`text file appears empty or has no data rows`);
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = lines.slice(1).map(l => l.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, '')));
  return { headers, rows };
}

function parseSubtlex(filePath: string, limit: number): SubtlexRow[] {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ SUBTLEX-ESP file not found at: ${filePath}`);
    console.error('   See script header for download instructions.');
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  let headers: string[];
  let rawRows: string[][];
  try {
    if (ext === '.xlsx' || ext === '.xls') {
      ({ headers, rows: rawRows } = loadRowsFromXlsx(filePath));
    } else {
      ({ headers, rows: rawRows } = loadRowsFromText(filePath));
    }
  } catch (err) {
    console.error(`❌ Failed to load ${filePath}: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  // SUBTLEX-ESP's distributed xlsx splits the wordlist across multiple
  // side-by-side alphabetical blocks (e.g. cols 0-3 = A-words, 5-8 = D-words,
  // 10-13 = N-words). We collect ALL Word/freq column pairs and combine.
  type ColPair = { wordIdx: number; freqIdx: number };
  const blocks: ColPair[] = [];
  for (let i = 0; i < headers.length; i++) {
    if (!/^word(form)?$/i.test(headers[i])) continue;
    // Find the matching frequency column within the next few columns
    let freqIdx = -1;
    for (let j = i + 1; j < Math.min(headers.length, i + 5); j++) {
      const h = headers[j];
      if (/per million/i.test(h) || /^subtlwf$/i.test(h)) { freqIdx = j; break; }
    }
    if (freqIdx === -1) {
      for (let j = i + 1; j < Math.min(headers.length, i + 5); j++) {
        const h = headers[j];
        if (/freq.*count|count.*freq|^freqcount$/i.test(h)) { freqIdx = j; break; }
      }
    }
    if (freqIdx === -1) {
      for (let j = i + 1; j < Math.min(headers.length, i + 5); j++) {
        if (/freq/i.test(headers[j])) { freqIdx = j; break; }
      }
    }
    if (freqIdx !== -1) blocks.push({ wordIdx: i, freqIdx });
  }
  if (blocks.length === 0) {
    console.error(`❌ Could not find any Word+frequency column pairs in headers: ${headers.join(' | ')}`);
    process.exit(1);
  }
  console.log(`   Detected ${blocks.length} word/freq column block(s):`);
  for (const b of blocks) console.log(`     • "${headers[b.wordIdx]}" (col ${b.wordIdx}) + "${headers[b.freqIdx]}" (col ${b.freqIdx})`);

  const rows: SubtlexRow[] = [];
  for (const cols of rawRows) {
    for (const { wordIdx, freqIdx } of blocks) {
      const wordform = cols[wordIdx];
      const freqRaw = cols[freqIdx];
      if (!wordform || !freqRaw) continue;
      const freq = parseFloat(freqRaw.replace(',', '.'));
      if (isNaN(freq)) continue;
      // Filter: Spanish letters only (skip proper nouns starting uppercase, punctuation, numerals)
      if (!/^[a-záéíóúñü]+$/i.test(wordform)) continue;
      rows.push({ wordform: wordform.toLowerCase(), freq });
    }
  }

  // Sort descending by frequency
  rows.sort((a, b) => b.freq - a.freq);

  // Dedupe by wordform (case-folded duplicates collapse)
  const seen = new Set<string>();
  const deduped: SubtlexRow[] = [];
  for (const r of rows) {
    if (seen.has(r.wordform)) continue;
    seen.add(r.wordform);
    deduped.push(r);
    if (deduped.length >= limit) break;
  }

  return deduped;
}

// ─── Claude enrichment ────────────────────────────────────

const ENRICH_SYSTEM_PROMPT = `You are a Spanish lexicographer enriching wordforms for an A1-B1 CALL app.

For each Spanish wordform given, return a JSON object with:
  - "wordform": the input wordform (echoed back exactly)
  - "lemma": the dictionary form (infinitive for verbs, masculine singular for nouns/adjectives, base form for everything else)
  - "partOfSpeech": one of: noun, verb, adjective, adverb, pronoun, preposition, conjunction, determiner, interjection, numeral
  - "glossEn": 1-3 word English meaning, lowercase
  - "gender": for nouns/adjectives only — one of "m", "f", "mf" (epicene), or omit if N/A
  - "ipa": IPA transcription of the lemma in general Latin American Spanish, in slashes (e.g. "/aˈβlaɾ/")
  - "exampleEs": one Spanish sentence (5-12 words) using the lemma in a natural context. Constraint: use ONLY A1-grammar — present tense, simple indicative, no preterite, no subjunctive, no compound tenses. Do NOT include the English translation in parentheses.
  - "exampleEn": the English translation of exampleEs (separate field, not embedded)
  - "cefrLevel": CEFR level per the Plan Curricular del Instituto Cervantes — one of "A1", "A2", "B1", "B2", "C1", "C2"

Return a JSON array, one object per input wordform, in the same order.
Output ONLY the JSON array — no preamble, no markdown fencing, no commentary.`;

async function enrichBatch(batch: SubtlexRow[]): Promise<EnrichedWord[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in environment');

  const userPrompt = `Enrich these Spanish wordforms:\n\n${batch.map((r, i) => `${i + 1}. ${r.wordform}`).join('\n')}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: [
        { type: 'text', text: ENRICH_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> };
  const textBlock = data.content.find(c => c.type === 'text');
  if (!textBlock) throw new Error('No text content in Anthropic response');

  // Strip optional markdown fencing just in case
  const jsonText = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  let parsed: Array<Omit<EnrichedWord, 'freq'>>;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    throw new Error(`Failed to parse enrichment JSON: ${e}\nRaw response:\n${textBlock.text.slice(0, 500)}`);
  }

  // Stitch frequencies back in by wordform
  const freqByWord = new Map(batch.map(r => [r.wordform, r.freq]));
  const enriched: EnrichedWord[] = [];
  for (const item of parsed) {
    const freq = freqByWord.get(item.wordform);
    if (freq === undefined) continue; // skip if Claude returned an unexpected wordform
    if (!partOfSpeechEnum.includes(item.partOfSpeech)) continue; // skip unrecognized POS
    enriched.push({ ...item, freq });
  }

  return enriched;
}

async function enrichAll(rows: SubtlexRow[]): Promise<EnrichedWord[]> {
  const out: EnrichedWord[] = [];
  const totalBatches = Math.ceil(rows.length / ENRICH_BATCH_SIZE);
  for (let i = 0; i < rows.length; i += ENRICH_BATCH_SIZE) {
    const batch = rows.slice(i, i + ENRICH_BATCH_SIZE);
    const batchNum = Math.floor(i / ENRICH_BATCH_SIZE) + 1;
    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${batch.length} wordforms)... `);
    try {
      const enriched = await enrichBatch(batch);
      out.push(...enriched);
      console.log(`✓ (${enriched.length} returned)`);
    } catch (err) {
      console.log(`✗`);
      console.error(`     ${err instanceof Error ? err.message : err}`);
      // Continue with next batch rather than failing the whole import
    }
  }
  return out;
}

// ─── Aggregation ──────────────────────────────────────────

type LemmaRecord = {
  lemma: string;
  partOfSpeech: PartOfSpeech;
  totalFreq: number;
  best: EnrichedWord; // representative wordform (highest individual freq)
};

function aggregateByLemma(enriched: EnrichedWord[]): LemmaRecord[] {
  const map = new Map<string, LemmaRecord>();
  for (const e of enriched) {
    const key = `${e.lemma}|${e.partOfSpeech}`;
    const existing = map.get(key);
    if (existing) {
      existing.totalFreq += e.freq;
      if (e.freq > existing.best.freq) existing.best = e;
    } else {
      map.set(key, {
        lemma: e.lemma,
        partOfSpeech: e.partOfSpeech,
        totalFreq: e.freq,
        best: e,
      });
    }
  }
  // Resolve lemma collisions across POS — keep the highest-frequency POS per lemma
  const byLemma = new Map<string, LemmaRecord>();
  for (const rec of map.values()) {
    const existing = byLemma.get(rec.lemma);
    if (!existing || rec.totalFreq > existing.totalFreq) {
      byLemma.set(rec.lemma, rec);
    }
  }
  return [...byLemma.values()].sort((a, b) => b.totalFreq - a.totalFreq);
}

// ─── DB insert ────────────────────────────────────────────

async function insertVocab(records: LemmaRecord[]): Promise<void> {
  console.log(`\n💾 Replacing existing source='subtlex_esp' rows in vocab_items...`);
  await db.delete(vocabItems).where(eq(vocabItems.source, 'subtlex_esp'));

  const rows: NewVocabItem[] = records.slice(0, TOP_LEMMAS_TARGET).map((rec, idx) => ({
    lemma: rec.lemma,
    partOfSpeech: rec.partOfSpeech,
    cefrLevel: rec.best.cefrLevel ?? null,
    frequencyRank: idx + 1,
    gender: rec.best.gender ?? null,
    ipa: rec.best.ipa ?? null,
    glossEn: rec.best.glossEn,
    exampleEs: rec.best.exampleEs ?? null,
    exampleEn: rec.best.exampleEn ?? null,
    collocations: null,
    source: 'subtlex_esp',
  }));

  // Insert in chunks to keep request size sane
  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await db.insert(vocabItems).values(rows.slice(i, i + chunkSize));
  }
  console.log(`✅ Inserted ${rows.length} vocab items`);
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log('📚 ChaosLengua vocab importer (SUBTLEX-ESP → vocab_items)\n');
  console.log(`   mode: ${isFull ? 'FULL (4000 wordforms)' : `LIMITED (${wordformLimit} wordforms)`}`);
  console.log(`   dry-run: ${isDryRun}`);
  console.log(`   skip-enrich: ${skipEnrich}\n`);

  let enriched: EnrichedWord[];

  if (skipEnrich) {
    if (!fs.existsSync(ENRICH_CACHE)) {
      console.error(`❌ --skip-enrich requested but cache not found at ${ENRICH_CACHE}`);
      process.exit(1);
    }
    console.log(`📂 Loading enrichment cache from ${ENRICH_CACHE}`);
    enriched = JSON.parse(fs.readFileSync(ENRICH_CACHE, 'utf-8'));
    console.log(`   Loaded ${enriched.length} enriched wordforms\n`);
  } else {
    console.log(`📥 Reading SUBTLEX-ESP from ${inputPath}`);
    const rows = parseSubtlex(inputPath, wordformLimit);
    console.log(`   Took top ${rows.length} wordforms\n`);

    console.log(`🤖 Enriching via ${ANTHROPIC_MODEL} (batch size ${ENRICH_BATCH_SIZE})`);
    enriched = await enrichAll(rows);
    console.log(`\n   Total enriched: ${enriched.length}/${rows.length}`);

    fs.mkdirSync(path.dirname(ENRICH_CACHE), { recursive: true });
    fs.writeFileSync(ENRICH_CACHE, JSON.stringify(enriched, null, 2));
    console.log(`💾 Cached enrichment to ${ENRICH_CACHE}\n`);
  }

  console.log(`🔗 Aggregating by lemma...`);
  const lemmas = aggregateByLemma(enriched);
  console.log(`   ${enriched.length} wordforms → ${lemmas.length} unique lemmas`);
  console.log(`   Will insert top ${Math.min(lemmas.length, TOP_LEMMAS_TARGET)}\n`);

  if (isDryRun) {
    console.log(`🔍 DRY RUN — first 20 lemmas that would be inserted:`);
    lemmas.slice(0, 20).forEach((l, i) => {
      console.log(`   ${i + 1}. ${l.lemma} (${l.partOfSpeech}, ${l.best.cefrLevel ?? '?'}) — ${l.best.glossEn}`);
    });
    process.exit(0);
  }

  await insertVocab(lemmas);
  console.log('\n🎉 Done.');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
