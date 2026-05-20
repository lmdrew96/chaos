// scripts/revert-audio-type-migration-es.ts
// Reverts migrate-text-audio-to-type-audio-es.ts: items with transcript='tts'
// and audioUrl go back to type='text'. transcript + transcriptSource are kept
// (they're useful regardless of type).

import { db } from '@/lib/db';
import { contentItems } from '@/lib/db/schema';
import { eq, isNotNull, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function revert() {
  console.log("🔄 Reverting type:audio → type:text for TTS-sourced items\n");

  const targets = await db
    .select({ id: contentItems.id, title: contentItems.title })
    .from(contentItems)
    .where(
      and(
        eq(contentItems.type, 'audio'),
        eq(contentItems.transcriptSource, 'tts'),
      ),
    );

  console.log(`Found ${targets.length} items to revert\n`);
  if (targets.length === 0) {
    console.log('Nothing to revert.');
    process.exit(0);
  }

  for (const item of targets) {
    await db
      .update(contentItems)
      .set({ type: 'text' })
      .where(eq(contentItems.id, item.id));
    console.log(`  ✅ "${item.title}"`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Reverted: ${targets.length}`);
  process.exit(0);
}

revert();
