/**
 * Bulk-generate Spanish audio for content items that have textContent but
 * no audioUrl. Synthesizes via Google Cloud TTS, uploads MP3s to R2, and
 * updates each item's audioUrl + durationSeconds in place.
 *
 * Prereqs (see apps/chaoslengua/docs/R2-TTS-SETUP.md):
 *   - R2 bucket provisioned, .env.local has R2_* set
 *   - Google Cloud TTS credentials set (GOOGLE_APPLICATION_CREDENTIALS or
 *     GOOGLE_TTS_CREDENTIALS_JSON)
 *   - DATABASE_URL pointed at the chaoslengua Neon database
 *
 * Usage: npx tsx scripts/generate-gap-audio-es.ts
 */

import { db } from '@/lib/db';
import { contentItems } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { generateAndUploadToR2 } from '@/lib/tts/google-cloud';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Slower than native for learner audio. Matches chaoslimba's gap-audio
// pacing — helps comprehension without sounding robotic.
const SPEAKING_RATE = 0.92;
const DELAY_MS = 300;

// Average Spanish speech rate ~9 chars/s at SPEAKING_RATE 0.92. Used to
// stamp durationSeconds on the content row so the player UI can render
// progress accurately before the audio loads.
const CHARS_PER_SECOND = 9;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function gen() {
  console.log('🎙️  Generating ES TTS for content items without audio\n');

  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficultyLevel: contentItems.difficultyLevel,
      textContent: contentItems.textContent,
    })
    .from(contentItems)
    .where(
      and(
        eq(contentItems.type, 'text'),
        isNull(contentItems.audioUrl),
      ),
    );

  console.log(`Found ${items.length} items without audio\n`);
  if (items.length === 0) {
    console.log('Nothing to generate!');
    process.exit(0);
  }

  let generated = 0;
  let failed = 0;
  let totalCost = 0;

  for (const item of items) {
    const text = item.textContent?.trim();
    if (!text) continue;

    // Alternate voices so the generated library has gender variety.
    const voiceChoice: 'female' | 'male' = generated % 2 === 0 ? 'female' : 'male';
    const r2Key = `gap-content/${item.id}.mp3`;

    try {
      console.log(
        `  🎙️  [${item.difficultyLevel}] "${item.title}" (${text.length} chars, ${voiceChoice})...`,
      );
      const { url, metadata } = await generateAndUploadToR2(text, r2Key, {
        voice: voiceChoice,
        speakingRate: SPEAKING_RATE,
      });
      const dur = Math.ceil(text.length / CHARS_PER_SECOND);
      await db
        .update(contentItems)
        .set({ audioUrl: url, durationSeconds: dur })
        .where(eq(contentItems.id, item.id));
      totalCost += metadata.estimatedCost;
      generated++;
      console.log(`    ✅ ~${dur}s, $${metadata.estimatedCost.toFixed(5)}`);
      await sleep(DELAY_MS);
    } catch (error) {
      failed++;
      console.error(`    ❌ ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Generated: ${generated}, Failed: ${failed}, Cost: $${totalCost.toFixed(4)}`);
  process.exit(0);
}

gen();
