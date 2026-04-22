// src/lib/ai/error-enrichment.ts
// Groq-powered error category enrichment for smarter Error Garden clustering.
//
// When errors are logged, Groq normalizes the raw category into a specific
// sub-category from a fixed Spanish taxonomy. This makes simple
// errorType+category clustering much more precise without query-time ML.
//
// Taxonomy design reference: docs/pedagogy/error-garden-taxonomy-es.md

import { callGroq } from './groq';

// Fixed ES taxonomy per error type. Groq picks the best match.
// Category names are aligned with grammarFeatureMap keys in
// scripts/seed-grammar-features-es.ts so mapErrorCategoryToFeatureKey()
// stays mostly 1:1. See the taxonomy doc for L1-interference priors
// and stage targeting.

const GRAMMAR_CATEGORIES = [
  // Ser vs Estar — Stage 1 iconic fossilization point
  'ser_vs_estar_core',
  'ser_vs_estar_meaning_shift',

  // Aspect — Stage 1 iconic fossilization point
  'preterite_formation',
  'imperfect_formation',
  'preterite_vs_imperfect_aspect',
  'preterite_imperfect_meaning_shift',

  // Object pronouns — Stage 1 target
  'direct_object_pronouns',
  'indirect_object_pronouns',
  'combined_object_pronouns',
  'personal_a',

  // Por vs Para — Stage 1 iconic fossilization point
  'por_vs_para',

  // Gender & articles
  'gender_agreement',
  'definite_article_omission',
  'indefinite_article_overuse',
  'article_contraction',

  // Verb conjugation (Stage 1 morphology)
  'present_tense_regular',
  'present_tense_stem_change',
  'present_tense_irregular',
  'future_ir_a',
  'informal_commands',
  'reflexive_verbs',

  // Supporting A1/A2 structures
  'comparisons',
  'possessives',
  'gustar_construction',
  'tener_idioms',
  'double_negation',

  // Orthographic / catch-all
  'accent_marks',
  'spelling',
  'general_grammar',
] as const;

const PRONUNCIATION_CATEGORIES = [
  'vowel_purity',
  'trill_rr',
  'flap_vs_trill_contrast',
  'palatal_nasal_n',
  'velar_fricative_j',
  'sibilant_s',
  'consonant_b_v',
  'stress_placement',
  'general_pronunciation',
] as const;

const VOCABULARY_CATEGORIES = [
  'false_cognate',
  'collocation',
  'register_formality',
  'regional_variation_lexical',
  'semantic_range',
  'lexical_choice',
  'general_vocabulary',
] as const;

const WORD_ORDER_CATEGORIES = [
  'adjective_noun_position',
  'adjective_meaning_shift_position',
  'clitic_order',
  'question_inversion',
  'adverb_placement',
  'general_word_order',
] as const;

const TAXONOMY: Record<string, readonly string[]> = {
  grammar: GRAMMAR_CATEGORIES,
  pronunciation: PRONUNCIATION_CATEGORIES,
  vocabulary: VOCABULARY_CATEGORIES,
  word_order: WORD_ORDER_CATEGORIES,
};

interface ErrorForEnrichment {
  errorType: string;
  rawCategory: string;
  context: string | null | undefined;
  correction: string | null | undefined;
}

interface EnrichmentResult {
  error?: number;
  index?: number;
  category: string;
}

// System prompt for the Groq classifier.
// Dialectal policy: LatAm-neutral baseline, accept voseo/vosotros/leísmo
// as dialectal features, not errors. Regional lexical variation is not
// itself a grammar error. See §5 of the taxonomy doc.
const CLASSIFIER_SYSTEM_PROMPT = [
  'You are a Spanish language error classifier for an SLA-grounded learning app.',
  '',
  'For each error below, pick the single best matching category from the valid',
  'categories list. Respond with JSON: {"results": [{"error": 1, "category": "..."}]}.',
  'Only use categories from the valid list provided for each error.',
  '',
  'DIALECTAL POLICY:',
  '- Default target dialect is LatAm-neutral (seseo, yeísmo, ustedes as 2pl).',
  '- Do NOT classify the following as grammar errors:',
  '  • voseo conjugations (vos tenés, vos comés, vos vivís)',
  '  • vosotros forms (habláis, coméis)',
  '  • Peninsular leísmo (le vi = "I saw him" for masculine human DO)',
  '  • Standard regional lexical variants (coche / carro / auto)',
  '- If multiple regional variants appear inconsistently within a single production,',
  '  classify as "register_formality" (pronoun register) or "regional_variation_lexical"',
  '  (word-choice), not a grammar error.',
  '',
  'ACCURACY POLICY:',
  '- Prefer specific categories over general ones when the error is diagnosable.',
  '- Fall back to "general_grammar" / "general_pronunciation" / "general_vocabulary"',
  '  / "general_word_order" only when the raw category truly does not fit any',
  '  specific bin.',
].join('\n');

/**
 * Enrich error categories using Groq (Llama 3.3 70B).
 *
 * Takes a batch of errors and returns normalized categories from the fixed taxonomy.
 * Falls back to the raw category if Groq fails or returns invalid data.
 */
export async function enrichErrorCategories(
  errors: ErrorForEnrichment[]
): Promise<string[]> {
  if (errors.length === 0) return [];

  // Skip enrichment for errors that already match the taxonomy exactly
  const needsEnrichment: { index: number; error: ErrorForEnrichment }[] = [];
  const results: string[] = errors.map(e => e.rawCategory);

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];
    const validCategories = TAXONOMY[error.errorType];
    if (validCategories && !validCategories.includes(error.rawCategory)) {
      needsEnrichment.push({ index: i, error });
    }
  }

  if (needsEnrichment.length === 0) {
    return results; // All categories already in taxonomy
  }

  try {
    const errorDescriptions = needsEnrichment.map(({ error }, i) => {
      const parts = [`Error ${i + 1} (${error.errorType}):`];
      if (error.context) parts.push(`  Learner wrote: "${error.context}"`);
      if (error.correction) parts.push(`  Correct form: "${error.correction}"`);
      parts.push(`  Raw category: "${error.rawCategory}"`);
      parts.push(`  Valid categories: ${TAXONOMY[error.errorType]!.join(', ')}`);
      return parts.join('\n');
    }).join('\n\n');

    const response = await callGroq([
      {
        role: 'system',
        content: CLASSIFIER_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: errorDescriptions,
      },
    ], 0.1, true);

    const parsed = JSON.parse(response);

    if (parsed.results && Array.isArray(parsed.results)) {
      for (const result of parsed.results as EnrichmentResult[]) {
        const errorNum = ((result.error ?? result.index) ?? 0) - 1;
        if (errorNum >= 0 && errorNum < needsEnrichment.length) {
          const { index, error } = needsEnrichment[errorNum];
          const validCategories = TAXONOMY[error.errorType];
          // Only accept if the returned category is actually in our taxonomy
          if (validCategories && validCategories.includes(result.category)) {
            results[index] = result.category;
          }
        }
      }
    }

  } catch (err) {
    console.error('[Error Enrichment] Groq enrichment failed, using raw categories:', err);
    // Fall back silently — raw categories are still usable
  }

  return results;
}
