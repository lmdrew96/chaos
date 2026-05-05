/**
 * In-memory cache for reference IPA per targetText.
 *
 * Reference IPA is derived by: targetText → Google TTS audio → RunPod phoneme ASR.
 * That's two paid API calls per cache miss, so caching is meaningful — and reference
 * IPA is deterministic given the targetText, so an indefinite-lifetime LRU is safe.
 *
 * Cache scope: per-process. On Vercel serverless this means each warm function
 * instance has its own cache; cold starts pay the regenerate cost. That's an
 * acceptable trade vs. wiring DB persistence for the first iteration. If hit rate
 * matters more later, persist to a `pronunciation_references` table keyed by
 * targetText hash.
 */

import { transcribeToIpa, isPhonemeAnalysisAvailable } from '@chaos/ai-clients';
import { generateRomanianAudio } from '@/lib/tts/google-cloud';

const MAX_ENTRIES = 500;
const cache = new Map<string, string>();

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Get the reference IPA for a Romanian targetText, generating + caching on miss.
 * Throws if Romanian phoneme analysis is not configured (missing RunPod env vars).
 */
export async function getRomanianReferenceIpa(targetText: string): Promise<string> {
  if (!isPhonemeAnalysisAvailable('ro')) {
    throw new Error('Romanian phoneme analysis not configured (RUNPOD_PHONEME_RO_ENDPOINT_ID + RUNPOD_API_KEY required)');
  }

  const key = normalizeKey(targetText);
  const cached = cache.get(key);
  if (cached !== undefined) {
    // Touch for LRU
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }

  // LINEAR16 (uncompressed) avoids MP3 quantization artifacts before re-encoding;
  // the RunPod handler resamples to 16kHz internally so source rate doesn't matter.
  const tts = await generateRomanianAudio(targetText, { audioEncoding: 'LINEAR16' });
  const ipa = await transcribeToIpa(tts.audioContent, 'ro');

  if (cache.size >= MAX_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, ipa);

  return ipa;
}

/**
 * Test/debug: clear the in-process cache.
 */
export function clearReferenceCache(): void {
  cache.clear();
}
