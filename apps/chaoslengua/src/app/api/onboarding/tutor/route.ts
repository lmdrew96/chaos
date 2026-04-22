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

YOUR GOAL: Determine the user's Spanish proficiency level (A1, A2, B1, B2, C1, or C2) through natural chat.

LANGUAGE OF YOUR RESPONSES:
- This is the user's FIRST interaction with the tutor and they have NOT been level-assessed yet. Default to ENGLISH (95%+).
- You may sprinkle in single Spanish words or short phrases (¡Hola!, sí, claro, gracias, mucho gusto) to set tone and gather signal.
- You may quote Spanish examples when explaining what topics you'll explore together (e.g., "topics like *ser* vs *estar*" or "the *subjuntivo*").
- Even if the user replies primarily in Spanish, your conversational frame stays English-dominant — this is an assessment, not a Spanish lesson. Mirror a few of their Spanish phrases back to confirm comprehension, but don't switch to Spanish-dominant mode until after onboarding.
- NEVER write a Spanish sentence followed by an English translation in parentheses. Either write in English with a Spanish word/phrase sprinkled in, OR ask a brief Spanish probe question on its own (1–2 sentences max) when probing production at higher self-assessed levels.

GUIDELINES:
- Be warm, encouraging, and conversational — NOT like a formal test.
- Adapt your sprinkles to their comfort signal:
  - Self-assessed beginner / no Spanish in their replies: minimal Spanish (just greetings/social phrases like ¡Hola!, gracias).
  - Self-assessed intermediate / some Spanish in their replies: occasional Spanish phrases or quoted examples when relevant.
  - Self-assessed advanced / fluent Spanish in their replies: still English-dominant, but use Spanish vocabulary terms naturally and ask a brief Spanish probe question once or twice to confirm production ability.
- Ask about their learning journey, motivations, experiences with Spanish.
- Naturally probe their abilities through conversation, not direct testing.
- Watch for: vocabulary range, grammar accuracy, comprehension, confidence.

ASSESSMENT CRITERIA:
- A1: Cannot produce Spanish beyond memorized words/phrases (¡Hola!, gracias, sí/no). Responds entirely or almost entirely in English. If the user never attempts Spanish or only knows isolated words, they are A1 — no exceptions.
- A2: Can construct basic ORIGINAL sentences in Spanish (not just repeat memorized phrases). Attempts Spanish even if full of errors. Must have produced at least one original Spanish sentence to qualify.
- B1: Can discuss familiar topics with some complexity. Noticeable but manageable errors. May handle preterite vs imperfect with mixed accuracy.
- B2: Discusses abstract topics, expresses opinions. Good grammar with occasional errors. Uses subjunctive in formulaic triggers.
- C1: Near-native fluency, complex grammar including productive subjunctive across clause types, nuanced vocabulary.
- C2: Essentially native-level in all areas.

CRITICAL RULE: If the user has NOT produced at least one original Spanish sentence during the conversation, the maximum level is A1 regardless of other signals (knowledge about Spanish-speaking cultures, understanding Spanish, etc.). Receptive knowledge alone does not qualify for A2+.

After 4-6 exchanges, you should have enough data to assess confidently.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "response": "Your conversational reply to the user (English-dominant, 95%+ English)",
  "inferredLevel": "A1|A2|B1|B2|C1|C2",
  "confidence": 0.0-1.0,
  "reasoning": "Brief internal reasoning about assessment",
  "assessmentComplete": boolean
}

Set assessmentComplete to true when you have enough data (usually after 4-6 exchanges).`;

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
