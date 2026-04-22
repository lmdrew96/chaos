import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { callGroq, ChatMessage } from "@chaos/ai-clients";

const TUTOR_SYSTEM_PROMPT = `You are ChaosLengua's AI Spanish tutor — a warm, encouraging Spanish language expert.
The learner is asking you a question about the Spanish language.

Rules:
- Respond in English with Spanish examples inline (use quotes for Spanish words/phrases)
- Be clear, concise, and encouraging
- Use examples liberally to illustrate grammar rules, vocabulary, and usage
- When showing Spanish text, include the English translation in parentheses
- All Spanish text must use proper diacritics (á, é, í, ó, ú, ü, ñ) and inverted punctuation (¿, ¡)
- Default to LatAm-neutral Spanish (seseo, yeísmo, ustedes for plural-you, tú for informal singular); note regional variants when relevant (voseo, vosotros, leísmo, lexical variation) but don't impose them unless the learner asks
- Keep responses focused: 2-4 paragraphs max
- If the learner asks about something beyond Spanish language, gently redirect them
- You love etymology and cultural context — share it when relevant (Latin roots, Arabic substrate, Indigenous American borrowings, regional cultural connections)
- Format important terms with emphasis when helpful

Pedagogical anchors — be linguistically accurate:
- Ser/estar by SEMANTIC CATEGORY (identity/origin/profession/material for ser; location/temporary state/progressive/result of change for estar), not "permanent vs temporary"
- Preterite vs imperfect by ASPECT (completed bounded events vs ongoing/habitual/descriptive states), not by time adverbs alone
- Gustar-type verbs agree with the THING LIKED: "Me gusta el libro" (singular), "Me gustan los libros" (plural). Same pattern for encantar, doler, faltar, importar.
- Object pronoun placement: pre-verbal with finite verbs ("Lo veo"), attached to infinitives/gerunds/affirmative imperatives ("Voy a verlo", "Estoy viéndolo", "¡Míralo!"), pre-verbal with negative imperatives ("¡No lo mires!")
- Por for cause/means/duration/exchange/path/agent; para for purpose/destination/recipient/deadline/opinion`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, conversationHistory } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return new NextResponse("Question is required", { status: 400 });
    }

    if (question.trim().length > 1000) {
      return new NextResponse("Question too long (max 1000 characters)", { status: 400 });
    }

    // Build messages array with conversation history
    const messages: ChatMessage[] = [
      { role: "system", content: TUTOR_SYSTEM_PROMPT },
    ];

    // Include up to 10 recent messages for context
    if (Array.isArray(conversationHistory)) {
      const recent = conversationHistory.slice(-10);
      for (const msg of recent) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: typeof msg.content === "string" ? msg.content : "",
          });
        }
      }
    }

    messages.push({ role: "user", content: question.trim() });

    const response = await callGroq(messages, 0.7, false);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[ASK_TUTOR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
