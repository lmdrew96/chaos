import { auth } from "@clerk/nextjs/server";
import { callGroq } from "@chaos/ai-clients";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contentItems } from "@/lib/db/schema";
import { getContentQuestionsByContentId } from "@/lib/db/queries";
import { eq } from "drizzle-orm";

export interface QuizQuestion {
    type: 'multiple_choice' | 'fill_in_blank';
    question: string;
    options?: string[];
    correctAnswer: string;
    targetFeature?: string;
    explanation: string;
}

const QUIZ_SYSTEM_PROMPT = `You are a Spanish language quiz generator for a reading comprehension tool called "Deep Fog."

The learner has just read a Spanish text. Generate exactly 3 short comprehension questions based on the text:
- 2 multiple choice questions (testing vocabulary meaning or text comprehension)
- 1 fill-in-the-blank question (testing a grammar structure from the text)

Return valid JSON array:
[
  {
    "type": "multiple_choice",
    "question": "What does 'X' mean in the context of the text?",
    "options": ["correct answer", "distractor 1", "distractor 2", "distractor 3"],
    "correctAnswer": "correct answer",
    "targetFeature": "vocabulary",
    "explanation": "Brief explanation (1 sentence)"
  },
  {
    "type": "fill_in_blank",
    "question": "Complete: 'Ayer ___ al supermercado.' (ir)",
    "correctAnswer": "fui",
    "targetFeature": "preterite_perfective",
    "explanation": "Brief explanation (1 sentence)"
  }
]

Rules:
- Questions must be grounded in the actual text — don't ask about things not in the text
- MC options must be shuffled (correct answer NOT always first)
- MC distractors must be plausible but clearly wrong
- Fill-in-blank: show the sentence with ___ and optionally a hint in parentheses
- All Spanish text must have correct diacritics (á, é, í, ó, ú, ü, ñ, ¿, ¡)
- Adjust difficulty to the learner's CEFR level
- Questions should be in English, Spanish text in answers/options
- Keep it quick and fun — these are comprehension checks, not exams`;

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { textContent, userLevel, contentId } = await req.json() as {
            textContent?: string;
            userLevel?: string;
            contentId?: string;
        };

        // Prefer hand-authored content_questions when contentId is provided
        if (contentId) {
            const curated = await getContentQuestionsByContentId(contentId);
            if (curated.length > 0) {
                // Pull the content item's first grammar feature as the targetFeature
                // so Error Garden can categorize wrong answers.
                const [item] = await db
                    .select({ languageFeatures: contentItems.languageFeatures })
                    .from(contentItems)
                    .where(eq(contentItems.id, contentId));
                const grammarKeys = ((item?.languageFeatures as Record<string, unknown> | null)?.grammar as string[]) || [];
                const targetFeature = grammarKeys[0];

                const questions: QuizQuestion[] = curated.map((q) => ({
                    type: 'multiple_choice' as const,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.options[q.correctIndex],
                    targetFeature,
                    explanation: q.explanation || '',
                }));

                return NextResponse.json({ questions });
            }
        }

        // Fallback: AI-generated questions for content without curated questions
        if (!textContent) {
            return new NextResponse("Text content is required", { status: 400 });
        }

        const truncatedText = textContent.slice(0, 2000);

        const prompt = `The learner is at CEFR level ${userLevel || 'B1'}.

Here is the Spanish text they just read:
---
${truncatedText}
---

Generate 3 comprehension questions based on this text.`;

        const output = await callGroq(
            [
                { role: "system", content: QUIZ_SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
            0.7,
            true // JSON mode
        );

        const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
        const effectiveJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        const questions: QuizQuestion[] = JSON.parse(effectiveJson);

        // Validate structure
        const validQuestions = questions
            .filter(q => q.question && q.correctAnswer && q.type)
            .slice(0, 3);

        if (validQuestions.length === 0) {
            return NextResponse.json({ questions: [] }, { status: 200 });
        }

        return NextResponse.json({ questions: validQuestions });
    } catch (error) {
        console.error("[Deep Fog Quiz API]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
