/**
 * Smoke test: verify Google Cloud TTS synthesis is wired up correctly.
 *
 * Isolates the synthesis layer from auth, DB, and R2. On success,
 * writes a small MP3 to the script's cwd — play it to confirm
 * credentials, voice name, and audio encoding all work end-to-end.
 *
 * Usage (from apps/chaoslengua):
 *   npx tsx scripts/smoke-test-tts.ts
 */

import { generateSpanishAudio } from '@/lib/tts/google-cloud';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const TEST_TEXT = 'Hola, soy ChaosLengua. Si puedes escuchar esto, todo funciona.';
const OUTPUT_FILE = 'smoke-test.mp3';

async function run() {
  console.log('🎙️  ChaosLengua TTS smoke test\n');
  console.log(`Synthesizing: "${TEST_TEXT}"`);
  console.log(`Output:       ${OUTPUT_FILE}\n`);

  try {
    const result = await generateSpanishAudio(TEST_TEXT, { voice: 'female' });

    writeFileSync(OUTPUT_FILE, result.audioContent);

    console.log('✅ Synthesis succeeded\n');
    console.log(`  Voice:      ${result.voiceUsed}`);
    console.log(`  Characters: ${result.characterCount}`);
    console.log(`  Cost:       $${result.estimatedCost.toFixed(5)}`);
    console.log(`  MP3 size:   ${result.audioContent.length} bytes\n`);
    console.log(`Play with:  open ${OUTPUT_FILE}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Synthesis failed\n');
    console.error(error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error('\n' + error.stack);
    }
    process.exit(1);
  }
}

run();
