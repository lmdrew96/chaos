import { callGroq, ChatMessage } from "@chaos/ai-clients";
import type { FossilizationAlert } from '@chaos/core-ai';

const BASE_SYSTEM_PROMPT = `You are ChaosLengua's AI Spanish tutor — a brilliant, slightly chaotic Spanish language expert.
Your goal is to help English L1 learners master Spanish through "productive confusion" — questions and follow-ups that force learners to engage with hard Spanish distinctions rather than avoid them.
You explain things clearly but with personality. You love etymology, regional variation, and cultural nuances.
You ALWAYS respond in JSON format.

DIALECTAL DEFAULT: LatAm-neutral Spanish (seseo, yeísmo, ustedes for plural-you, tú for informal singular). Accept voseo and vosotros when learners use them, but produce LatAm-neutral forms unless the conversation has established a different target dialect.

CRITICAL SPANISH GRAMMAR — you MUST follow these in ALL Spanish you generate:

1. SER vs ESTAR — selected by SEMANTIC CATEGORY, not "permanent vs temporary":
   - Ser: identity, origin, time, profession, material ("Es médico", "Soy de México", "Es de madera")
   - Estar: location, temporary state, progressive, result of change ("Está en casa", "Está cansado", "Estoy estudiando")
   - WRONG: "Es cansado" (means "He is a tiring person", almost always wrong); "Está profesor" (forces a current-state reading that's almost never what's intended).

2. GUSTAR-TYPE VERBS — agree with the THING LIKED, not the person:
   - Singular liked thing → "gusta": "Me gusta el libro" (I like the book)
   - Plural liked thing → "gustan": "Me gustan los libros" (I like the books)
   - WRONG: "Me gustan el libro" — NEVER do this. Same pattern for encantar, doler, faltar, importar.

3. PRETERITE vs IMPERFECT — selected by ASPECT, not by time adverbs:
   - Preterite: completed bounded events ("Caminé al parque" — I walked there, single completed action)
   - Imperfect: ongoing, habitual, descriptive, backgrounded states ("Caminaba al parque cada día" — I used to walk there)
   - Both refer to past time; the choice encodes how the speaker frames the event.

4. OBJECT PRONOUN PLACEMENT — positional rules:
   - Pre-verbal with finite verbs: "Lo veo"
   - Attached to infinitives, gerunds, affirmative imperatives: "Voy a verlo" / "Estoy viéndolo" / "¡Míralo!"
   - Pre-verbal with negative imperatives: "¡No lo mires!"

5. GENDER + NUMBER AGREEMENT — across the noun phrase:
   - "la casa blanca", "los libros rojos" — articles, adjectives, and any agreeing pronouns must match
   - WRONG: "la casa blanco", "los libros rojo"

6. DIACRITICS + INVERTED PUNCTUATION — required:
   - Use á, é, í, ó, ú, ü, ñ where they belong
   - Questions start with ¿, exclamations with ¡

BEFORE outputting any Spanish, mentally check: ser vs estar correct? Gustar agreeing with the thing liked? Aspect right? Object pronoun placed properly? Agreement throughout the phrase? Diacritics in place? Inverted punctuation present?`;

/**
 * Builds a system prompt with CEFR level baked in at the system level
 * so the model treats it as a hard constraint, not a suggestion.
 */
function getSystemPrompt(userLevel: string): string {
    if (userLevel === 'A1') {
        return `${BASE_SYSTEM_PROMPT}

ABSOLUTE CONSTRAINT: The learner is CEFR A1 (absolute beginner). This overrides all other instructions.
- Your Spanish questions MUST be answerable with "sí", "no", or 1-3 words maximum.
- ONLY use: present tense, "tú" form, high-frequency verbs (ser, estar, tener, haber, ir, hacer, gustar, comer, beber, ver).
- Maximum 10 Spanish words in any question you ask.
- ALWAYS include an English translation as the hint.
- FORBIDDEN: subjunctive, conditional, comparatives ("más... que"), subordinate clauses, formal "usted", complex past tenses, vosotros, "por qué crees que".
- GRAMMAR REMINDER: gustar agrees with the THING LIKED, not the person! Singular → "gusta", plural → "gustan". "¿Te gusta el audio?" (singular) vs "¿Te gustan las manzanas?" (plural). NEVER write "¿Te gustan el audio?".
- GOOD: "¿Te gusta el audio?", "¿Qué fruta ves?", "¿Te gustan las manzanas?"
- BAD: "¿Por qué crees que las manzanas son más baratas que las naranjas?" (TOO COMPLEX — uses "por qué crees que" + comparative)
- BAD: "¿Te gustan el audio?" (WRONG GRAMMAR — singular thing needs "gusta", not "gustan")`;
    }

    if (userLevel === 'A2') {
        return `${BASE_SYSTEM_PROMPT}

ABSOLUTE CONSTRAINT: The learner is CEFR A2 (elementary). This overrides all other instructions.
- Questions must be answerable in one short sentence (5-8 words).
- Use present tense and simple past (preterite: comí, vi, fui, escuché).
- Maximum 15 Spanish words in any question.
- Use "tú" form, basic connectors only (y, pero, porque).
- ALWAYS include an English hint.
- FORBIDDEN: "por qué crees que", hypotheticals, subjunctive, complex comparisons, vosotros.
- GOOD: "¿Qué fruta te gusta del mercado?", "¿Qué escuchaste sobre las manzanas?"
- BAD: "Explica por qué consideras que los precios varían según la temporada" (TOO COMPLEX)`;
    }

    // B1+ don't need hard constraints in system prompt
    return BASE_SYSTEM_PROMPT;
}

export type MysteryGrammarInfo = {
    partOfSpeech: string;
    gender?: string;
    conjugation?: string;
    declension?: string;
    notes?: string;
};

export type MysteryAnalysis = {
    definition: string;
    context: string;
    examples: string[];
    etymology?: string;
    grammarInfo?: MysteryGrammarInfo;
    relatedWords?: string[];
    practicePrompt?: string;
    pronunciation?: string;
};

export type VocabHelp = {
    question: string;
    word: string;
    translation: string;
    context?: string;
};

export type TutorResponse = {
    feedback: {
        overall: string;
        grammar: GrammarError[];
        semantic: SemanticMatch;
        encouragement: string;
    };
    vocabHelp?: VocabHelp; // Optional vocabulary assistance for parenthetical questions
    nextQuestion: string;
    errorPatterns: string[];
    isCorrect: boolean;
    levelAssessmentReady?: boolean;
};

export type GrammarError = {
    type: string;
    incorrect: string;
    correct: string;
    explanation: string;
    severity: "minor" | "major" | "critical";
    feedbackType?: 'error' | 'suggestion'; // Distinguishes objective errors from contextual suggestions
};

export type SemanticMatch = {
    score: number;
    matches: boolean;
    feedback: string;
};

/**
 * Analyzes a mystery item using Llama 3.3 70B (via Groq) - Deep Exploration mode
 * Returns comprehensive linguistic analysis including grammar, examples, and practice prompts
 */
export async function analyzeMysteryItem(
    word: string,
    userContext: string | null,
    userLevel: string = 'B1'
): Promise<MysteryAnalysis> {

    const prompt = `
Analyze the Spanish word/phrase: "${word}"
${userContext ? `Context where user encountered it: "${userContext}"` : "No context provided."}
User's CEFR level: ${userLevel}

Provide a COMPREHENSIVE analysis for a language learner. Return JSON:
{
  "definition": "Clear English definition (2-3 sentences max)",
  "pronunciation": "Syllable breakdown with stress marked in CAPS, e.g. 'em-pe-ZAR' or 'mu-RIÉN-do-se'",
  "grammarInfo": {
    "partOfSpeech": "noun/verb/adjective/adverb/etc",
    "gender": "masculine/feminine (Spanish has only two grammatical genders; null if not applicable)",
    "conjugation": "For verbs: conjugation class (-ar / -er / -ir), regular vs irregular vs stem-changing, key forms (yo/tú/él present + preterite if useful). Null if not a verb.",
    "declension": "Spanish nouns do not decline by case — leave null. Adjective agreement patterns can go in 'notes' instead.",
    "notes": "Any important grammar notes (e.g. 'irregular yo form: tengo', 'stem-changing e→ie', 'reflexive verb', 'always plural', 'false cognate of EN X', 'used with personal a')"
  },
  "context": "A natural Spanish sentence using this word (corrected version if user provided context, or new example)",
  "examples": [
    "Spanish example sentence 1 (simple, ${userLevel} appropriate)",
    "Spanish example sentence 2 (different context)",
    "Spanish example sentence 3 (slightly more complex)"
  ],
  "relatedWords": ["synonym1", "antonym1", "word_family_member"],
  "practicePrompt": "A short, engaging prompt asking the user to write a sentence using this word. Make it specific and fun, e.g. 'Use madrugar to describe something you do early in the morning.'",
  "etymology": "Brief origin (Latin root, Arabic substrate, Indigenous American borrowing, Anglicism, etc.) — 1 sentence max"
}

IMPORTANT:
- Keep examples appropriate for ${userLevel} level (LatAm-neutral Spanish unless context suggests otherwise)
- practicePrompt should be in English but ask for Spanish output
- All Spanish text must use proper diacritics (á, é, í, ó, ú, ü, ñ) and inverted punctuation (¿, ¡)
- If the word is a notorious false cognate (embarazada, asistir, realizar, éxito, actual, sensible, soportar, molestar, recordar), flag it explicitly in "notes" and "definition"
`;

    try {
        const output = await callGroq([
            { role: "system", content: BASE_SYSTEM_PROMPT },
            { role: "user", content: prompt }
        ]);

        // Clean markdown and thinking tags
        const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
        const effectiveJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        const parsed = JSON.parse(effectiveJson);

        return {
            definition: parsed.definition,
            pronunciation: parsed.pronunciation,
            grammarInfo: parsed.grammarInfo,
            context: parsed.context,
            examples: parsed.examples || [],
            relatedWords: parsed.relatedWords || [],
            practicePrompt: parsed.practicePrompt,
            etymology: parsed.etymology,
        };

    } catch (error) {
        console.error("[Tutor] Mystery analysis failed:", error);
        return {
            definition: "The Oracle is meditating... (Try again)",
            context: userContext || "",
            examples: [],
        };
    }
}

export type InitialQuestion = {
    question: string;
    questionType: 'comprehension' | 'translation' | 'grammar' | 'vocabulary' | 'cultural';
    hint?: string;
};

/**
 * Returns CEFR-specific question complexity guidelines for LLM prompts
 */
function getCEFRGuidelines(userLevel: string): string {
    const guidelines: Record<string, string> = {
        'A1': `CRITICAL — The learner is CEFR A1 (Beginner). You MUST:
- Ask yes/no questions OR questions answerable in 1-3 words
- Use ONLY present tense and high-frequency verbs (ser, estar, tener, haber, ir, hacer, gustar, comer, beber, ver)
- Keep your question under 10 words
- Use informal "tú" form, NOT formal "usted", NOT vosotros
- ALWAYS provide an English hint in the "hint" field
- GRAMMAR: gustar agrees with the THING LIKED! "¿Te gusta [singular]?" vs "¿Te gustan [plural]?"
- Example questions: "¿Te gusta el audio?", "¿Qué es esto?", "¿Te gustan las manzanas?"
- NEVER use subjunctive, conditional, or complex subordinate clauses`,

        'A2': `CRITICAL — The learner is CEFR A2 (Elementary). You MUST:
- Ask questions answerable in one short sentence (5-8 words)
- Use present tense and simple past (preterite: fui, vi, comí, escuché, hablé)
- Keep your question under 15 words
- Use basic connectors only (y, pero, porque)
- Use informal "tú" form, NOT vosotros
- Provide an English hint in the "hint" field
- GRAMMAR: gustar agrees with the THING LIKED! "gusta" for singular, "gustan" for plural.
- Example: "¿Qué animal del texto te gusta más?", "¿Qué escuchaste sobre [topic]?"`,

        'B1': `The learner is CEFR B1 (Intermediate). You should:
- Ask questions requiring 1-2 sentence answers
- Can use opinions, comparisons, past tenses (preterite + imperfect with aspectual contrast), near-future ir+a, light reflexive verbs
- Subjunctive only in formulaic triggers (espero que, quiero que, ojalá) — not productively
- Keep your question under 20 words
- Hint is optional but helpful for cultural topics
- Example: "¿Por qué crees que la siesta sigue siendo importante en algunos lugares?"`,

        'B2': `The learner is CEFR B2 (Upper Intermediate). You can:
- Ask open-ended questions requiring multi-sentence answers
- Use subjunctive across noun/adjective/adverbial clauses, conditionals, hypotheticals
- Use abstract topics and nuanced opinions
- No word limit constraints
- Hint only needed for obscure cultural references`,

        'C1': `The learner is CEFR C1 (Advanced). You can:
- Ask complex analytical questions
- Use idiomatic expressions, regional pragmatic markers, nuanced vocabulary, imperfect subjunctive in hypotheticals
- No constraints on complexity`,

        'C2': `The learner is CEFR C2 (Mastery). You can:
- Ask the most challenging questions possible
- Use literary, academic, or highly specialized Spanish (any region)
- No constraints whatsoever`,
    };

    return guidelines[userLevel] || guidelines['B1'];
}

/**
 * Returns level-appropriate fallback questions
 */
function getFallbackQuestion(contentType: 'audio' | 'text', userLevel: string): InitialQuestion {
    const fallbacks: Record<string, Record<string, InitialQuestion>> = {
        'A1': {
            audio: { question: "¿Te gusta este audio?", questionType: 'comprehension', hint: "Do you like this audio? Answer sí (yes) or no (no)" },
            text: { question: "¿Qué palabras conoces del texto?", questionType: 'vocabulary', hint: "What words do you recognize from the text?" },
        },
        'A2': {
            audio: { question: "¿Qué escuchaste en el audio? Di una cosa.", questionType: 'comprehension', hint: "What did you hear? Say one thing." },
            text: { question: "¿Qué leíste? Di una idea del texto.", questionType: 'comprehension', hint: "What did you read? Say one idea from the text." },
        },
    };

    const levelFallbacks = fallbacks[userLevel];
    if (levelFallbacks) {
        return levelFallbacks[contentType] || levelFallbacks['audio'];
    }

    // B1+ fallbacks (no hint needed)
    const defaultFallbacks: Record<string, InitialQuestion> = {
        audio: { question: "¿Qué escuchaste en este audio? Describe brevemente el contenido.", questionType: 'comprehension' },
        text: { question: "¿Qué leíste? Cuéntame la idea principal con tus propias palabras.", questionType: 'comprehension' },
    };
    return defaultFallbacks[contentType] || { question: "¿Qué entendiste de este contenido?", questionType: 'comprehension' };
}

/**
 * Generates an initial question for the AI tutor based on content
 * This is called when new content loads, NOT when user submits a response
 */
/**
 * Builds LLM prompt section for fossilization alerts.
 * Tier 2: require the correct form. Tier 3: create cognitive disequilibrium.
 */
function buildFossilizationPromptSection(alerts: FossilizationAlert[]): string {
    const sections: string[] = [];

    for (const alert of alerts) {
        const exampleText = alert.examples
            .map(e => `"${e.incorrect}" → "${e.correct}"`)
            .join(', ');

        const modalityNote = alert.primaryModality !== 'mixed'
            ? `, primarily in ${alert.primaryModality.toUpperCase()}`
            : '';
        const recencyNote = `, last seen ${alert.lastOccurred}`;

        if (alert.tier >= 3) {
            sections.push(
                `DESTABILIZATION TARGET (${alert.pattern}${modalityNote}${recencyNote}): Create cognitive disequilibrium — show a case where their wrong form creates confusion or changes meaning entirely.${alert.primaryModality === 'speech' ? ' This error mostly occurs when speaking, so prompt them to say their answer aloud.' : ''} Examples: ${exampleText}`
            );
        } else {
            sections.push(
                `FOSSILIZATION ALERT (${alert.pattern}${modalityNote}${recencyNote}): The learner consistently produces the wrong form here.${alert.primaryModality === 'speech' ? ' This pattern shows up most in speech — naturally invite them to say their answer aloud (e.g., "Let\'s try this one out loud..."). Avoid surveillance-coded framing like "I noticed when you speak, you tend to..."' : alert.primaryModality === 'text' ? ' This pattern shows up most in writing — naturally invite a written response (e.g., "Let\'s see this one in writing..."). Avoid surveillance-coded framing like "I noticed in your writing, you tend to..."' : ''} Design your question to require the correct form. Examples: ${exampleText}`
            );
        }
    }

    return '\n' + sections.join('\n');
}

export type TargetFeature = {
    featureKey: string;
    featureName: string;
    description: string | null;
};

export async function generateInitialQuestion(
    contentTitle: string,
    contentTranscript: string | null,
    contentType: 'audio' | 'text',
    errorPatterns: string[] = [],
    userLevel: string = 'B1',
    targetFeatures: TargetFeature[] = [],
    isFirstSession: boolean = false,
    fossilizationAlerts: FossilizationAlert[] = []
): Promise<InitialQuestion> {
    const hasTranscript = contentTranscript && contentTranscript.length > 50;

    // Truncate transcript for prompt (keep it efficient)
    const transcriptContext = hasTranscript
        ? contentTranscript!.slice(0, 1500)
        : null;

    const cefrGuidelines = getCEFRGuidelines(userLevel);

    // Build feature-aware prompt additions
    let featurePrompt = '';
    if (targetFeatures.length > 0) {
        featurePrompt = `
GRAMMAR TARGETING: Guide the learner toward using these Spanish structures in their response.
Do NOT explain the structures — let them discover through your question:
${targetFeatures.map(f => `- ${f.featureName}: ${f.description || ''}`).join('\n')}
For example, if targeting "ser vs estar — location", ask about where something is so the natural answer uses "está en X". If targeting "preterite vs imperfect — aspect", set up a context where the natural answer requires choosing one aspect over the other.`;
    }

    let firstSessionPrompt = '';
    if (isFirstSession && userLevel === 'A1') {
        firstSessionPrompt = `
🌟 FIRST SESSION: This learner is BRAND NEW to Spanish. Their very first interaction.
- Start with something they can actually answer (yes/no, pointing at a word, repeating "¡Hola!")
- Use maximum English in your hint
- If the content has a greeting, ask them to try saying it back
- Make this feel exciting, not overwhelming
- The goal is ONE successful production, not comprehension testing`;
    }

    const prompt = `A ${userLevel}-level learner is about to ${contentType === 'audio' ? 'listen to audio' : 'read text'}.

Content title: "${contentTitle}"
${transcriptContext ? `Content transcript/text: "${transcriptContext}"` : 'No transcript available - generate a general question about the title/topic.'}

${errorPatterns.length > 0 ? `The learner has these known weak areas: ${errorPatterns.join(', ')}` : ''}
${featurePrompt}
${firstSessionPrompt}
${fossilizationAlerts.length > 0 ? buildFossilizationPromptSection(fossilizationAlerts) : ''}

Generate an engaging OPENING QUESTION to ask the learner after they consume this content.

Rules:
1. The question should be in SPANISH (the learner is practicing Spanish!), with proper diacritics and inverted punctuation
2. ${hasTranscript ? 'Reference something SPECIFIC from the transcript' : 'Ask about the topic implied by the title'}
3. Don't ask them to summarize everything — pick ONE interesting aspect
4. Make it feel conversational, not like a test
5. If targeting known error patterns, work them into the question naturally
${targetFeatures.length > 0 ? '6. Design the question so the natural answer requires using the targeted grammar structures' : ''}

Return JSON:
{
  "question": "Your Spanish question here",
  "questionType": "comprehension|translation|grammar|vocabulary|cultural",
  "hint": "English hint — REQUIRED for A1/A2, optional for B1+"
}

${cefrGuidelines}

FINAL CHECK before responding: Count the words in your question. For ${userLevel}: ${userLevel === 'A1' ? 'it MUST be under 10 words, answerable with sí/no or 1-3 words. If it contains "por qué", "crees que", or comparatives — REWRITE IT SIMPLER.' : userLevel === 'A2' ? 'it MUST be under 15 words, answerable in one short sentence. If it contains "por qué crees que" or complex grammar — REWRITE IT SIMPLER.' : 'ensure appropriate complexity.'}`;

    try {
        const output = await callGroq([
            { role: "system", content: getSystemPrompt(userLevel) },
            { role: "user", content: prompt }
        ]);

        const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
        const effectiveJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        const parsed = JSON.parse(effectiveJson);

        return {
            question: parsed.question,
            questionType: parsed.questionType || 'comprehension',
            hint: parsed.hint
        };

    } catch (error) {
        console.error("[Tutor] Initial question generation failed:", error);
        return getFallbackQuestion(contentType, userLevel);
    }
}

/**
 * Extracts vocabulary questions from parentheses
 * Patterns: (cum se spune "X"?), (what is "X"?), (how do you say "X"?), etc.
 */
function extractVocabQuestions(text: string): { cleanText: string; vocabQuestions: string[] } {
    const vocabPatterns = [
        /\(cómo se dice[^\)]*\)/gi,
        /\(qué significa[^\)]*\)/gi,
        /\(what is[^\)]*\)/gi,
        /\(how do you say[^\)]*\)/gi,
        /\(what's the word for[^\)]*\)/gi,
        /\(translation[^\)]*\)/gi,
    ];

    let cleanText = text;
    const vocabQuestions: string[] = [];

    for (const pattern of vocabPatterns) {
        const matches = text.match(pattern);
        if (matches) {
            vocabQuestions.push(...matches.map(m => m.replace(/[\(\)]/g, '').trim()));
            cleanText = cleanText.replace(pattern, '').trim();
        }
    }

    return { cleanText, vocabQuestions };
}

/**
 * Answers a vocabulary question using the tutor model
 */
async function answerVocabQuestion(question: string): Promise<VocabHelp> {
    // Extract the word being asked about (usually in quotes or after "se spune")
    const wordMatch = question.match(/"([^"]+)"|'([^']+)'/) ||
                      question.match(/spune\s+([^\?]+)/i) ||
                      question.match(/for\s+([^\?]+)/i);

    const targetWord = wordMatch ? (wordMatch[1] || wordMatch[2] || wordMatch[3]).trim() : '';

    const prompt = `
Vocabulary question: "${question}"

The learner is asking how to say "${targetWord}" in Spanish (or the other way around).

Provide a clear, concise answer in JSON format:
{
  "question": "The original question",
  "word": "The word being asked about",
  "translation": "The Spanish translation or English meaning",
  "context": "Optional example sentence showing usage (Spanish text must use proper diacritics and inverted punctuation)"
}
`;

    try {
        const output = await callGroq([
            { role: "system", content: BASE_SYSTEM_PROMPT },
            { role: "user", content: prompt }
        ]);

        const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
        const effectiveJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        const parsed = JSON.parse(effectiveJson);

        return {
            question: parsed.question || question,
            word: parsed.word || targetWord,
            translation: parsed.translation || 'Translation not found',
            context: parsed.context
        };
    } catch (error) {
        console.error("[Tutor] Vocab question failed:", error);
        return {
            question,
            word: targetWord,
            translation: 'Unable to answer - try asking the Oracle later!'
        };
    }
}

/**
 * Generates AI tutor response for Chaos Window interactions
 */
export async function generateTutorResponse(
    userResponse: string,
    context: string,
    errorPatterns: string[] = [],
    userLevel: string = 'B1',
    targetFeatures: TargetFeature[] = [],
    newlyDiscoveredFeatures: string[] = [],
    fossilizationAlerts: FossilizationAlert[] = []
): Promise<TutorResponse> {

    // Step 1: Extract vocabulary questions from parentheses
    const { cleanText, vocabQuestions } = extractVocabQuestions(userResponse);

    // Step 2: Answer vocabulary questions if present
    let vocabHelp: VocabHelp | undefined;
    if (vocabQuestions.length > 0) {
        // Answer the first vocabulary question found
        vocabHelp = await answerVocabQuestion(vocabQuestions[0]);
    }

    // Step 3: Grade the cleaned text (without vocab questions)
    const textToGrade = cleanText || userResponse; // Fallback to original if cleaning removed everything

    // Detect if context is full transcript vs. title-only fallback
    const hasFullTranscript = !context.includes('[Note: Full transcript not available]');

    const cefrGuidelines = getCEFRGuidelines(userLevel);

    const prompt = `
You are ChaosLengua's AI Spanish tutor — a brilliant, slightly chaotic Spanish language expert.
Your goal is to help English L1 learners master Spanish through "productive confusion".

Context: The user just heard/read: "${context}"
${hasFullTranscript ? '' : '⚠️ NOTE: You only have the content title, not the full transcript. Focus on grammar and form rather than semantic accuracy.'}

User's response: "${textToGrade}"
${vocabQuestions.length > 0 ? `⚠️ NOTE: The user also asked a vocabulary question in parentheses, which has been handled separately. Do NOT grade the vocabulary question — only grade the actual Spanish production.` : ''}
${errorPatterns.length > 0 ? `Known error patterns to watch for: ${errorPatterns.join(', ')}` : ''}

DIALECTAL POLICY: LatAm-neutral baseline. Do NOT flag voseo (vos tenés), vosotros (habláis), Peninsular leísmo (le vi), or standard regional lexical variants (coche / carro / auto) as errors when used consistently. Only flag inconsistent regional mixing within a single response as a register/regional suggestion.

FOR THE "nextQuestion" FIELD — ${cefrGuidelines}
${['A1', 'A2'].includes(userLevel) ? 'Keep feedback explanations simple and short. Use English for grammar explanations. Be EXTRA encouraging — any attempt at this level deserves praise.' : 'Use English for all feedback, explanations, and encouragement. Only use Spanish for corrections, example sentences, and the nextQuestion field.'}
${targetFeatures.length > 0 ? `
GRAMMAR TARGETING for nextQuestion: Design your follow-up question to naturally require these structures:
${targetFeatures.map(f => `- ${f.featureName}: ${f.description || ''}`).join('\n')}
Don't explain them — let the learner discover through production.` : ''}
${newlyDiscoveredFeatures.length > 0 ? `
DISCOVERY MOMENT: The learner just encountered these structures for the FIRST TIME: ${newlyDiscoveredFeatures.join(', ')}.
If they used any of these correctly, briefly celebrate it in your encouragement (e.g., "Nice ser/estar choice!", "Good aspect on that preterite!") — but don't lecture about the rule.
If they didn't notice a new structure in the content, gently draw attention in your nextQuestion (e.g., "Did you notice how 'X' works in that sentence?"). Plant a seed, don't lecture.` : ''}
${fossilizationAlerts.length > 0 ? buildFossilizationPromptSection(fossilizationAlerts) : ''}

Analyze the response and provide feedback in this JSON format:
{
  "feedback": {
    "overall": "Brief overall assessment (encouraging but honest)",
    "grammar": [
      {
        "type": "error_type",
        "incorrect": "incorrect_part",
        "correct": "correct_form",
        "explanation": "clear_explanation (be linguistically accurate: ser/estar by semantic category not permanent/temporary; preterite/imperfect by aspect not time adverbs; gustar agrees with thing liked)",
        "severity": "minor|major|critical",
        "feedbackType": "error|suggestion"
      }
    ],
    "semantic": {
      "score": ${hasFullTranscript ? '0.85' : '0.0'},
      "matches": ${hasFullTranscript ? 'true' : 'false'},
      "feedback": "${hasFullTranscript ? 'semantic_feedback' : 'Cannot evaluate semantic accuracy without full transcript'}"
    },
    "encouragement": "motivational_comment"
  },
  "nextQuestion": "follow_up_question_at_${userLevel}_level${hasFullTranscript ? '_that_references_specific_content' : ''}",
  "errorPatterns": ["any_new_error_patterns_detected"],
  "isCorrect": false,
  "levelAssessmentReady": false // Set to true ONLY IF you have asked enough questions (typically 3+) and confidently gauged the user's true proficiency level.
}

All Spanish text in corrections, examples, and the nextQuestion must use proper diacritics (á, é, í, ó, ú, ü, ñ) and inverted punctuation (¿, ¡).

Focus on:
1. Grammar accuracy with specific corrections
${hasFullTranscript ? '2. Semantic understanding of the content (DID THEY UNDERSTAND WHAT WAS SAID?)' : '2. ⚠️ SKIP semantic evaluation (no transcript available)'}
3. Encouragement that maintains motivation
4. Next question at ${userLevel} CEFR level that ${hasFullTranscript ? 'addresses identified weaknesses AND references the content' : 'focuses on grammar/form'}
5. Error patterns that should go to the Error Garden

FINAL CHECK for nextQuestion: ${userLevel === 'A1' ? 'It MUST be under 10 words, answerable with sí/no or 1-3 words. NO "por qué", "crees que", or comparatives.' : userLevel === 'A2' ? 'It MUST be under 15 words, answerable in one short sentence. NO "por qué crees que" or complex grammar.' : `Ensure appropriate complexity for ${userLevel}.`}
`;

    try {
        const output = await callGroq([
            { role: "system", content: getSystemPrompt(userLevel) },
            { role: "user", content: prompt }
        ]);

        // Clean any markdown formatting
        const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
        const effectiveJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        const parsed = JSON.parse(effectiveJson);

        return {
            feedback: parsed.feedback,
            vocabHelp, // Include vocabulary help if question was detected
            nextQuestion: parsed.nextQuestion,
            errorPatterns: parsed.errorPatterns || [],
            isCorrect: parsed.isCorrect || false,
            levelAssessmentReady: parsed.levelAssessmentReady || false
        };

    } catch (error) {
        console.error("[Tutor] Response generation failed:", error);
        return {
            feedback: {
                overall: "The Oracle is meditating on your response...",
                grammar: [],
                semantic: { score: 0, matches: false, feedback: "Unable to analyze" },
                encouragement: "Try again - the AI spirits are busy!"
            },
            vocabHelp, // Include vocabulary help even if grading fails
            nextQuestion: "Can you try that again in a different way?",
            errorPatterns: [],
            isCorrect: false,
            levelAssessmentReady: false
        };
    }
}
