// src/lib/grammarChecker.ts
// Provider-agnostic Spanish grammar checker
// Spanish grammar checker using Claude Haiku

export interface GrammarCheckError {
  type: string;
  original: string;
  correction: string;
  explanation: string;
  category?: string;
  feedbackType?: 'error' | 'suggestion'; // Distinguishes objective errors from contextual suggestions
}

export interface GrammarCheckResult {
  originalText: string;
  correctedText: string;
  errors: GrammarCheckError[];
  beautifulMistake?: {
    isBeautiful: boolean;
    note: string;
  };
}

/**
 * Main grammar checking function
 */
export async function checkGrammar(text: string): Promise<GrammarCheckResult> {
  if (!text || !text.trim()) {
    throw new Error('Text cannot be empty');
  }

  return await checkWithClaude(text);
}

/**
 * Check grammar using Claude Haiku 4.5
 */
async function checkWithClaude(text: string): Promise<GrammarCheckResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const prompt = `You are a Spanish grammar checker for ChaosLengua, an SLA-grounded learning app for English L1 Spanish learners. Analyze the learner's text and categorize issues into TWO categories:

1. ERRORS (feedbackType: "error") — Objective grammatical violations:
   - Wrong ser/estar selection ("es cansado" → "está cansado"; "está profesor" → "es profesor")
   - Wrong preterite/imperfect aspect ("Ayer caminaba al parque y compraba pan" → "caminé... compré", when narrating completed bounded events)
   - Wrong por/para ("Lo hice para el dinero" → "por el dinero", when expressing motivation/exchange)
   - Object pronoun errors — form, agreement, or placement ("la veo a ellos" → "los veo"; "voy a lo ver" → "voy a verlo" or "lo voy a ver")
   - Gender/number agreement ("la casa blanco" → "la casa blanca"; "los libros rojo" → "los libros rojos")
   - Gustar-type inversion ("Yo gusto el libro" → "Me gusta el libro"; "Me gustan el libro" → "Me gusta el libro")
   - Wrong verb conjugation ("yo sabo" → "yo sé"; "tú tieneis" → "tú tienes")
   - Missing or wrong diacritics ("manana" → "mañana"; "esta cansado" → "está cansado" when meaning "is tired")
   - Missing inverted punctuation (¿ ¡) at the start of questions or exclamations
   - False cognates used in their English sense ("estoy embarazada" to mean "embarrassed"; "asistir" to mean "assist someone")

2. SUGGESTIONS (feedbackType: "suggestion") — Grammatically valid but contextually suboptimal:
   - Register mismatches (overly formal "deseo que" in casual writing)
   - Inconsistent regional mixing within a single production (using "coche" then "carro" in the same sentence)
   - Awkward calques from English that are grammatical but unnatural ("Yo soy 25 años" → "Tengo 25 años")
   - Stylistic suboptimality

DIALECTAL POLICY — DO NOT FLAG AS ERRORS:
- Voseo conjugations: "vos tenés", "vos comés", "vos vivís" are valid Rioplatense forms.
- Vosotros forms: "habláis", "coméis" are valid Peninsular forms.
- Peninsular leísmo: "le vi" for masculine human direct object is the Peninsular standard.
- Standard regional lexical variants: "coche" / "carro" / "auto" are all valid in their respective regions.
Default target dialect is LatAm-neutral (seseo, yeísmo, ustedes for plural-you), but accept dialectal variants when used consistently. Inconsistent mixing → "register_formality" or "regional_variation_lexical" SUGGESTION, not a grammar error.

CRITICAL GRAMMAR ANCHORS — be linguistically accurate:
- Ser/estar by SEMANTIC CATEGORY, not "permanent vs temporary". Ser for identity/origin/time/profession/material; estar for location/temporary state/progressive/result of change.
- Preterite vs imperfect by ASPECT, not by time adverbs. Preterite for completed bounded events; imperfect for ongoing/habitual/descriptive/backgrounded states. Both refer to past time.
- Gustar agrees with the THING LIKED, not the person: "Me gusta el libro" (singular), "Me gustan los libros" (plural). NEVER "Me gustan el libro".
- Object pronoun placement: pre-verbal with finite verbs ("Lo veo"), attached to infinitives/gerunds/affirmative imperatives ("Voy a verlo", "Estoy viéndolo", "¡Míralo!"), pre-verbal with negative imperatives ("¡No lo mires!").
- Por for cause/means/duration/exchange/path/agent; para for purpose/destination/recipient/deadline/opinion.

CATEGORY LABELS — when setting "category", prefer these (used by the Error Garden for clustering):
ser_vs_estar_core, ser_vs_estar_meaning_shift, preterite_formation, imperfect_formation, preterite_vs_imperfect_aspect, preterite_imperfect_meaning_shift, direct_object_pronouns, indirect_object_pronouns, combined_object_pronouns, personal_a, por_vs_para, gender_agreement, definite_article_omission, indefinite_article_overuse, present_tense_regular, present_tense_stem_change, present_tense_irregular, gustar_construction, tener_idioms, reflexive_verbs, double_negation, accent_marks, spelling, false_cognate, collocation, register_formality, regional_variation_lexical, general_grammar (only if no specific category fits).

BEAUTIFUL MISTAKE — a rare flag for wrong attempts that reveal genuine engagement with hard Spanish distinctions, not avoidance. QUALIFIES:
- Attempts subjunctive (even wrong) instead of collapsing to indicative — shows tracking of irrealis.
- Reaches for ser/estar with clear semantic intent even if wrong (e.g., "está profesor" trying for a current-state reading) — the learner has internalized that the distinction matters.
- Tries por/para with evident semantic grounds rather than defaulting blindly to one.
- A literal English calque that accidentally produces a poetically vivid Spanish phrase.
- Productive overgeneralization of a real Spanish pattern (creative -ito diminutive, etc.) with clear affective intent.

DOES NOT QUALIFY (do NOT flag):
- Simple gender/agreement slips (just noise).
- Missing diacritics (orthographic, not pedagogically rich).
- Defaulting to the "easier" choice in a high-leverage pair (indicative over subjunctive, preterite over imperfect, ser over estar) — these are the avoidance patterns chaos injection is designed to break, not honor.

Be VERY selective. Set isBeautiful to false unless genuinely struck. The note should be warm and specific — 1–2 sentences max.

Return JSON with:
{
  "originalText": "...",
  "correctedText": "...",
  "errors": [
    {
      "type": "error_type_name",
      "original": "incorrect_text",
      "correction": "correct_text",
      "explanation": "why this is an error/suggestion",
      "category": "specific_category",
      "feedbackType": "error" | "suggestion"
    }
  ],
  "beautifulMistake": {
    "isBeautiful": false,
    "note": ""
  }
}

If no issues, return empty errors array.

Text to check: ${text}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Extract text content from Claude's response
    const textContent = result.content?.[0]?.text;
    if (!textContent) {
      throw new Error('No text content in Claude response');
    }

    // Parse the JSON response from Claude
    const parsed = parseClaudeResponse(textContent);

    return {
      originalText: parsed.originalText || text,
      correctedText: parsed.correctedText || text,
      errors: parsed.errors || [],
      beautifulMistake: parsed.beautifulMistake,
    };
  } catch (error: any) {
    console.error('Claude grammar check failed:', error);
    throw error;
  }
}

/**
 * Parse Claude's response text into structured format
 * Handles both clean JSON and JSON wrapped in markdown code blocks
 */
function parseClaudeResponse(text: string): Partial<GrammarCheckResult> {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;

    const parsed = JSON.parse(jsonText.trim());

    // Normalize the structure to match our interface
    const bm = parsed.beautifulMistake;
    const beautifulMistake = bm?.isBeautiful === true && bm?.note
      ? { isBeautiful: true, note: bm.note }
      : { isBeautiful: false, note: '' };

    return {
      originalText: parsed.originalText || parsed.original_text || parsed.original,
      correctedText: parsed.correctedText || parsed.corrected_text || parsed.corrected,
      errors: (parsed.errors || []).map((error: any) => ({
        type: error.type || 'grammar_correction',
        original: error.original || error.learner_production,
        correction: error.correction || error.correct_form,
        explanation: error.explanation || error.message || '',
        category: error.category,
        feedbackType: error.feedbackType || 'error',
      })),
      beautifulMistake,
    };
  } catch (error) {
    console.error('Failed to parse Claude response:', text);
    throw new Error('Failed to parse grammar check response');
  }
}

