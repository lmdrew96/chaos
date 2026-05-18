/**
 * In-memory cache for reference IPA per targetText (Spanish).
 *
 * Reference IPA is derived by: targetText → Google TTS audio → RunPod phoneme ASR.
 * Cache scope: per-process. Vercel serverless warm instances reuse the cache;
 * cold starts regenerate. If hit rate matters later, persist to a DB table.
 */

import { transcribeToIpa, isPhonemeAnalysisAvailable } from '@chaos/ai-clients';
import { generateSpanishAudio } from '@/lib/tts/google-cloud';

const MAX_ENTRIES = 500;
const cache = new Map<string, string>();

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Get the reference IPA for a Spanish targetText, generating + caching on miss.
 * Throws if Spanish phoneme analysis is not configured (missing RunPod env vars).
 */
export async function getSpanishReferenceIpa(targetText: string): Promise<string> {
  if (!isPhonemeAnalysisAvailable('es')) {
    throw new Error('Spanish phoneme analysis not configured (RUNPOD_PHONEME_ES_ENDPOINT_ID + RUNPOD_API_KEY required)');
  }

  const key = normalizeKey(targetText);
  const cached = cache.get(key);
  if (cached !== undefined) {
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }

  const tts = await generateSpanishAudio(targetText, { audioEncoding: 'LINEAR16' });
  const ipa = await transcribeToIpa(tts.audioContent, 'es');

  if (cache.size >= MAX_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, ipa);

  return ipa;
}

export function clearReferenceCache(): void {
  cache.clear();
}
