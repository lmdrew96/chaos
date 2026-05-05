// @chaos/ai-clients — stateless wrappers for external AI providers
// shared across ChaosLengua and ChaosLimbă.

export { callGroq, GROQ_MODEL, type ChatMessage } from "./groq";
export {
  analyzePronunciation,
  analyzePronunciationFromFile,
  ValidationError,
  type PronunciationResult,
} from "./pronunciation";
export {
  transcribeToIpa,
  comparePhonemes,
  tokenizeIpa,
  isPhonemeAnalysisAvailable,
  PhonemeAnalysisError,
  PhonemeNotConfiguredError,
  type PhonemeAlignment,
  type PhonemeAnalysis,
  type PhonemeLanguage,
} from "./phoneme-pronunciation";
