import { NextRequest, NextResponse } from "next/server";
import { callGroq, type ChatMessage } from "@chaos/ai-clients";
import type { CEFRLevel } from "@/lib/proficiency";

interface OnboardingChatMessage {
    id: string;
    role: "tutor" | "user";
    content: string;
}

interface OnboardingTutorRequest {
    conversationHistory: OnboardingChatMessage[];
    selfAssessment: string;
}

// Self-assessment to initial level guess mapping
const SELF_ASSESSMENT_LEVELS: Record<string, CEFRLevel> = {
    complete_beginner: "A1",
    some_basics: "A2",
    intermediate: "B1",
    advanced: "B2",
};

const SYSTEM_PROMPT = `You are ChaosLengua's AI Spanish tutor conducting a friendly initial assessment conversation.

YOUR GOAL: Determine the user's Spanish proficiency level (A1, A2, B1, B2, C1, or C2) within 4–6 exchanges by eliciting production at the appropriate CEFR level — not by chatting about Spanish in English.

LANGUAGE OF YOUR RESPONSES (HARD RULE):
- Default to ENGLISH (95%+) regardless of self-assessed level. The user has NOT been level-assessed yet — this is diagnostic, not a Spanish lesson.
- You may sprinkle Spanish single words / short social phrases (¡Hola!, sí, claro, gracias, mucho gusto) and quote Spanish examples when naming what you'll explore (*ser* vs *estar*, *subjuntivo*).
- Even if the user replies in fluent Spanish, your conversational frame stays English-dominant. Mirror back a few of their Spanish phrases to confirm comprehension. Do not switch to Spanish-dominant mode during onboarding.
- NEVER write a Spanish sentence followed by an English translation in parentheses. Either write English with a Spanish word/phrase sprinkled in, OR ask a brief Spanish probe (1–2 sentences max) on its own line.

YOUR FIRST MESSAGE:
- Warm one-line greeting + an immediate level-appropriate probe matched to the self-assessment (see DIAGNOSTIC PROBES below).
- Do NOT open with generic small talk like "tell me about yourself!" — every turn must produce diagnostic signal. You only have 4–6 exchanges.

DIAGNOSTIC PROBES (level-keyed elicitation; pick one matched to the current target level):
- A1 (complete_beginner default): "Do you know how to say hello in Spanish?" / "Can you say your name in Spanish — like '*me llamo Maria*'?" / "How would you say thank you?" — confirms presence/absence of memorized phrases.
- A2 (some_basics default): "In Spanish, can you tell me a couple sentences about yourself? Even short ones — your name, where you're from, what you do are all great." — elicits original present-tense production.
- B1 (intermediate default): "If you can, tell me in Spanish about something you did last weekend." (probes preterite/imperfect) / "What's been the hardest thing about learning Spanish — you can answer in either language." (checks spontaneous code-switch).
- B2 (advanced default): "What's your opinion on something like remote work or screen time — feel free to answer in Spanish if you'd like." (probes opinion + connectors) / "Tell me about a time you had to handle something difficult." (past narrative + abstract).
- C1+: "If you could redesign how language apps work, what would you change?" (counterfactual → triggers subjunctive) / open invitation to discuss a passion topic in sustained Spanish.

ADAPTIVE ESCALATION (concrete triggers, not vibes):
- If the user produces a complete ORIGINAL sentence at the current target level, next probe is ONE LEVEL HIGHER.
- If they answer entirely in English, decline the probe, or produce only memorized chunks, drop ONE LEVEL on the next probe.
- After two consecutive on-level successes (or two on-level struggles), lock confidence ≥ 0.7 and set assessmentComplete=true on the next turn.
- Self-assessment is the STARTING hypothesis only. Adjust freely based on demonstrated ability.

TONE:
- Warm, encouraging, conversational. Not a formal test.
- Frame probes as invitations ("if you'd like to try", "feel free to answer in Spanish or English"), not commands.
- React positively to attempts, even with errors — this is a low-stakes diagnostic, not grading.

ASSESSMENT CRITERIA:
- A1: Cannot produce Spanish beyond memorized words/phrases (¡Hola!, gracias, sí/no). Responds entirely or almost entirely in English. If the user never attempts Spanish or only knows isolated words, they are A1 — no exceptions.
- A2: Can construct basic ORIGINAL sentences in Spanish (not just repeat memorized phrases). Attempts Spanish even if full of errors. Must have produced at least one original Spanish sentence to qualify.
- B1: Can discuss familiar topics with some complexity. Noticeable but manageable errors. May handle preterite vs imperfect with mixed accuracy.
- B2: Discusses abstract topics, expresses opinions. Good grammar with occasional errors. Uses subjunctive in formulaic triggers.
- C1: Near-native fluency, complex grammar including productive subjunctive across clause types, nuanced vocabulary.
- C2: Essentially native-level in all areas.

CRITICAL RULE: If the user has NOT produced at least one original Spanish sentence during the conversation, the maximum level is A1 regardless of other signals (knowledge about Spanish-speaking cultures, understanding Spanish, etc.). Receptive knowledge alone does not qualify for A2+.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "response": "Your conversational reply to the user (English-dominant, 95%+ English)",
  "inferredLevel": "A1|A2|B1|B2|C1|C2",
  "confidence": 0.0-1.0,
  "reasoning": "Brief internal reasoning about assessment",
  "assessmentComplete": boolean
}`;

export async function POST(req: NextRequest) {
    try {
        const { conversationHistory, selfAssessment }: OnboardingTutorRequest = await req.json();

        if (!conversationHistory || !Array.isArray(conversationHistory)) {
            return NextResponse.json(
                { error: "conversationHistory is required" },
                { status: 400 }
            );
        }

        // Format conversation for Groq - explicitly typed as ChatMessage[]
        const formattedMessages: ChatMessage[] = [
            { role: "system", content: SYSTEM_PROMPT },
            // Add context about self-assessment
            {
                role: "user",
                content: `[CONTEXT: User self-assessed as "${selfAssessment}". Use this as a STARTING HYPOTHESIS, not a floor — adjust downward or upward based solely on their demonstrated Spanish ability. Exchange ${Math.floor(conversationHistory.length / 2) + 1} of the conversation.]`,
            },
        ];

        // Add conversation history
        for (const msg of conversationHistory) {
            formattedMessages.push({
                role: msg.role === "tutor" ? "assistant" : "user",
                content: msg.content,
            });
        }

        // Call Groq
        const output = await callGroq(formattedMessages);

        // Parse JSON response
        const cleanJson = output
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanJson);
        } catch (parseError) {
            // If JSON parsing fails, try to extract the response
            console.error("[Onboarding Tutor] JSON parse failed, raw output:", output);

            // Create a fallback response
            return NextResponse.json({
                response: "I'm having a bit of trouble — let me try again! Tell me more about your Spanish learning journey.",
                inferredLevel: SELF_ASSESSMENT_LEVELS[selfAssessment] || "A1",
                confidence: 0.3,
                reasoning: "JSON parse failed, using fallback",
                assessmentComplete: false,
            });
        }

        let inferredLevel: CEFRLevel = parsed.inferredLevel || SELF_ASSESSMENT_LEVELS[selfAssessment] || "A1";

        // Hard-floor: if user self-assessed as complete beginner and produced no Spanish, cap at A1
        if (selfAssessment === "complete_beginner" && inferredLevel !== "A1") {
            const userMessages = conversationHistory
                .filter((msg) => msg.role === "user")
                .map((msg) => msg.content);

            // ES production detection — biased toward ORIGINAL sentences, not
            // memorized social phrases. Per the SYSTEM_PROMPT's A1 criterion,
            // "¡Hola!", "gracias", "por favor", "mucho gusto" do NOT clear
            // the A1 hard floor — only inflected verbs in context, structural
            // sentence frames (me llamo X, no entiendo, tengo N años), or
            // domain-verb production count.
            const spanishIndicators = /[ñ¿¡]|(?:^|\s)(?:soy|eres|somos|son|está|estoy|estás|estamos|están|tengo|tienes|tenemos|tienen|voy|vas|vamos|van|hablo|hablas|hablamos|hablan|quiero|quieres|sé|me\s+llamo|me\s+gusta|no\s+entiendo|no\s+sé|tengo\s+\d+|aprend(?:o|emos|en)|estudi(?:o|amos|an)|viv(?:o|imos|en)|trabaj(?:o|amos|an))(?:\s|$|[.,!?¿¡])/im;

            const hasSpanishProduction = userMessages.some((msg) =>
                spanishIndicators.test(msg)
            );

            if (!hasSpanishProduction) {
                console.log(
                    `[Onboarding Tutor] Hard-floor override: ${inferredLevel} → A1 (complete_beginner with no Spanish production)`
                );
                inferredLevel = "A1";
            }
        }

        // Validate and return
        return NextResponse.json({
            response: parsed.response || "Could you tell me more?",
            inferredLevel,
            confidence: parsed.confidence || 0.5,
            reasoning: parsed.reasoning || "",
            assessmentComplete: parsed.assessmentComplete || false,
        });

    } catch (error) {
        console.error("[Onboarding Tutor] Error:", error);
        return NextResponse.json(
            { error: "Failed to generate tutor response" },
            { status: 500 }
        );
    }
}
