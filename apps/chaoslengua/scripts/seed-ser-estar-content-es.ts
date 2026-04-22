// scripts/seed-ser-estar-content-es.ts
// ChaosLengua — ser/estar exercise set (Stage 1 error pattern #1)
//
// 9 focused content items that expose ser/estar contrasts in comprehensible
// input. Six passages tagged ser_vs_estar_core cover the full semantic split
// (identity/origin/profession/characteristics via ser; location/states/
// progressive/results-of-change via estar). Three passages tagged
// ser_vs_estar_meaning_shift pair both meanings of meaning-shifting adjectives
// (aburrido, listo, rico, verde, malo) within a single passage so the Noticing
// Hypothesis (Schmidt 1990) activates — scattered mentions across items don't
// produce noticing.
//
// Difficulty: 2.5-4.5 (late A1 through A2→B1 plateau). All text-based; the
// audio pipeline (R2 + Google TTS) is a separate open patch.
//
// Dialectal baseline: LatAm-neutral. No vosotros, no voseo, seseo assumed.
// Proper names drawn from varied LatAm + Peninsular origins.
//
// PREREQUISITE: Run scripts/seed-grammar-features-es.ts first so the
// feature keys referenced here exist in grammar_feature_map.
//
// Pedagogical reference:
//   docs/pedagogy/error-garden-taxonomy-es.md (clustering targets)
//   chaoslengua-id-consultant skill → spanish-specific.md §3 (ser/estar strategies)

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const serEstarContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // SER_VS_ESTAR_CORE — Full semantic-split coverage (6 items)
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Mi rutina diaria',
    difficultyLevel: '2.5',
    durationSeconds: 75,
    topic: 'Rutinas y profesiones',
    textContent: `Me llamo Elena y soy profesora de matemáticas. Soy de Guadalajara, pero ahora vivo en Monterrey. Mi escuela está en el centro de la ciudad, cerca del parque. Todas las mañanas estoy cansada cuando me despierto, pero me gusta mi trabajo. Mis estudiantes son jóvenes y son muy inteligentes. Cuando llego a la escuela, la puerta principal está abierta y ya hay otros profesores adentro. A veces estoy nerviosa antes de los exámenes, pero siempre salen bien.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'present_tense_regular_ar',
        'reflexive_verbs_es',
        'gustar_construction',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['profesora', 'matemáticas', 'escuela', 'centro', 'mañanas', 'cansada', 'estudiantes', 'nerviosa', 'exámenes'],
        requiredVocabSize: 50,
      },
      structures: [
        'Ser for identity and profession',
        'Ser de for origin',
        'Estar for location and emotional states',
        'Reflexive verb in daily routine',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: '¿Dónde estás?',
    difficultyLevel: '2.5',
    durationSeconds: 75,
    topic: 'Conversación telefónica',
    textContent: `— Hola, Marta. ¿Dónde estás?
— Estoy en el café de la esquina. El lugar es muy bonito, con muchas plantas.
— ¿Y cómo estás hoy?
— Bien, un poco cansada. ¿Y tú?
— Yo estoy en casa. Estoy trabajando en un proyecto difícil.
— ¿De qué es el proyecto?
— Es sobre arquitectura sostenible. Es complicado, pero es interesante.
— ¿Estás libre mañana?
— No, mañana estoy muy ocupado. Tengo reuniones todo el día.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'basic_questions',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['café', 'esquina', 'plantas', 'proyecto', 'arquitectura', 'sostenible', 'complicado', 'libre', 'ocupado'],
        requiredVocabSize: 55,
      },
      structures: [
        'Dialogue format',
        'Estar for location and state',
        'Ser for topic definition and characteristic',
        'Estar + gerund (progressive)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La familia de Ana',
    difficultyLevel: '3.0',
    durationSeconds: 100,
    topic: 'Familia y relaciones',
    textContent: `La familia de Ana es grande y muy unida. Sus padres son médicos y siempre están ocupados en el hospital. Su madre es de Argentina, pero su padre es mexicano. Ana tiene dos hermanos. Su hermano mayor, Diego, es arquitecto y vive en Buenos Aires. Él está casado con una mujer italiana. Su hermana menor, Sofía, todavía es estudiante. Sofía es inteligente y muy creativa. Los abuelos de Ana están jubilados y están en Mar del Plata por el verano. La casa de los abuelos está cerca de la playa. Es una casa antigua, pero es muy cómoda.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'possessives',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['familia', 'unida', 'médicos', 'hospital', 'arquitecto', 'casado', 'estudiante', 'jubilados', 'playa', 'cómoda'],
        requiredVocabSize: 60,
      },
      structures: [
        'Ser for identity, origin, profession, characteristics',
        'Estar for location, progressive states, results of change (casado)',
        'Possessive adjectives with family vocabulary',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Un mal día',
    difficultyLevel: '3.5',
    durationSeconds: 110,
    topic: 'Estados emocionales y salud',
    textContent: `Hoy no es un buen día. Estoy muy cansado y estoy un poco enfermo. Tengo fiebre y me duele la cabeza. Mi jefe está enojado porque no terminé el informe ayer. La verdad es que estoy estresado con el trabajo últimamente. Mi esposa también está preocupada. Ella piensa que necesito descansar. Creo que tiene razón. El médico dice que estoy agotado y que tengo que tomar vacaciones. Las vacaciones son caras este año, pero mi salud es más importante. Vamos a viajar al mar. Mi esposa es optimista y dice que el sol va a ser bueno para mí.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'preterite_formation',
        'future_ir_a',
        'present_tense_stem_change',
        'gustar_construction',
        'gender_agreement',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['cansado', 'enfermo', 'fiebre', 'jefe', 'enojado', 'informe', 'estresado', 'preocupada', 'agotado', 'vacaciones', 'salud', 'optimista'],
        requiredVocabSize: 80,
      },
      structures: [
        'Heavy estar usage for emotional/physical states',
        'Ser for evaluation (buen día, importante, optimista)',
        'Ir + a + infinitive future',
        'Duele construction (gustar-pattern)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La oficina nueva',
    difficultyLevel: '4.0',
    durationSeconds: 130,
    topic: 'Trabajo y ambiente laboral',
    textContent: `La nueva oficina donde trabajo es muy moderna. Está en el piso doce de un edificio en el centro. Desde mi ventana, las vistas son increíbles: puedo ver casi toda la ciudad. Mis compañeros de trabajo son amables, aunque algunos están más ocupados que otros. Mi escritorio está al lado de la sala de reuniones, lo cual a veces es un problema porque hay mucho ruido. El jefe es una persona muy directa, pero está siempre dispuesto a ayudar. Cuando estoy cansado por la tarde, bajo a la cafetería. El café de la cafetería es excelente, aunque los precios son altos. Lo que más me gusta es que la oficina está cerca de mi casa: solo tengo que caminar veinte minutos.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'present_tense_stem_change',
        'gustar_construction',
        'comparisons',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['oficina', 'moderna', 'edificio', 'vistas', 'compañeros', 'amables', 'escritorio', 'ruido', 'directa', 'cafetería', 'precios'],
        requiredVocabSize: 85,
      },
      structures: [
        'Ser for characteristics and identity',
        'Estar for location and state',
        'Comparison with comparative + que',
        'Cleft "lo que más me gusta"',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El viaje de Carlos',
    difficultyLevel: '4.5',
    durationSeconds: 160,
    topic: 'Viajes y experiencias pasadas',
    textContent: `Carlos es de un pueblo pequeño en el norte de España. Siempre fue una persona curiosa y desde niño quiso conocer otros países. El verano pasado, después de años de ahorrar, decidió hacer un viaje largo por Sudamérica. Su primer destino fue Lima. Estuvo allí dos semanas. La ciudad era fascinante: los edificios coloniales eran bellos y la comida era deliciosa. En Lima, conoció a una chica argentina llamada Lucía. Ella estaba de vacaciones también. Los dos eran jóvenes, estaban solos en un país nuevo y tenían muchas cosas en común. Después de Lima, viajaron juntos a Cusco. Cusco está a más de tres mil metros de altura, así que Carlos estaba muy cansado los primeros días. Pero las ruinas incas eran impresionantes. Carlos piensa que ese viaje fue la mejor experiencia de su vida.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_core',
        'preterite_formation',
        'imperfect_formation',
        'preterite_vs_imperfect_aspect',
        'preterite_imperfect_meaning_shift',
        'present_tense_ser',
        'present_tense_estar',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['pueblo', 'curiosa', 'ahorrar', 'destino', 'fascinante', 'coloniales', 'argentina', 'vacaciones', 'altura', 'ruinas', 'experiencia'],
        requiredVocabSize: 95,
      },
      structures: [
        'Ser/estar in preterite vs imperfect (narrative)',
        'Preterite for bounded events, imperfect for descriptive background',
        'Conocer meaning-shift (met for first time)',
        'Narrative aspectual contrast',
      ],
    },
    culturalNotes: 'The Inca ruins near Cusco — Machu Picchu, Sacsayhuamán, Ollantaytambo — are South America\'s most visited archaeological sites. Altitude sickness (soroche) at 3400m is real and affects most travelers on arrival.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // SER_VS_ESTAR_MEANING_SHIFT — Noticing Hypothesis passages (3 items)
  // Each passage pairs both meanings of meaning-shifting adjectives
  // within the same production. Meta-commentary makes the contrast
  // explicit.
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: '¡Qué aburrido!',
    difficultyLevel: '3.5',
    durationSeconds: 110,
    topic: 'Opiniones y experiencias',
    textContent: `Mi primo Javier piensa que todas las películas históricas son aburridas. Yo no estoy de acuerdo. Ayer fuimos al cine a ver una película sobre la Revolución Mexicana. Javier estaba aburrido después de diez minutos — empezó a mirar su teléfono. Pero yo no estaba aburrida para nada. La historia era muy interesante. Para mí, no es aburrido aprender sobre el pasado. Creo que el problema de Javier no es la película: es él. Cuando una persona es aburrida, todo le parece aburrido. Cuando estás aburrido con algo, puede ser porque no le prestas atención. Son dos cosas diferentes, aunque la palabra sea la misma.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_meaning_shift',
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'preterite_formation',
        'imperfect_formation',
        'gender_agreement',
        'definite_articles',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['primo', 'películas', 'históricas', 'aburridas', 'Revolución', 'interesante', 'pasado', 'problema', 'atención'],
        requiredVocabSize: 75,
      },
      structures: [
        'Aburrido meaning-shift: ser aburrido (boring trait) vs estar aburrido (bored state)',
        'Explicit meta-commentary on the distinction',
        'Preterite/imperfect mixed with ser/estar',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Listo para todo',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Familia y cocina',
    textContent: `Mi abuela siempre dice que tu tío Pablo es muy listo, pero nunca está listo a tiempo para nada. Es verdad. Pablo es un hombre muy inteligente: entiende todo rápido y tiene ideas brillantes. Pero cuando vamos a comer todos juntos, siempre llega tarde. Cuando le preguntamos "¿Ya estás listo?", él responde "Un momento más" — y pasan treinta minutos. A mi abuela le encanta cocinar. Su familia no es rica: no tienen mucho dinero. Pero toda su comida está riquísima. Ayer probé el mole que hizo. Le dije: "Abuela, ¡este mole está rico de verdad!" Ella sonrió. Entiendo ahora la diferencia entre ser y estar con estas palabras: ser listo es ser inteligente, pero estar listo es estar preparado. Y una familia puede no ser rica, pero un plato bien hecho siempre está rico.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_meaning_shift',
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'preterite_formation',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'gustar_construction',
        'present_tense_stem_change',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['abuela', 'tío', 'listo', 'inteligente', 'brillantes', 'preparado', 'rica', 'dinero', 'comida', 'mole', 'preparado', 'diferencia'],
        requiredVocabSize: 95,
      },
      structures: [
        'Listo meaning-shift: ser listo (clever) vs estar listo (ready)',
        'Rico meaning-shift: ser rico (wealthy) vs estar rico (delicious)',
        'Explicit meta-commentary on both pairs',
        'Indirect + direct object pronouns (le dije)',
      ],
    },
    culturalNotes: 'Mole is a traditional Mexican sauce with chiles, chocolate, and spices. Saying "está rico" about someone\'s cooking is high praise — stronger than "está bueno."',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Las uvas están verdes',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Vida cotidiana y anécdotas',
    textContent: `El verano pasado, mi vecino Don Pedro me regaló uvas de su jardín. Sabía que las uvas maduras son de color morado, pero las uvas que me dio todavía estaban verdes — no podíamos comerlas. "Paciencia", me dijo. "Tienen que madurar." Don Pedro era un hombre muy alegre y activo. Nunca estaba aburrido. Un día, sin embargo, no lo vi en el jardín. Su hija me dijo que estaba malo, en cama con gripe. "No te preocupes", me explicó. "Mi padre no es malo — solo está enfermo unos días." Me reí: por un momento pensé que me estaba describiendo el carácter de Don Pedro, no su salud. Una semana después, Don Pedro ya estaba bien. Las uvas también: ya no estaban verdes, sino dulces y perfectas. Las palabras son las mismas, pero con ser y estar, los significados cambian completamente.`,
    languageFeatures: {
      grammar: [
        'ser_vs_estar_meaning_shift',
        'ser_vs_estar_core',
        'preterite_formation',
        'imperfect_formation',
        'preterite_vs_imperfect_aspect',
        'present_tense_ser',
        'present_tense_estar',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'gender_agreement',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['vecino', 'jardín', 'uvas', 'maduras', 'morado', 'verdes', 'paciencia', 'madurar', 'alegre', 'gripe', 'enfermo', 'carácter', 'salud', 'significados'],
        requiredVocabSize: 100,
      },
      structures: [
        'Verde meaning-shift: ser verde (green color) vs estar verde (unripe)',
        'Malo meaning-shift: ser malo (bad person) vs estar malo (sick)',
        'Explicit meta-commentary on the distinction',
        'Extended narrative with preterite/imperfect',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedSerEstarContent() {
  console.log('🌱 Seeding ser/estar exercise set (Stage 1 error pattern #1)...');
  console.log(`   6 ser_vs_estar_core items (full semantic-split coverage)`);
  console.log(`   3 ser_vs_estar_meaning_shift items (Noticing Hypothesis passages)`);
  console.log(`   ${serEstarContent.length} total items at difficulty 2.5–4.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(serEstarContent).returning();
    console.log(`✅ Seeded ${inserted.length} ser/estar content items.`);
    console.log('\n   Next: exercise sets for preterite/imperfect, por/para, object pronouns.');
  } catch (error) {
    console.error('❌ Failed to seed ser/estar content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedSerEstarContent();
