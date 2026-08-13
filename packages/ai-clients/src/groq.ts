/**
 * Groq API Client
 * Uses the OpenAI-compatible API format provided by Groq
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Switching to GPT-OSS 120B (Llama 3.3 70B Versatile was decommissioned by Groq on 2026-08-16)
export const GROQ_MODEL = "openai/gpt-oss-120b";

export type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

export async function callGroq(
    messages: ChatMessage[],
    temperature: number = 0.6,
    jsonMode: boolean = true
): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set");
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                temperature,
                max_tokens: 2048,
                ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Groq API Error: ${response.status} ${err}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("[Groq] Call failed:", error);
        throw error;
    }
}
