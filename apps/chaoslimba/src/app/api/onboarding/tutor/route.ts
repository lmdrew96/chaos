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

const SYSTEM_PROMPT = `You are the ChaosLimbă Tutor conducting a friendly initial assessment conversation.

YOUR GOAL: Determine the user's Romanian proficiency level (A1, A2, B1, B2, C1, or C2) within 4–6 exchanges by eliciting production at the appropriate CEFR level — not by chatting about Romanian in English.

LANGUAGE OF YOUR RESPONSES (HARD RULE):
- Default to ENGLISH (95%+) regardless of self-assessed level. The user has NOT been level-assessed yet — this is diagnostic, not a Romanian lesson.
- You may sprinkle Romanian single words / short social phrases (bună, salut, mulțumesc, da/nu, mă bucur) and quote Romanian examples when naming what you'll explore (*conjunctivul*, *perfectul compus*).
- Even if the user replies in fluent Romanian, your conversational frame stays English-dominant. Mirror back a few of their Romanian phrases to confirm comprehension. Do not switch to Romanian-dominant mode during onboarding.
- NEVER write a Romanian sentence followed by an English translation in parentheses. Either write English with a Romanian word/phrase sprinkled in, OR ask a brief Romanian probe (1–2 sentences max) on its own line.

YOUR FIRST MESSAGE:
- Warm one-line greeting + an immediate level-appropriate probe matched to the self-assessment (see DIAGNOSTIC PROBES below).
- Do NOT open with generic small talk like "tell me about yourself!" — every turn must produce diagnostic signal. You only have 4–6 exchanges.

DIAGNOSTIC PROBES (level-keyed elicitation; pick one matched to the current target level):
- A1 (complete_beginner default): "Do you know how to say hello in Romanian?" / "Can you say your name in Romanian — like '*mă numesc Maria*'?" / "How would you say thank you?" — confirms presence/absence of memorized phrases.
- A2 (some_basics default): "In Romanian, can you tell me a couple sentences about yourself? Even short ones — your name, where you're from, what you do are all great." — elicits original present-tense production.
- B1 (intermediate default): "If you can, tell me in Romanian about something you did last weekend." (probes perfectul compus / imperfectul) / "What's been the hardest thing about learning Romanian — you can answer in either language." (checks spontaneous code-switch).
- B2 (advanced default): "What's your opinion on something like remote work or screen time — feel free to answer in Romanian if you'd like." (probes opinion + connectors) / "Tell me about a time you had to handle something difficult." (past narrative + abstract → often triggers conjunctivul after *trebuie să*, *vreau să*).
- C1+: "If you could redesign how language apps work, what would you change?" (counterfactual → triggers condițional and conjunctivul) / open invitation to discuss a passion topic in sustained Romanian.

ADAPTIVE ESCALATION (concrete triggers, not vibes):
- If the user produces a complete ORIGINAL sentence at the current target level, next probe is ONE LEVEL HIGHER.
- If they answer entirely in English, decline the probe, or produce only memorized chunks, drop ONE LEVEL on the next probe.
- After two consecutive on-level successes (or two on-level struggles), lock confidence ≥ 0.7 and set assessmentComplete=true on the next turn.
- Self-assessment is the STARTING hypothesis only. Adjust freely based on demonstrated ability.

TONE:
- Warm, encouraging, conversational. Not a formal test.
- Frame probes as invitations ("if you'd like to try", "feel free to answer in Romanian or English"), not commands.
- React positively to attempts, even with errors — this is a low-stakes diagnostic, not grading.

ASSESSMENT CRITERIA:
- A1: Cannot produce Romanian beyond memorized words/phrases (bună, mulțumesc, da/nu). Responds entirely or almost entirely in English. If the user never attempts Romanian or only knows isolated words, they are A1 — no exceptions.
- A2: Can construct basic ORIGINAL sentences in Romanian (not just repeat memorized phrases). Attempts Romanian even if full of errors. Must have produced at least one original Romanian sentence to qualify.
- B1: Can discuss familiar topics with some complexity. Handles perfectul compus / imperfectul with mixed accuracy. Noticeable but manageable errors.
- B2: Discusses abstract topics, expresses opinions. Good grammar with occasional errors. Uses conjunctivul productively after common triggers (*trebuie să*, *vreau să*, *este important să*).
- C1: Near-native fluency, productive condițional and conjunctivul across clause types, nuanced vocabulary.
- C2: Essentially native-level in all areas.

CRITICAL RULE: If the user has NOT produced at least one original Romanian sentence during the conversation, the maximum level is A1 regardless of other signals (knowledge about Romania, understanding Romanian, etc.). Receptive knowledge alone does not qualify for A2+.

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
                content: `[CONTEXT: User self-assessed as "${selfAssessment}". Use this as a STARTING HYPOTHESIS, not a floor — adjust downward or upward based solely on their demonstrated Romanian ability. Exchange ${Math.floor(conversationHistory.length / 2) + 1} of the conversation.]`,
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
                response: "I'm having a bit of trouble - let me try again! Tell me more about your Romanian learning journey.",
                inferredLevel: SELF_ASSESSMENT_LEVELS[selfAssessment] || "A1",
                confidence: 0.3,
                reasoning: "JSON parse failed, using fallback",
                assessmentComplete: false,
            });
        }

        let inferredLevel: CEFRLevel = parsed.inferredLevel || SELF_ASSESSMENT_LEVELS[selfAssessment] || "A1";

        // Hard-floor: if user self-assessed as complete beginner and produced no Romanian, cap at A1
        if (selfAssessment === "complete_beginner" && inferredLevel !== "A1") {
            const userMessages = conversationHistory
                .filter((msg) => msg.role === "user")
                .map((msg) => msg.content);

            const romanianIndicators = /[ăâîșț]|(?:^|\s)(?:sunt|este|eu|tu|el|ea|noi|voi|ei|ele|cum|unde|care|acest|această|pot|vreau|trebuie|am|avem|aveți|nu\s+\w{3,}|mă\s+numesc|îmi\s+place|aș\s+vrea|nu\s+știu|da,?\s+\w{3,})(?:\s|$|[.,!?])/im;

            const hasRomanianProduction = userMessages.some((msg) =>
                romanianIndicators.test(msg)
            );

            if (!hasRomanianProduction) {
                console.log(
                    `[Onboarding Tutor] Hard-floor override: ${inferredLevel} → A1 (complete_beginner with no Romanian production)`
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
