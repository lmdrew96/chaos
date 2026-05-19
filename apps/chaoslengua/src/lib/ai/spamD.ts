import { StressVariant, MinimalPair, IntonationWarning, StressPattern } from '@chaos/lang-config';

// Spanish stress-based minimal pairs lookup table
// Each word maps to stress patterns and their distinct meanings
export const STRESS_MINIMAL_PAIRS: Record<string, MinimalPair> = {
  "sábana": {
    "SÁ-ba-na": {
      meaning: "bedsheet",
      category: "household",
      ipa: "ˈsa.βa.na",
      severity: "high",
      example_sentence: "Pon la sábana limpia en la cama."
    },
    "sa-BA-na": {
      meaning: "savanna",
      category: "geography",
      ipa: "sa.ˈβa.na",
      severity: "high",
      example_sentence: "Los leones viven en la sabana africana."
    }
  },

  "papá": {
    "pa-PÁ": {
      meaning: "dad / father",
      category: "family",
      ipa: "pa.ˈpa",
      severity: "high",
      example_sentence: "Mi papá trabaja en el centro."
    },
    "PA-pa": {
      meaning: "potato",
      category: "food",
      ipa: "ˈpa.pa",
      severity: "high",
      example_sentence: "La papa hervida es un plato sencillo."
    }
  },

  "canto": {
    "CAN-to": {
      meaning: "I sing / song",
      category: "music",
      ipa: "ˈkan.to",
      severity: "high",
      example_sentence: "Canto en el coro de la iglesia."
    },
    "can-TÓ": {
      meaning: "he/she sang",
      category: "music",
      ipa: "kan.ˈto",
      severity: "high",
      example_sentence: "La soprano cantó con emoción."
    }
  },

  "término": {
    "TÉR-mi-no": {
      meaning: "term / end point",
      category: "language",
      ipa: "ˈteɾ.mi.no",
      severity: "high",
      example_sentence: "No entiendo ese término técnico."
    },
    "ter-MI-no": {
      meaning: "I finish / I end",
      category: "action",
      ipa: "teɾ.ˈmi.no",
      severity: "high",
      example_sentence: "Termino el trabajo a las cinco."
    },
    "ter-mi-NÓ": {
      meaning: "he/she finished",
      category: "action",
      ipa: "teɾ.mi.ˈno",
      severity: "medium",
      example_sentence: "Terminó la reunión tarde."
    }
  },

  "ánimo": {
    "Á-ni-mo": {
      meaning: "spirit / enthusiasm",
      category: "emotion",
      ipa: "ˈa.ni.mo",
      severity: "high",
      example_sentence: "¡Mucho ánimo para el examen!"
    },
    "a-NI-mo": {
      meaning: "I encourage",
      category: "action",
      ipa: "a.ˈni.mo",
      severity: "high",
      example_sentence: "Siempre animo a mis amigos."
    },
    "a-ni-MÓ": {
      meaning: "he/she encouraged",
      category: "action",
      ipa: "a.ni.ˈmo",
      severity: "medium",
      example_sentence: "El entrenador animó al equipo."
    }
  },

  "público": {
    "PÚ-bli-co": {
      meaning: "public (adj/noun)",
      category: "social",
      ipa: "ˈpu.βli.ko",
      severity: "high",
      example_sentence: "El parque público está abierto."
    },
    "pu-BLI-co": {
      meaning: "I publish",
      category: "media",
      ipa: "pu.ˈβli.ko",
      severity: "high",
      example_sentence: "Publico artículos cada semana."
    },
    "pu-bli-CÓ": {
      meaning: "he/she published",
      category: "media",
      ipa: "pu.βli.ˈko",
      severity: "medium",
      example_sentence: "La editorial publicó su novela."
    }
  },

  "tráfico": {
    "TRÁ-fi-co": {
      meaning: "traffic",
      category: "transport",
      ipa: "ˈtɾa.fi.ko",
      severity: "high",
      example_sentence: "Hay mucho tráfico en la ciudad."
    },
    "tra-FI-co": {
      meaning: "I traffic / I deal in",
      category: "action",
      ipa: "tɾa.ˈfi.ko",
      severity: "medium",
      example_sentence: "No trafico con información falsa."
    },
    "tra-fi-CÓ": {
      meaning: "he/she trafficked",
      category: "crime",
      ipa: "tɾa.fi.ˈko",
      severity: "medium",
      example_sentence: "La red traficó con mercancía ilegal."
    }
  },

  "líquido": {
    "LÍ-qui-do": {
      meaning: "liquid (noun/adj)",
      category: "substance",
      ipa: "ˈli.ki.ðo",
      severity: "high",
      example_sentence: "El líquido se derramó sobre la mesa."
    },
    "li-QUI-do": {
      meaning: "I liquidate",
      category: "finance",
      ipa: "li.ˈki.ðo",
      severity: "high",
      example_sentence: "Liquido las deudas cada mes."
    },
    "li-qui-DÓ": {
      meaning: "he/she liquidated",
      category: "finance",
      ipa: "li.ki.ˈðo",
      severity: "medium",
      example_sentence: "El banco liquidó la cuenta."
    }
  },

  "número": {
    "NÚ-me-ro": {
      meaning: "number",
      category: "quantity",
      ipa: "ˈnu.me.ɾo",
      severity: "high",
      example_sentence: "¿Cuál es tu número de teléfono?"
    },
    "nu-ME-ro": {
      meaning: "I number / I enumerate",
      category: "action",
      ipa: "nu.ˈme.ɾo",
      severity: "medium",
      example_sentence: "Numero las páginas del documento."
    },
    "nu-me-RÓ": {
      meaning: "he/she numbered",
      category: "action",
      ipa: "nu.me.ˈɾo",
      severity: "low",
      example_sentence: "El archivero numeró todos los documentos."
    }
  },

  "hablo": {
    "HA-blo": {
      meaning: "I speak / I talk",
      category: "communication",
      ipa: "ˈa.βlo",
      severity: "high",
      example_sentence: "Hablo español todos los días."
    },
    "ha-BLÓ": {
      meaning: "he/she spoke",
      category: "communication",
      ipa: "a.ˈβlo",
      severity: "high",
      example_sentence: "El director habló con claridad."
    }
  }
};

/**
 * Main function to detect intonation shifts that change meaning
 * @param transcript - The user's spoken text
 * @param stressPatterns - Array of words with their detected stress patterns
 * @returns Object containing intonation warnings
 */
export function checkIntonationShift(
  transcript: string,
  stressPatterns: Array<{ word: string; stress: string }>
): { warnings: IntonationWarning[] } {
  const warnings: IntonationWarning[] = [];
  const words = transcript.toLowerCase().split(' ');

  stressPatterns.forEach((pattern, index) => {
    const word = pattern.word.toLowerCase();

    // Check if this word has minimal pairs
    if (STRESS_MINIMAL_PAIRS[word]) {
      const pairs = STRESS_MINIMAL_PAIRS[word];
      const userStress = pattern.stress;

      // Determine expected stress from context
      const expectedStress = determineExpectedStress(word, transcript, index);

      // Compare user stress with expected
      if (userStress !== expectedStress && pairs[userStress] && pairs[expectedStress]) {
        const expectedVariant = pairs[expectedStress];
        const actualVariant = pairs[userStress];

        warnings.push({
          word,
          position: index,
          expected_stress: expectedStress,
          user_stress: userStress,
          expected_meaning: expectedVariant.meaning,
          actual_meaning: actualVariant.meaning,
          severity: actualVariant.severity || 'medium',
          explanation: `Your stress pattern changes the meaning from '${expectedVariant.meaning}' to '${actualVariant.meaning}'`
        });
      }
    }
  });

  return { warnings };
}

/**
 * Helper function to determine expected stress from context
 * Version 1 (MVP): Uses most common stress pattern
 * Version 2 (Future): Analyzes surrounding words for context
 * @param word - The word to analyze
 * @param fullTranscript - Complete user transcript
 * @param wordIndex - Position of word in transcript
 * @returns Expected stress pattern string
 */
function determineExpectedStress(
  word: string,
  fullTranscript: string,
  wordIndex: number
): string {
  const pairs = STRESS_MINIMAL_PAIRS[word];
  if (!pairs) return '';

  // For MVP, return the first (most common) pattern
  // TODO: Implement context analysis for V2
  return Object.keys(pairs)[0];
}

/**
 * Check if a word has stress-based minimal pairs
 * @param word - Word to check
 * @returns True if word has minimal pairs
 */
export function hasMinimalPairs(word: string): boolean {
  return word.toLowerCase() in STRESS_MINIMAL_PAIRS;
}

/**
 * Get all stress variants for a word
 * @param word - Word to get variants for
 * @returns Object with all stress patterns and their meanings
 */
export function getStressVariants(word: string): MinimalPair | null {
  return STRESS_MINIMAL_PAIRS[word.toLowerCase()] || null;
}

/**
 * Get severity level for a stress-based meaning change
 * @param word - Word to check
 * @param userStress - User's stress pattern
 * @param expectedStress - Expected stress pattern
 * @returns Severity level or null if not found
 */
export function getStressErrorSeverity(
  word: string,
  userStress: string,
  expectedStress: string
): 'low' | 'medium' | 'high' | null {
  const pairs = STRESS_MINIMAL_PAIRS[word.toLowerCase()];
  if (!pairs || !pairs[userStress]) return null;
  
  return pairs[userStress].severity || 'medium';
}
