// scripts/migrate-text-audio-to-type-audio-es.ts
// One-time migration: retype content_items that have audioUrl but type='text'
// to type='audio', copying textContent → transcript so AudioPlayer can show it.
//
// Before: type='text', textContent='...', audioUrl='...', transcript=null
// After:  type='audio', textContent='...' (kept), transcript='...', transcriptSource='tts'
//
// Safe to re-run: only touches rows where type='text' AND audio_url IS NOT NULL.

import { db } from '@/lib/db';
import { contentItems } from '@/lib/db/schema';
import { eq, isNotNull, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function migrate() {
  console.log('🔄 Migrating type:text + audioUrl items → type:audio\n');

  const targets = await db
    .select({ id: contentItems.id, title: contentItems.title, textContent: contentItems.textContent })
    .from(contentItems)
    .where(
      and(
        eq(contentItems.type, 'text'),
        isNotNull(contentItems.audioUrl),
      ),
    );

  console.log(`Found ${targets.length} items to migrate\n`);
  if (targets.length === 0) {
    console.log('Nothing to migrate.');
    process.exit(0);
  }

  let updated = 0;
  let skipped = 0;

  for (const item of targets) {
    if (!item.textContent) {
      console.log(`  ⚠️  Skipping "${item.title}" — no textContent to copy`);
      skipped++;
      continue;
    }

    await db
      .update(contentItems)
      .set({
        type: 'audio',
        transcript: item.textContent,
        transcriptSource: 'tts',
      })
      .where(eq(contentItems.id, item.id));

    console.log(`  ✅ "${item.title}"`);
    updated++;
  }

  console.log(`\n--- Summary ---`);
  console.log(`Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

migrate();
