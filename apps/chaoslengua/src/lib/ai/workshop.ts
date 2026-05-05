// src/lib/ai/workshop.ts
// Workshop challenge generation and evaluation using Groq (FREE)
// ChaosLengua Spanish version — adapted from ChaosLimbă's workshop.ts

import { callGroq, type ChatMessage } from '@chaos/ai-clients';
import { analyzeGrammar, type GrammarResult, type GrammarError } from './grammar';
import type { GrammarFeature, CEFRLevelEnum, AdaptationTier } from '@/lib/db/schema';

// ─── Types ───

export type GrammarChallengeType = 'transform' | 'complete' | 'fix' | 'rewrite';
export type VocabChallengeType = 'use_it' | 'which_one' | 'spot_the_trap';
export type WorkshopChallengeType = GrammarChallengeType | VocabChallengeType;

export interface WorkshopChallenge {
  type: WorkshopChallengeType;
  prompt: string;
  targetSentence?: string;
  expectedAnswers: string[];
  options?: string[];
  hint: string;
  grammarRule: string;
  featureKey: string;
  featureName: string;
  isSurprise?: boolean;
}

export interface WorkshopEvaluation {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
  correction?: string;
  ruleExplanation: string;
  grammarErrors: GrammarError[];
  usedTargetStructure: boolean;
  beautifulMistake?: {
    isBeautiful: boolean;
    note: string;
  };
}

// ─── Challenge Type Selection ───

const GRAMMAR_CHALLENGE_TYPES: GrammarChallengeType[] = ['transform', 'complete', 'fix', 'rewrite'];
const VOCAB_CHALLENGE_TYPES: VocabChallengeType[] = ['use_it', 'which_one', 'spot_the_trap'];

function pickRandomChallengeType(
  feature: GrammarFeature,
  recentTypes?: WorkshopChallengeType[]
): WorkshopChallengeType {
  // Phonology features are filtered upstream in getWorkshopFeatureTarget — only
  // grammar / vocabulary_domain reach here.
  const pool = feature.category === 'vocabulary_domain'
    ? [...VOCAB_CHALLENGE_TYPES]
    : [...GRAMMAR_CHALLENGE_TYPES];

  // Filter out the most recent type to avoid consecutive repeats
  if (recentTypes?.length) {
    const lastType = recentTypes[recentTypes.length - 1];
    const filtered = pool.filter(t => t !== lastType);
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── JSON Cleaning ───

function cleanGroqJson(output: string): string {
  return output
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim();
}

// ─── Challenge Validation ───

// Spanish diacritics: á, é, í, ó, ú, ü, ñ (plus their capitals and inverted punctuation)
const SPANISH_DIACRITICS_REGEX = /[áéíóúüñÁÉÍÓÚÜÑ¿¡]/;

interface ChallengeValidationResult {
  valid: boolean;
  reason?: string;
}

function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[.,!?¿¡;:"""''„"«»\s]+/g, ' ').trim();
}

function validateChallenge(
  parsed: Record<string, unknown>,
  challengeType: WorkshopChallengeType
): ChallengeValidationResult {
  const prompt = parsed.prompt as string | undefined;
  const targetSentence = parsed.targetSentence as string | undefined;
  const expectedAnswers = Array.isArray(parsed.expectedAnswers)
    ? (parsed.expectedAnswers as string[])
    : [];

  // FIX validation: targetSentence must NOT be identical to any expected answer
  // (i.e., it must actually contain an error)
  if (challengeType === 'fix' && targetSentence && expectedAnswers.length > 0) {
    const normalizedTarget = normalizeForComparison(targetSentence);
    const matchesExpected = expectedAnswers.some(
      ea => normalizeForComparison(ea) === normalizedTarget
    );
    if (matchesExpected) {
      return {
        valid: false,
        reason: 'FIX challenge targetSentence is identical to an expected answer (no actual error present)',
      };
    }
  }

  // REWRITE validation: prompt must be in English, not Spanish
  // Check for Spanish diacritics/punctuation which strongly indicate Spanish text
  if (challengeType === 'rewrite' && prompt) {
    if (SPANISH_DIACRITICS_REGEX.test(prompt)) {
      return {
        valid: false,
        reason: 'REWRITE challenge prompt contains Spanish diacritics/punctuation — it should be an English sentence to translate',
      };
    }
  }

  return { valid: true };
}

// ─── Challenge Generation ───

const CHALLENGE_SYSTEM_PROMPT = `You are a Spanish language teaching assistant creating micro-challenges for learners.
You MUST respond with valid JSON only. No markdown, no explanation outside JSON.

IMPORTANT RULES:
- All Spanish text must use proper diacritics (á, é, í, ó, ú, ü, ñ) and punctuation (¿, ¡)
- Keep challenges concise (1-2 sentences max)
- Match the CEFR level strictly — don't exceed the learner's level
- For A1-A2: use simple vocabulary, present tense, basic structures
- For B1+: can use past tenses, subjunctive mood, more complex structures
- Provide 2-4 acceptable answers (accounting for valid variations, e.g. voseo/tuteo where the feature allows it)
- The hint should nudge without giving away the answer

CRITICAL GRAMMAR — Your Spanish MUST be correct:
- Ser/estar selection matters: "Es médico" (profession → ser) vs "Está cansado" (temporary state → estar). Never mix these up.
- "Gustar"-type verbs agree with the THING LIKED, not the person: "Me gusta el libro" (singular) vs "Me gustan los libros" (plural). NEVER "Me gustan el libro".
- Preterite vs imperfect is about ASPECT, not time: preterite for completed bounded events, imperfect for ongoing/habitual/descriptive states. Both refer to the past.
- Subject-verb agreement in person/number: "Él come", "Ellos comen", "Nosotros comemos".
- Gender agreement: "la casa blanca", NOT "la casa blanco"; "los libros rojos", NOT "los libros rojo".
- Check all verb-subject/object agreement before outputting.

CRITICAL CONSTRAINT — MATCH THE TARGET FEATURE:
- The challenge MUST test the EXACT grammar feature specified, not a different one.
- If the target feature is "Ser vs Estar — Location", every choice point MUST force a location context (where estar is required). Do NOT slip in identity or profession contexts.
- If the target feature is "Preterite vs Imperfect — Aspect Selection", the challenge must require choosing between the two tenses based on aspect. Do NOT test only preterite formation or only imperfect formation.
- If the target feature is "Regular -ar Verbs", every verb tested MUST be a truly regular -ar verb (hablar, trabajar, estudiar, caminar, preparar, mirar). Do NOT use irregular -ar verbs like "dar" (doy, not *daro) or "estar" (estoy, not *esto).
- Do NOT substitute irregular verbs, reflexive verbs, or verbs from other conjugation groups when testing regular patterns.
- The answer the learner needs to produce MUST directly demonstrate the target feature.

DIALECTAL NEUTRALITY DEFAULT:
- Default to neutral Latin American Spanish: use "ustedes" for plural you (not "vosotros"), use "tú" for informal singular (not "vos"), accept seseo (no /θ/ distinction required in spelling decisions).
- If the feature explicitly targets Peninsular Spanish, vosotros forms, or Rioplatense voseo, you may use those forms — but only when the feature name makes this explicit.
- When producing examples, avoid regionally-marked vocabulary where a neutral alternative exists (e.g., prefer "coche" or "auto" over "carro" unless the feature is about regional lexical variation).

LANGUAGE OF PROMPTS AND HINTS:
- For A1-A2 learners: Write the "prompt" and "hint" fields in simple Spanish followed by an English translation in parentheses. Example: "Completa la oración con la forma correcta. (Complete the sentence with the correct form.)"
- For B1+: Write prompts and hints entirely in Spanish — no English translation needed.`;

function buildChallengePrompt(
  feature: GrammarFeature,
  userLevel: CEFRLevelEnum,
  challengeType: WorkshopChallengeType
): string {
  const typeInstructions: Record<WorkshopChallengeType, string> = {
    transform: `TRANSFORM challenge: Put the Spanish sentence in "targetSentence". In "prompt", give a CLEAR instruction telling the learner exactly what transformation to make (e.g., "Change the subject to 'nosotros' and adjust the verb accordingly." or "Rewrite this sentence in the negative form." or "Change this sentence from preterite to imperfect."). The instruction must be specific — never just "transform this sentence".`,
    complete: `COMPLETE challenge: Put the sentence with a blank (___) in "prompt". The blank REPLACES the answer word entirely — do NOT include the infinitive or base form next to the blank. The blank should test the target grammar feature. Set "targetSentence" to null — the prompt already contains the sentence, so do NOT duplicate it in targetSentence.`,
    fix: `FIX challenge: Put a sentence with a DELIBERATE grammar error in "targetSentence". The error MUST be clearly wrong — for example, wrong ser/estar choice, wrong verb conjugation, wrong gender agreement, wrong object pronoun placement. The "expectedAnswers" must contain the CORRECTED version(s) of the sentence. CRITICAL: the "targetSentence" MUST be DIFFERENT from every expectedAnswer because it contains the error. Example for ser/estar: "Mi hermano es cansado hoy" is WRONG (should be "está cansado"), so you test if the learner can fix "es" → "está". In "prompt", describe the sentence and the error to find.`,
    rewrite: `REWRITE challenge: The "prompt" MUST be written ENTIRELY IN ENGLISH — it is an English sentence or idea that the learner will translate into Spanish. Example prompt: "She reads books every evening." NEVER include Spanish words, Spanish diacritics (á, é, í, ó, ú, ñ), Spanish punctuation (¿, ¡), or Spanish sentences in the "prompt" field. The whole point is the learner produces the Spanish themselves. Set "targetSentence" to null.`,
    use_it: `USE IT challenge: In "prompt", give a Spanish word or phrase (bolded with **) and tell the learner to write a complete sentence using it. Example: "Write a sentence using **gustar** (to like/be pleasing to)." Set "targetSentence" to null.`,
    which_one: `WHICH ONE challenge: Give 3-4 Spanish sentences as options. Only one uses the target vocabulary/structure correctly. The learner picks the correct one. Return the options in the "options" JSON array (NOT in the prompt text). The "prompt" should only contain the question/instruction, e.g. "Which sentence correctly uses 'estar' for location?"`,
    spot_the_trap: `SPOT THE TRAP challenge: Put the tricky sentence in "targetSentence". In "prompt", tell the learner: "This sentence looks correct but has a subtle error. What's wrong?" The error should relate to the target feature (false cognate like "embarazada" meaning pregnant not embarrassed, wrong agreement, por/para confusion, etc).`,
  };

  const isBeginnerLevel = userLevel === 'A1' || userLevel === 'A2';
  const languageNote = isBeginnerLevel
    ? `\nIMPORTANT — This is an A1-A2 beginner. The "prompt" and "hint" MUST be written in simple Spanish with an English translation in parentheses afterward.
For COMPLETE challenges: the English translation must show the meaning of the missing word in *italics* (markdown) instead of a blank. Example prompt: "Yo ___ manzanas todos los días. (I *eat* apples every day.)"
Example hint: "Usa la forma correcta del verbo **comer** en la primera persona singular. (Use the correct form of the verb **comer** in the first person singular.)"
For other challenge types: follow the same bilingual pattern. Example: "Cambia la oración a la forma negativa. (Change the sentence to the negative form.)"`
    : '';

  return `Create a ${challengeType.toUpperCase()} challenge for a ${userLevel} Spanish learner.

Target feature: "${feature.featureName}" (key: ${feature.featureKey})
${feature.description ? `Description: ${feature.description}` : ''}
Category: ${feature.category}
CEFR Level: ${userLevel}${languageNote}

Challenge type instructions:
${typeInstructions[challengeType]}

Respond with this exact JSON structure:
{
  "type": "${challengeType}",
  "prompt": "The instruction or content the learner reads (what they need to do or respond to)",
  "targetSentence": "The Spanish sentence to work with (null if the prompt IS the content, like rewrite/use_it)",
  "expectedAnswers": ["correct answer 1", "correct answer variation 2"],
  ${challengeType === 'which_one' ? '"options": ["Option A sentence", "Option B sentence", "Option C sentence", "Option D sentence"],\n  ' : ''}"hint": "A helpful hint that doesn't give away the answer",
  "grammarRule": "Brief explanation of the grammar rule being tested"
}

IMPORTANT: The UI shows a static task instruction above your "prompt" text, so your "prompt" should contain the SPECIFIC content of this challenge (the sentence, the English idea, etc), not generic instructions like "Rewrite this sentence". Be specific and concrete.`;
}

export async function generateWorkshopChallenge(
  feature: GrammarFeature,
  userLevel: CEFRLevelEnum,
  challengeType?: WorkshopChallengeType,
  destabilizationTier?: AdaptationTier,
  recentTypes?: WorkshopChallengeType[],
  forceSurprise?: boolean
): Promise<WorkshopChallenge> {
  // At tier 2+: force production/correction challenge types
  let type: WorkshopChallengeType;
  if (destabilizationTier && destabilizationTier >= 2 && feature.category !== 'vocabulary_domain') {
    const productionTypes: GrammarChallengeType[] = ['transform', 'fix'];
    type = productionTypes[Math.floor(Math.random() * productionTypes.length)];
  } else if (forceSurprise && recentTypes?.length) {
    // Surprise round: flip category preference — if recent was mostly grammar, pick vocab type (or vice versa)
    const recentGrammar = recentTypes.filter(t => GRAMMAR_CHALLENGE_TYPES.includes(t as GrammarChallengeType)).length;
    const recentVocab = recentTypes.length - recentGrammar;
    const pool = recentGrammar >= recentVocab ? [...VOCAB_CHALLENGE_TYPES] : [...GRAMMAR_CHALLENGE_TYPES];
    type = pool[Math.floor(Math.random() * pool.length)];
  } else {
    type = challengeType || pickRandomChallengeType(feature, recentTypes);
  }

  let userPrompt = buildChallengePrompt(feature, userLevel, type);

  // Add destabilization instruction at tier 3
  if (destabilizationTier === 3) {
    userPrompt += `\n\nDESTABILIZATION MODE: This learner is fossilizing on "${feature.featureName}".
Create a challenge where their typical error would produce a CLEARLY wrong meaning, making the correct form feel necessary rather than arbitrary.
The goal is cognitive disequilibrium — make the learner FEEL why the correct form matters.
Example for ser/estar fossilization: contrast "es aburrido" (is boring, trait) vs "está aburrido" (is bored, state) in a context where the wrong choice becomes semantically absurd.`;
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: CHALLENGE_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ];

  // Try up to 2 attempts (initial + 1 retry) with validation
  let parsed: Record<string, unknown> | null = null;
  let validationResult: ChallengeValidationResult = { valid: true };
  const MAX_ATTEMPTS = 2;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const temperature = attempt === 0 ? 0.8 : 0.7;
    const currentMessages = attempt === 0
      ? messages
      : [
          ...messages,
          { role: 'assistant' as const, content: 'I understand. Let me regenerate.' },
          { role: 'user' as const, content: `The previous challenge was invalid: ${validationResult.reason}. Please fix this issue and regenerate. Remember: ${type === 'fix' ? 'The targetSentence MUST contain a real grammar error — it must be DIFFERENT from the expectedAnswers.' : type === 'rewrite' ? 'The prompt MUST be in English only — no Spanish text, diacritics, or inverted punctuation.' : 'Ensure the challenge correctly tests the target feature.'}` },
        ];

    let output: string;
    try {
      output = await callGroq(currentMessages, temperature);
    } catch {
      console.error(`[Workshop] Groq call failed on attempt ${attempt + 1}`);
      continue;
    }

    try {
      parsed = JSON.parse(cleanGroqJson(output));
    } catch {
      console.error(`[Workshop] Failed to parse challenge JSON on attempt ${attempt + 1}`);
      continue;
    }

    // Validate the parsed challenge (parsed is guaranteed non-null here — JSON.parse succeeded)
    validationResult = validateChallenge(parsed!, type);
    if (validationResult.valid) {
      break; // Good challenge, use it
    }

    parsed = null; // Reset so we retry — validation failed
  }

  // If all attempts failed, use fallback
  if (!parsed) {
    console.error('[Workshop] All attempts failed, using fallback challenge');
    return {
      type,
      prompt: type === 'rewrite'
        ? 'Write a simple sentence in Spanish using the present tense.'
        : `Practice the grammar feature: ${feature.featureName}`,
      expectedAnswers: [],
      hint: `Focus on: ${feature.featureName}`,
      grammarRule: feature.description || feature.featureName,
      featureKey: feature.featureKey,
      featureName: feature.featureName,
      isSurprise: forceSurprise || undefined,
    };
  }

  // Validate which_one has proper options
  let options = Array.isArray(parsed.options) ? parsed.options as string[] : undefined;
  if (type === 'which_one' && (!options || options.length < 3)) {
    // which_one missing options, falling back to fix type
    return generateWorkshopChallenge(feature, userLevel, 'fix', destabilizationTier, recentTypes);
  }

  // Validate expectedAnswers align with options for which_one
  let expectedAnswers = Array.isArray(parsed.expectedAnswers) ? parsed.expectedAnswers as string[] : [];
  if (type === 'which_one' && options && expectedAnswers.length > 0) {
    const hasMatch = expectedAnswers.some(ea =>
      options!.some(opt => opt.toLowerCase().includes(ea.toLowerCase()) || ea.toLowerCase().includes(opt.toLowerCase()))
    );
    if (!hasMatch) {
      // Default to first option as expected if LLM misaligned
      expectedAnswers = [options[0]];
    }
  }

  // Strip targetSentence for types where the prompt IS the content (avoids duplicate display)
  const noTargetSentenceTypes: WorkshopChallengeType[] = ['complete', 'rewrite', 'use_it'];
  const rawTarget = (parsed.targetSentence as string) || undefined;
  const targetSentence = noTargetSentenceTypes.includes(type) ? undefined : rawTarget;

  return {
    type: (parsed.type as WorkshopChallengeType) || type,
    prompt: parsed.prompt as string,
    targetSentence,
    expectedAnswers,
    options,
    hint: (parsed.hint as string) || '',
    grammarRule: (parsed.grammarRule as string) || '',
    featureKey: feature.featureKey,
    featureName: feature.featureName,
    isSurprise: forceSurprise || undefined,
  };
}

// ─── Response Evaluation ───

const EVALUATION_SYSTEM_PROMPT = `You are a Spanish language evaluator. Assess a learner's response to a grammar/vocabulary challenge.
You MUST respond with valid JSON only.

Evaluation criteria:
1. Did they use the target grammar structure correctly?
2. Is the answer semantically correct?
3. Are there any additional grammar errors?
4. Be encouraging — errors are learning opportunities, not failures.

IMPORTANT:
- ALL feedback, explanations, and rule descriptions MUST be written in English — the learner's native language. Only use Spanish for corrections, example sentences, and grammatical forms.
- Be lenient with minor spelling differences. Missing diacritics (accents on vowels, ñ, inverted ¿ or ¡) is a warning, not an error — mention it in feedback but do not drop the score below 80 if the answer is otherwise correct.
- Accept valid alternative phrasings
- Accept regional variation as CORRECT when the feature allows it:
  * If the feature is not explicitly about voseo, treat "vos tenés" and "tú tienes" as equally valid
  * If the feature is not explicitly about vosotros, treat "ustedes" and "vosotros" as equally valid in plural second-person contexts
  * Accept "coche" / "auto" / "carro" interchangeably unless the feature targets regional lexical variation
- Score 80-100 for correct with minor issues, 50-79 for partially correct, 0-49 for incorrect

CRITICAL — LINGUISTIC ACCURACY:
- Your ruleExplanation MUST be linguistically accurate. Use the authoritative feature description as your primary reference for grammar rules.
- If a verb has irregular forms (e.g., "ir" → "voy/vas/va", not *iro/*iras/*ira), do NOT claim it follows a regular conjugation pattern.
- Verify that any example verbs you cite actually follow the conjugation pattern you describe.
- For ser/estar rules: be precise about semantic category (identity/profession/time/origin → ser; location/temporary state/progressive → estar). Do not offer "permanent vs temporary" as the rule — this is a common misleading oversimplification.
- For preterite vs imperfect: explain by ASPECT (completed/bounded vs ongoing/habitual/descriptive), not by time adverbs alone.
- The correction and ruleExplanation must be consistent — never give a correct form that contradicts your rule explanation.`;

function buildEvaluationPrompt(
  challenge: WorkshopChallenge,
  response: string,
  userLevel: CEFRLevelEnum,
  featureDescription?: string
): string {
  return `Evaluate this ${userLevel} learner's response to a Spanish ${challenge.type} challenge.

Challenge prompt: "${challenge.prompt}"
${challenge.targetSentence ? `Target sentence: "${challenge.targetSentence}"` : ''}
Expected answers: ${JSON.stringify(challenge.expectedAnswers)}
Grammar rule being tested: "${challenge.grammarRule}"
Feature: "${challenge.featureName}" (${challenge.featureKey})
${featureDescription ? `Authoritative feature description: "${featureDescription}"` : ''}

Learner's response: "${response}"

Respond with this exact JSON:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Encouraging feedback about their answer",
  "correction": "The correct form if wrong (null if correct)",
  "ruleExplanation": "Brief explanation of the grammar rule and how it applies — use the authoritative feature description as your primary reference",
  "usedTargetStructure": true/false
}`;
}

export async function evaluateWorkshopResponse(
  challenge: WorkshopChallenge,
  response: string,
  userLevel: CEFRLevelEnum,
  featureDescription?: string
): Promise<WorkshopEvaluation> {
  // Step 1: Grammar analysis via existing Claude Haiku (cached)
  let grammarResult: GrammarResult | null = null;
  try {
    grammarResult = await analyzeGrammar(response);
  } catch (error) {
    console.error('[Workshop] Grammar analysis failed, continuing with Groq eval:', error);
  }

  // Step 2: Semantic evaluation via Groq
  const messages: ChatMessage[] = [
    { role: 'system', content: EVALUATION_SYSTEM_PROMPT },
    { role: 'user', content: buildEvaluationPrompt(challenge, response, userLevel, featureDescription) },
  ];

  const output = await callGroq(messages, 0.3); // Low temperature for consistent evaluation

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleanGroqJson(output));
  } catch {
    console.error('[Workshop] Failed to parse evaluation JSON, using grammar-only result');
    const hasGrammarErrors = grammarResult?.errors && grammarResult.errors.length > 0;
    return {
      isCorrect: !hasGrammarErrors,
      score: hasGrammarErrors ? 40 : 70,
      feedback: hasGrammarErrors ? 'There are some grammar issues to work on.' : 'Good effort! Keep practicing.',
      correction: undefined,
      ruleExplanation: challenge.grammarRule,
      grammarErrors: grammarResult?.errors || [],
      usedTargetStructure: false,
      beautifulMistake: grammarResult?.beautifulMistake,
    };
  }

  return {
    isCorrect: parsed.isCorrect as boolean ?? false,
    score: typeof parsed.score === 'number' ? parsed.score : 0,
    feedback: (parsed.feedback as string) || 'Keep practicing!',
    correction: (parsed.correction as string) || undefined,
    ruleExplanation: (parsed.ruleExplanation as string) || challenge.grammarRule,
    grammarErrors: grammarResult?.errors || [],
    usedTargetStructure: parsed.usedTargetStructure as boolean ?? false,
    beautifulMistake: grammarResult?.beautifulMistake,
  };
}
