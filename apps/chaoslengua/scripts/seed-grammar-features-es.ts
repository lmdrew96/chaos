import { db } from '@/lib/db';
import { grammarFeatureMap } from '@/lib/db/schema';
import type { NewGrammarFeature } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const features: NewGrammarFeature[] = [
  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1B: SER family
  // ═══════════════════════════════════════
  {
    featureKey: 'ser_identity',
    featureName: 'Ser for Identity',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" to express identity and essential characteristics: Soy Nae. Eres estudiante. Es mi hermana. Answers "who/what is this fundamentally?"',
    sortOrder: 1,
  },
  {
    featureKey: 'ser_classification',
    featureName: 'Ser for Classification',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" to classify or categorize: Es un perro. Son libros. Es una profesora. Groups things into kinds/types.',
    sortOrder: 2,
  },
  {
    featureKey: 'ser_origin',
    featureName: 'Ser for Origin (ser de)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser de" to express origin/nationality: Soy de Estados Unidos. Es de Madrid. Son de México. Note the preposition "de" is obligatory.',
    sortOrder: 3,
  },
  {
    featureKey: 'ser_profession',
    featureName: 'Ser for Profession',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" for profession/occupation, with NO indefinite article: Soy profesora (NOT "soy una profesora" unless modified). Es médico. A common L1 English interference error.',
    sortOrder: 4,
  },
  {
    featureKey: 'ser_material',
    featureName: 'Ser for Material',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser de" to express material composition: Es de madera. La mesa es de cristal. Los zapatos son de cuero.',
    sortOrder: 5,
  },
  {
    featureKey: 'ser_time',
    featureName: 'Ser for Time and Date',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" for telling time and dates: Son las tres. Es lunes. Es el cinco de mayo. Note: always third-person singular or plural based on the number of hours.',
    sortOrder: 6,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1B: ESTAR family
  // ═══════════════════════════════════════
  {
    featureKey: 'estar_location',
    featureName: 'Estar for Location',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" to express physical location: Estoy en casa. Madrid está en España. Estamos aquí. Location is always estar, regardless of permanence — Madrid has been there for centuries but still uses estar.',
    sortOrder: 7,
  },
  {
    featureKey: 'estar_physical_state',
    featureName: 'Estar for Physical States',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" for physical conditions/states: Estoy cansada. Está enfermo. Están sentados. Temporary physical states that can change.',
    sortOrder: 8,
  },
  {
    featureKey: 'estar_emotional_state',
    featureName: 'Estar for Emotional States',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" for emotional/mood states: Estoy feliz. Está triste. Estamos nerviosos. How someone feels at a given moment, not their essential character.',
    sortOrder: 9,
  },
  {
    featureKey: 'estar_progressive',
    featureName: 'Estar for Progressive (estar + gerundio)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" with gerund (-ando/-iendo) to express ongoing action: Estoy comiendo. Está estudiando. Están trabajando. Only with estar — never with ser.',
    sortOrder: 10,
  },
  {
    featureKey: 'estar_result_of_change',
    featureName: 'Estar for Result of Change',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" with participles to express the resulting state of an action: La puerta está cerrada. El trabajo está terminado. Contrasts with passive ser + participle.',
    sortOrder: 11,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1B: SER/ESTAR contrast
  // ═══════════════════════════════════════
  {
    featureKey: 'ser_estar_contrast',
    featureName: 'Ser vs Estar: Semantic Minimal Pairs',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Same adjective with ser vs estar produces different meanings: es aburrido (boring) vs está aburrido (bored); es listo (clever) vs está listo (ready); es rico (wealthy) vs está rico (tastes good); es verde (green / inexperienced) vs está verde (unripe). The most challenging Spanish L2 fossilization point.',
    sortOrder: 12,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Preterite
  // ═══════════════════════════════════════
  {
    featureKey: 'preterite_perfective',
    featureName: 'Preterite for Completed Actions',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Preterite tense for discrete, completed past events: Comí paella ayer. Hablaste con María. Fuimos a Madrid. Marks the event as finished and bounded. Spanish aspect distinction absent in English.',
    sortOrder: 13,
  },
  {
    featureKey: 'preterite_narrative_foreground',
    featureName: 'Preterite as Narrative Foreground',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Preterite carrying the main event-chain of a story: Entró, miró alrededor, saludó a su amigo, se sentó. These are the "what happened" events that drive the narrative forward.',
    sortOrder: 14,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Imperfect
  // ═══════════════════════════════════════
  {
    featureKey: 'imperfect_habitual',
    featureName: 'Imperfect for Habitual Past',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect tense for repeated/habitual past actions: Jugaba al fútbol todos los días. Comíamos juntos los domingos. "Used to / would" in English.',
    sortOrder: 15,
  },
  {
    featureKey: 'imperfect_descriptive',
    featureName: 'Imperfect for Description',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect for ongoing past descriptions without clear start/end: Era alto y tenía el pelo castaño. La casa estaba en la colina. Hacía frío. States rather than events.',
    sortOrder: 16,
  },
  {
    featureKey: 'imperfect_narrative_background',
    featureName: 'Imperfect as Narrative Background',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect setting the scene around preterite events in narrative: Eran las tres, hacía sol, María caminaba por el parque cuando vio a Juan. The background is imperfect; the interrupting event is preterite.',
    sortOrder: 17,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1C: Preterite/Imperfect contrast
  // ═══════════════════════════════════════
  {
    featureKey: 'preterite_imperfect_contrast',
    featureName: 'Preterite vs Imperfect: Aspectual Distinction',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Same verb in both tenses produces different meanings: conocí (I met) vs conocía (I knew); supe (I found out) vs sabía (I knew); quise (I tried) vs quería (I wanted); pude (I managed to) vs podía (I was able to). Major Spanish L2 fossilization point — no English L1 model.',
    sortOrder: 18,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Object pronouns
  // ═══════════════════════════════════════
  {
    featureKey: 'direct_object_pronoun_preverbal',
    featureName: 'Direct Object Pronouns (Preverbal)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Direct object pronouns me/te/lo/la/nos/os/los/las placed before finite verbs: Lo veo. La compré. Nos llamaron. Replace the direct object. Preverbal position only at Stage 1; attached forms (quiero verlo) are Stage 2.',
    sortOrder: 19,
  },
  {
    featureKey: 'indirect_object_pronoun_preverbal',
    featureName: 'Indirect Object Pronouns (Preverbal)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Indirect object pronouns me/te/le/nos/os/les placed before finite verbs: Le di el libro. Me escribió una carta. Nos explicó todo. Marks the recipient. Redundant "a + noun" common (Le di el libro a María).',
    sortOrder: 20,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1C stretch: Combined object pronouns
  // ═══════════════════════════════════════
  {
    featureKey: 'combined_object_pronoun_preverbal',
    featureName: 'Combined Object Pronouns (le → se)',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'When both direct and indirect object pronouns appear with third person DO, indirect "le/les" becomes "se": Se lo di (not "le lo di"). Se las mostré. Order is always indirect before direct. Stretch content for late Stage 1 / early Stage 2.',
    sortOrder: 21,
  },

  // ═══════════════════════════════════════
  // A1/A2 PHONOLOGY — PHASE 1A: foundational pronunciation features
  // English L1 → Spanish L2 high-impact phonological contrasts
  // ═══════════════════════════════════════
  {
    featureKey: 'phon_vowel_purity',
    featureName: 'Spanish Vowel Purity',
    cefrLevel: 'A1',
    category: 'phonology',
    description: 'Spanish has 5 pure, short vowels (/a e i o u/) with no diphthongization. English speakers tend to add glides: /e/ → [eɪ] (mesa → "mesay"), /o/ → [oʊ] (no → "noh-uh"). Hold each vowel short and steady, same quality from start to end.',
    sortOrder: 100,
  },
  {
    featureKey: 'phon_silent_h',
    featureName: 'Silent Letter H',
    cefrLevel: 'A1',
    category: 'phonology',
    description: 'The letter "h" is always silent in Spanish: hola → /ˈo.la/, hospital → /os.piˈtal/, hablar → /aˈβlaɾ/. Never aspirate it. The only h-like sound in Spanish is written "j" or "g" (before e/i).',
    sortOrder: 101,
  },
  {
    featureKey: 'phon_stress_predictable',
    featureName: 'Predictable Stress Rules',
    cefrLevel: 'A1',
    category: 'phonology',
    description: 'Spanish stress is rule-governed: words ending in vowel/n/s stress the penultimate syllable (CAsa, COmen, MEsas); other endings stress the final syllable (haBLAR, feLIZ). Written accents (´) override the rules and mark the stressed syllable explicitly (caFÉ, MÉdico, JaPÓN).',
    sortOrder: 102,
  },
  {
    featureKey: 'phon_syllable_timing',
    featureName: 'Syllable-Timed Rhythm',
    cefrLevel: 'A1',
    category: 'phonology',
    description: 'Spanish is syllable-timed: each syllable gets roughly equal duration, unlike English stress-timing which compresses unstressed syllables. Common L1 interference: English speakers reduce unstressed Spanish vowels to schwa /ə/ (saying "buh-NAH-nah" instead of "ba-NA-na"). Give every syllable its full vowel.',
    sortOrder: 103,
  },
  {
    featureKey: 'phon_flap_r',
    featureName: 'Single R as Alveolar Flap',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'The single Spanish /r/ between vowels or after most consonants is an alveolar flap [ɾ] — a quick tongue-tap against the alveolar ridge, identical to the American English "tt" in "butter" or "ladder". Examples: pero, caro, tres. Do NOT use the English retroflex /ɹ/.',
    sortOrder: 104,
  },
  {
    featureKey: 'phon_trill_rr',
    featureName: 'Double RR as Alveolar Trill',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'The double "rr" (and word-initial "r") is an alveolar trill [r] — multiple rapid tongue vibrations against the alveolar ridge. Examples: perro, carro, rojo, Roma. This is the single most challenging Spanish phoneme for English L1 learners. Distinguishes minimal pairs: pero (but) / perro (dog), caro (expensive) / carro (car).',
    sortOrder: 105,
  },
  {
    featureKey: 'phon_palatal_n',
    featureName: 'Palatal Nasal Ñ',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'The letter "ñ" is a palatal nasal /ɲ/ — articulated with the body of the tongue against the hard palate. Closest English approximation is the "ny" in "canyon" or "onion", but Spanish /ɲ/ is a single segment, not two. Examples: año (year), niño (child), señor (sir). Distinguishes año (year) / ano (anus) — important to get right.',
    sortOrder: 106,
  },
  {
    featureKey: 'phon_bv_merger',
    featureName: 'B/V Merger (No Distinction)',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'Spanish "b" and "v" represent the same phoneme — pronounced as bilabial stop [b] after pause or /m, n/ (vamos, hombre, un beso), and as bilabial approximant [β] elsewhere (haber, lavar, la vaca). Never use the English labiodental [v]. Vaca and baca are pronounced identically.',
    sortOrder: 107,
  },
  {
    featureKey: 'phon_voiceless_velar_j',
    featureName: 'Voiceless Velar Fricative J',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'The letter "j" (and "g" before e/i) is /x/ — a voiceless velar fricative, articulated further back than English /h/. Examples: jamón, jugar, gente, gigante. English speakers default to /h/ which sounds noticeably foreign; aim for friction at the back of the mouth.',
    sortOrder: 108,
  },
  {
    featureKey: 'phon_stress_contrast',
    featureName: 'Stress-Contrast Minimal Pairs',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'Many Spanish words differ only in stress placement, marked by the written accent: término (term, noun) / termino (I finish, present) / terminó (he finished, preterite). papá (dad) / papa (potato/pope). sí (yes) / si (if). Misplacing stress changes the word, tense, or person — not just accent.',
    sortOrder: 109,
  },
  {
    featureKey: 'phon_sinalefa',
    featureName: 'Vowel Linking (Sinalefa)',
    cefrLevel: 'A2',
    category: 'phonology',
    description: 'When a word ending in a vowel meets a word starting with a vowel, the two vowels merge into one syllable: la amiga → [la.ˈmi.ɣa], mi hermano → [mjeɾˈma.no], ¿cómo estás? → [ˈko.mo.esˈtas]. Native Spanish speech is heavily linked; pronouncing each word in isolation sounds robotic and foreign.',
    sortOrder: 110,
  },
];

async function seedGrammarFeatures() {
  console.log('🧠 Seeding Spanish grammar feature map...');
  console.log(`   ${features.filter(f => f.cefrLevel === 'A2' && f.category === 'grammar').length} A2 grammar features`);
  console.log(`   ${features.filter(f => f.cefrLevel === 'B1' && f.category === 'grammar').length} B1 grammar features`);
  console.log(`   ${features.filter(f => f.category === 'phonology').length} phonology features`);
  console.log(`   ${features.length} total features\n`);

  try {
    // Upsert: insert or update relevant fields if feature_key already exists
    for (const feature of features) {
      await db
        .insert(grammarFeatureMap)
        .values(feature)
        .onConflictDoUpdate({
          target: grammarFeatureMap.featureKey,
          set: {
            featureName: feature.featureName,
            cefrLevel: feature.cefrLevel,
            category: feature.category,
            description: feature.description,
            sortOrder: feature.sortOrder ?? 0,
          },
        });
    }

    console.log('✅ Spanish grammar feature map seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed grammar features:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedGrammarFeatures();
