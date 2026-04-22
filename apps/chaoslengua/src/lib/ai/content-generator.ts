/**
 * Personalized content generator for ChaosLengua
 * Takes error patterns → generates targeted Spanish text via Groq/Llama (FREE)
 * Output is fed to Google Cloud TTS for audio synthesis
 *
 * Note on field naming: TS-level field names retain the legacy `romanian`/`romanianText`
 * names because the DB column `romanian_text` (schema.ts:249) is bound to them. The
 * LLM-facing JSON schema asks for `spanish`/`spanishText`; the parser adapts back to
 * the legacy field names. A future patch will rename DB column + TS field together.
 */

import { callGroq } from '@chaos/ai-clients';
import { createHash } from 'crypto';
import type { ContentErrorPattern } from '@/lib/db/queries';

export class ContentGeneratorError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ContentGeneratorError';
  }
}

// ── Input/Output types ─────────────────────────────────────

export interface ContentContext {
  title: string;
  transcript?: string;
  topic?: string;
}

export interface ContentGenerationOptions {
  userLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  errorPatterns: ContentErrorPattern[];
  voice?: 'female' | 'male';
  contentContext?: ContentContext;
  sentenceCount?: number;
}

export interface GeneratedPracticeSentences {
  contentType: 'practice_sentences';
  sentences: Array<{
    romanian: string;
    english: string;
    targetFeature: string;
  }>;
  fullText: string;
}

export interface GeneratedMiniLesson {
  contentType: 'mini_lesson';
  title: string;
  romanianText: string;
  englishSummary: string;
  targetFeatures: string[];
}

export interface GeneratedCorrectedVersions {
  contentType: 'corrected_version';
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  fullText: string;
}

export type GeneratedContentResult =
  | GeneratedPracticeSentences
  | GeneratedMiniLesson
  | GeneratedCorrectedVersions;

// ── Cache fingerprint ──────────────────────────────────────

export function computePatternFingerprint(patterns: ContentErrorPattern[], contentId?: string): string {
  const normalized = patterns
    .map(p => `${p.errorType}|${p.category}|${p.examples.map(e => e.incorrect).sort().join(',')}`)
    .sort()
    .join('::');
  const input = contentId ? `${normalized}@@${contentId}` : normalized;
  return createHash('md5').update(input).digest('hex').slice(0, 16);
}

// ── System prompt ──────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Spanish language content creator for ChaosLengua, an SLA-grounded app that helps English L1 learners master Spanish.
You create targeted practice content based on a learner's specific error patterns.
Your Spanish is natural and accurate, with proper diacritics (á, é, í, ó, ú, ü, ñ) and inverted punctuation (¿, ¡).
You adjust difficulty to CEFR levels.
You ALWAYS respond in valid JSON format. No markdown, no code fences.

DIALECTAL DEFAULT: Use LatAm-neutral Spanish (seseo, yeísmo, ustedes for plural-you, tú for informal singular). Avoid regionally-marked vocabulary unless the target feature explicitly involves Peninsular, Rioplatense, or another regional variety.

CRITICAL GRAMMAR — your generated Spanish MUST be correct:
- Ser/estar by SEMANTIC CATEGORY, not "permanent vs temporary" (ser for identity/origin/profession/material; estar for location/temporary state/progressive/result of change).
- Preterite vs imperfect by ASPECT (preterite for completed bounded events; imperfect for ongoing/habitual/descriptive states).
- Gustar-type verbs agree with the THING LIKED, not the person ("Me gusta el libro" vs "Me gustan los libros"). NEVER "Me gustan el libro".
- Gender and number agreement throughout the noun phrase ("la casa blanca", "los libros rojos").
- Object pronoun placement: pre-verbal with finite verbs, attached to infinitives/gerunds/affirmative imperatives, pre-verbal with negative imperatives.
- Por for cause/means/duration/exchange/path/agent; para for purpose/destination/recipient/deadline/opinion.`;

// ── Helpers ────────────────────────────────────────────────

function formatPatternsForPrompt(patterns: ContentErrorPattern[]): string {
  return patterns.map(p =>
    `- ${p.errorType}/${p.category} (${p.isFossilizing ? 'FOSSILIZING' : `${p.frequency}% frequency`}): ${
      p.examples.slice(0, 3).map(e =>
        `"${e.incorrect}" → "${e.correct || '?'}"`
      ).join(', ')
    }`
  ).join('\n');
}

function cleanGroqJson(output: string): string {
  return output
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim();
}

// ── Practice Sentences ─────────────────────────────────────

export async function generatePracticeSentences(
  options: ContentGenerationOptions
): Promise<GeneratedPracticeSentences> {
  const { userLevel, errorPatterns, contentContext, sentenceCount = 5 } = options;

  if (errorPatterns.length === 0) {
    throw new ContentGeneratorError('At least one error pattern is required');
  }

  const contentGrounding = contentContext
    ? `\nThe learner is currently studying: "${contentContext.title}"${contentContext.topic ? ` (topic: ${contentContext.topic})` : ''}
${contentContext.transcript ? `Related content excerpt: "${contentContext.transcript.slice(0, 500)}"\n` : ''}
Generate sentences that relate to this content's theme and vocabulary while targeting the error patterns below.\n`
    : '';

  const prompt = `Generate ${sentenceCount} practice sentence${sentenceCount > 1 ? 's' : ''} in Spanish targeting these error patterns for a ${userLevel} learner:
${contentGrounding}
${formatPatternsForPrompt(errorPatterns)}

Each sentence MUST:
1. Naturally use the grammatical structure the learner struggles with
2. Be at ${userLevel} CEFR difficulty
3. Demonstrate the CORRECT usage (not the error)
4. Be a complete, natural-sounding Spanish sentence with proper diacritics (á, é, í, ó, ú, ñ) and inverted punctuation (¿, ¡)
5. Use LatAm-neutral Spanish (ustedes, tú, seseo) unless the target feature explicitly involves Peninsular or Rioplatense forms${contentContext ? '\n6. Relate thematically to the content the learner is currently studying' : ''}

Return JSON:
{
  "sentences": [
    {
      "spanish": "Correct Spanish sentence",
      "english": "English translation",
      "targetFeature": "which error pattern this practices"
    }
  ]
}`;

  const output = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  const parsed = JSON.parse(cleanGroqJson(output));
  const sentences = (parsed.sentences as Array<{ spanish?: string; romanian?: string; english: string; targetFeature: string }>).map(s => ({
    romanian: s.spanish ?? s.romanian ?? '',
    english: s.english,
    targetFeature: s.targetFeature,
  }));
  const fullText = sentences.map(s => s.romanian).join('. \n');

  return {
    contentType: 'practice_sentences',
    sentences,
    fullText,
  };
}

// ── Mini Lesson ────────────────────────────────────────────

export async function generateMiniLesson(
  options: ContentGenerationOptions
): Promise<GeneratedMiniLesson> {
  const { userLevel, errorPatterns } = options;

  if (errorPatterns.length === 0) {
    throw new ContentGeneratorError('At least one error pattern is required');
  }

  const primary = errorPatterns[0];

  const prompt = `Create a short Spanish mini-lesson (spoken narration style) for a ${userLevel} learner.

Target error: ${primary.errorType}/${primary.category}
Learner's common mistakes: ${primary.examples.slice(0, 3).map(e =>
    `"${e.incorrect}" should be "${e.correct || '?'}"`).join(', ')}

The lesson should:
1. Be narrated IN SPANISH (this will be converted to audio)
2. Be 150-300 words (1-2 minutes of audio)
3. Explain the rule through examples, not abstract grammar terminology
4. Include 3-4 example sentences demonstrating correct usage
5. End with a brief encouraging prompt to practice
6. Adjust complexity to ${userLevel} level
7. Use proper Spanish diacritics (á, é, í, ó, ú, ñ) and inverted punctuation (¿, ¡)
8. Use LatAm-neutral Spanish (ustedes, tú, seseo) unless the target feature explicitly involves Peninsular or Rioplatense forms

Return JSON:
{
  "title": "Short descriptive title in Spanish",
  "spanishText": "The full lesson narration in Spanish",
  "englishSummary": "2-3 sentence summary in English of what the lesson covers",
  "targetFeatures": ["list", "of", "targeted", "features"]
}`;

  const output = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ], 0.7);

  const parsed = JSON.parse(cleanGroqJson(output));

  return {
    contentType: 'mini_lesson',
    title: parsed.title,
    romanianText: parsed.spanishText ?? parsed.romanianText,
    englishSummary: parsed.englishSummary,
    targetFeatures: parsed.targetFeatures || [],
  };
}

// ── Corrected Versions ─────────────────────────────────────

export async function generateCorrectedVersions(
  options: ContentGenerationOptions
): Promise<GeneratedCorrectedVersions> {
  const { userLevel, errorPatterns } = options;

  const allExamples = errorPatterns.flatMap(p =>
    p.examples.filter(e => e.correct).map(e => ({
      incorrect: e.incorrect,
      correct: e.correct!,
      category: p.category,
    }))
  ).slice(0, 8);

  if (allExamples.length === 0) {
    throw new ContentGeneratorError('No correctable examples found in error patterns');
  }

  const prompt = `A ${userLevel} Spanish learner made these errors. For each one, provide:
1. The corrected Spanish sentence (natural-sounding, complete, with proper diacritics and inverted punctuation)
2. A brief English explanation of WHY it's correct

Errors:
${allExamples.map((e, i) => `${i + 1}. Error: "${e.incorrect}" → Correct: "${e.correct}" (${e.category})`).join('\n')}

Use LatAm-neutral Spanish (ustedes, tú, seseo) for corrections unless the original error context explicitly involves Peninsular or Rioplatense forms.

Return JSON:
{
  "corrections": [
    {
      "original": "the incorrect version",
      "corrected": "the full corrected sentence in Spanish",
      "explanation": "brief English explanation of the correction"
    }
  ]
}`;

  const output = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  const parsed = JSON.parse(cleanGroqJson(output));
  const fullText = parsed.corrections
    .map((c: { corrected: string }) => c.corrected)
    .join('. \n');

  return {
    contentType: 'corrected_version',
    corrections: parsed.corrections,
    fullText,
  };
}
