import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  analyzePronunciation,
  comparePhonemes,
  isPhonemeAnalysisAvailable,
  transcribeToIpa,
  ValidationError,
} from "@chaos/ai-clients";
import { getRomanianReferenceIpa } from "@/lib/pronunciation/reference-cache";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const expectedText = formData.get('expectedText') as string | null;
    const thresholdStr = formData.get('threshold') as string | null;
    const threshold = thresholdStr ? parseFloat(thresholdStr) : 0.70;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Run Whisper transcription (cheap, free via Groq) and phoneme analysis (RunPod,
    // ~$0.001) in parallel. Phoneme analysis is gated on:
    //   1. RunPod endpoint configured for Romanian
    //   2. expectedText supplied (need a target to generate the TTS reference)
    // Failures in phoneme analysis are caught and surfaced via `phonemeError` so
    // the user still gets the Whisper result.
    const phonemeEligible = Boolean(expectedText) && isPhonemeAnalysisAvailable('ro');

    const audioBuffer = phonemeEligible
      ? Buffer.from(await audioFile.arrayBuffer())
      : null;

    const phonemePromise = phonemeEligible && audioBuffer
      ? runPhonemeAnalysis(audioBuffer, expectedText!)
      : Promise.resolve(null);

    const [whisperResult, phonemeResult] = await Promise.all([
      analyzePronunciation(audioFile, 'ro', expectedText ?? undefined, threshold),
      phonemePromise,
    ]);

    const result = {
      ...whisperResult,
      ...(phonemeResult?.phoneme && { phoneme: phonemeResult.phoneme }),
      ...(phonemeResult?.error && { phonemeError: phonemeResult.error }),
    };

    return NextResponse.json({ result });

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Pronunciation analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze pronunciation" },
      { status: 500 }
    );
  }
}

async function runPhonemeAnalysis(audioBuffer: Buffer, targetText: string) {
  try {
    const [userIpa, referenceIpa] = await Promise.all([
      transcribeToIpa(audioBuffer, 'ro'),
      getRomanianReferenceIpa(targetText),
    ]);
    return { phoneme: comparePhonemes(userIpa, referenceIpa) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Phoneme analysis failed:', msg);
    return { error: msg };
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
