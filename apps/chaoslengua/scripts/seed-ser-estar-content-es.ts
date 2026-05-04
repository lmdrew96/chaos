// scripts/seed-ser-estar-content-es.ts
// ChaosLengua — ser/estar exercise set (Stage 1 error pattern #1)
//
// 20 focused content items that expose ser/estar contrasts in comprehensible
// input. Items are tagged against sub-skill featureKeys (ser_identity,
// ser_classification, ser_origin, ser_profession, ser_material, ser_time,
// estar_location, estar_physical_state, estar_emotional_state,
// estar_progressive, estar_result_of_change, ser_estar_contrast) so the
// Adaptation Engine and Error Garden can target specific fossilization points.
//
// Items 10-20 explicitly pair both meanings of meaning-shifting adjectives
// (aburrido, listo, rico, verde, malo, vivo) within a single passage so the
// Noticing Hypothesis (Schmidt 1990) activates — scattered mentions across
// items don't produce noticing.
//
// Difficulty: 2.5-4.5 (late A1 through A2→B1 plateau). All text-based; the
// audio pipeline (R2 + Google TTS) runs after seeding via generate-gap-audio-es.
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
  // CORE SUB-SKILL COVERAGE (12 items)
  // Exercises specific ser_* and estar_* sub-skills across varied topics.
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
        'ser_identity',
        'ser_profession',
        'ser_origin',
        'ser_classification',
        'estar_location',
        'estar_physical_state',
        'estar_emotional_state',
        'estar_result_of_change',
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
        'estar_location',
        'estar_physical_state',
        'estar_emotional_state',
        'estar_progressive',
        'ser_classification',
        'ser_identity',
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
        'ser_classification',
        'ser_profession',
        'ser_origin',
        'estar_location',
        'estar_emotional_state',
        'estar_result_of_change',
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
        'Estar for location, progressive states, results of change (casado, jubilados)',
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
        'estar_physical_state',
        'estar_emotional_state',
        'ser_classification',
        'ser_estar_contrast',
        'preterite_perfective',
        'future_informal_ir_a',
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
        'estar_location',
        'ser_classification',
        'estar_emotional_state',
        'estar_physical_state',
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
        'ser_origin',
        'ser_classification',
        'estar_location',
        'estar_physical_state',
        'estar_emotional_state',
        'ser_estar_contrast',
        'preterite_perfective',
        'preterite_narrative_foreground',
        'imperfect_descriptive',
        'imperfect_narrative_background',
        'preterite_imperfect_contrast',
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

  {
    type: 'text',
    title: 'La hora del té',
    difficultyLevel: '2.5',
    durationSeconds: 70,
    topic: 'Tradiciones familiares',
    textContent: `Son las cinco de la tarde. Es la hora del té en casa de mi tía. Mi tía es inglesa, pero vive en Madrid. La cocina es pequeña pero está limpia y organizada. El agua está hirviendo y el té ya está listo. Mis primos están sentados en el salón, esperando. Las galletas son de una panadería del barrio. Hoy estoy contento porque es una tradición familiar que me gusta mucho.`,
    languageFeatures: {
      grammar: [
        'ser_time',
        'ser_classification',
        'ser_origin',
        'estar_location',
        'estar_progressive',
        'estar_result_of_change',
        'estar_emotional_state',
        'gender_agreement',
        'definite_articles',
        'gustar_construction',
      ],
      vocabulary: {
        keywords: ['hora', 'té', 'tía', 'inglesa', 'cocina', 'agua', 'hirviendo', 'galletas', 'panadería', 'tradición'],
        requiredVocabSize: 50,
      },
      structures: [
        'Ser for time-of-day',
        'Ser de for origin (inglesa)',
        'Estar for location and result-of-change (sentados, listo)',
        'Estar + gerund (progressive: hirviendo)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La mesa de cristal',
    difficultyLevel: '2.5',
    durationSeconds: 75,
    topic: 'Casa y objetos',
    textContent: `La mesa del comedor es de cristal y madera. Es de Italia, comprada hace muchos años por mis padres. Está en el centro del comedor, debajo de una lámpara antigua. Es muy elegante, pero también es práctica. Hoy está puesta para una cena especial: viene mi hermana de Buenos Aires. Las copas son de cristal fino. Los platos son de cerámica blanca. Mi madre está muy emocionada porque hace meses que no vemos a mi hermana.`,
    languageFeatures: {
      grammar: [
        'ser_material',
        'ser_origin',
        'ser_classification',
        'estar_location',
        'estar_result_of_change',
        'estar_emotional_state',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['mesa', 'comedor', 'cristal', 'madera', 'Italia', 'lámpara', 'antigua', 'elegante', 'cena', 'copas', 'cerámica'],
        requiredVocabSize: 55,
      },
      structures: [
        'Ser de for material (de cristal y madera, de cerámica)',
        'Ser de for origin (de Italia)',
        'Estar for location and result-of-change (puesta)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La puerta abierta',
    difficultyLevel: '2.5',
    durationSeconds: 80,
    topic: 'Vida de oficina',
    textContent: `La puerta de la oficina está abierta, pero no hay nadie adentro. Las luces están apagadas. Las ventanas también están cerradas. Es extraño: mi compañero siempre está aquí a las nueve. ¿Dónde estará? Espero un poco. Después de diez minutos, decido entrar. Sobre el escritorio hay una nota: "Estoy en una reunión en el piso cinco." Todo es normal otra vez. Mi compañero es una persona muy organizada — siempre deja notas cuando no está.`,
    languageFeatures: {
      grammar: [
        'estar_result_of_change',
        'estar_location',
        'ser_classification',
        'ser_identity',
        'gender_agreement',
        'definite_articles',
        'basic_negation',
        'basic_questions',
      ],
      vocabulary: {
        keywords: ['puerta', 'oficina', 'abierta', 'luces', 'apagadas', 'ventanas', 'cerradas', 'compañero', 'nota', 'reunión', 'piso'],
        requiredVocabSize: 60,
      },
      structures: [
        'Estar with participles (abierta, apagadas, cerradas) — result of change',
        'Estar for location',
        'Ser for identity and characterization',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'En el parque',
    difficultyLevel: '3.0',
    durationSeconds: 90,
    topic: 'Tiempo libre y familia',
    textContent: `Los niños están jugando en el parque. Algunos están corriendo, otros están subiendo a los árboles. El parque es enorme y hay muchas familias. Mi hijo mayor está cansado: jugó al fútbol toda la mañana. Está sentado en un banco, comiendo una manzana. La manzana está rica — es de la huerta de su abuela. Mi hija menor todavía no está cansada: tiene cinco años y es muy activa. Es una niña muy alegre.`,
    languageFeatures: {
      grammar: [
        'estar_progressive',
        'estar_location',
        'estar_physical_state',
        'estar_result_of_change',
        'ser_classification',
        'ser_origin',
        'ser_estar_contrast',
        'gender_agreement',
        'definite_articles',
        'preterite_perfective',
      ],
      vocabulary: {
        keywords: ['niños', 'parque', 'jugando', 'corriendo', 'árboles', 'fútbol', 'banco', 'manzana', 'huerta', 'abuela', 'activa'],
        requiredVocabSize: 65,
      },
      structures: [
        'Estar + gerund (progressive) — multiple instances',
        'Estar for physical state vs ser for character (cansada vs activa, alegre)',
        'Está rica (state) signals food praise',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Mi mejor amiga',
    difficultyLevel: '3.0',
    durationSeconds: 95,
    topic: 'Amistad y relaciones',
    textContent: `Mi mejor amiga se llama Lucía. Es chilena, pero vive en Lima desde hace cinco años. Es ingeniera y trabaja para una empresa internacional. Lucía es una persona muy alegre por naturaleza. Pero esta semana está triste: su abuela está enferma. Cuando alguien que es alegre está triste, todos lo notan inmediatamente. Hoy hablé con ella por teléfono — está preocupada, pero también está agradecida porque toda la familia está cerca de su abuela ahora.`,
    languageFeatures: {
      grammar: [
        'ser_identity',
        'ser_classification',
        'ser_origin',
        'ser_profession',
        'estar_emotional_state',
        'estar_physical_state',
        'estar_location',
        'ser_estar_contrast',
        'gender_agreement',
        'preterite_perfective',
      ],
      vocabulary: {
        keywords: ['amiga', 'chilena', 'ingeniera', 'empresa', 'alegre', 'naturaleza', 'triste', 'enferma', 'preocupada', 'agradecida'],
        requiredVocabSize: 65,
      },
      structures: [
        'Ser for identity, origin, profession',
        'Estar for emotional state and physical state',
        'Explicit contrast: ser alegre (trait) vs estar triste (state)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La cena de Navidad',
    difficultyLevel: '3.5',
    durationSeconds: 110,
    topic: 'Tradiciones y comida',
    textContent: `Son las nueve de la noche. Es Nochebuena. La mesa ya está puesta y la comida está lista. Mi madre está cocinando todavía: hay un postre que toma horas. Mi padre está sirviendo el vino. Mis tíos ya están sentados, hablando del trabajo. La sopa está caliente y huele riquísimo. La familia de mi padre no es rica — somos de un pueblo pequeño. Pero en Nochebuena, la mesa siempre está llena de comida muy rica. Las recetas son tradicionales, de mi abuela. Estoy feliz de estar aquí.`,
    languageFeatures: {
      grammar: [
        'ser_time',
        'ser_classification',
        'ser_origin',
        'ser_estar_contrast',
        'estar_progressive',
        'estar_result_of_change',
        'estar_location',
        'estar_physical_state',
        'estar_emotional_state',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['Nochebuena', 'mesa', 'puesta', 'comida', 'cocinando', 'postre', 'vino', 'sopa', 'recetas', 'tradicionales'],
        requiredVocabSize: 75,
      },
      structures: [
        'Ser for time and date (son las nueve, es Nochebuena)',
        'Estar with participles (puesta, lista, sentados)',
        'Ser/estar contrast with rica: family no es rica (wealthy) but comida está rica (delicious)',
      ],
    },
    culturalNotes: 'Nochebuena (Christmas Eve) is the major Christmas celebration in most Spanish-speaking cultures, with the main family meal at night. Christmas Day itself (el día de Navidad) is quieter.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // SER_ESTAR_CONTRAST — Noticing Hypothesis passages (8 items)
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
        'ser_estar_contrast',
        'ser_classification',
        'estar_emotional_state',
        'preterite_perfective',
        'imperfect_descriptive',
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
        'ser_estar_contrast',
        'ser_classification',
        'estar_physical_state',
        'estar_result_of_change',
        'preterite_perfective',
        'indirect_object_pronoun_preverbal',
        'direct_object_pronoun_preverbal',
        'gustar_construction',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['abuela', 'tío', 'listo', 'inteligente', 'brillantes', 'preparado', 'rica', 'dinero', 'comida', 'mole', 'diferencia'],
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
        'ser_estar_contrast',
        'ser_classification',
        'estar_physical_state',
        'estar_result_of_change',
        'preterite_perfective',
        'imperfect_descriptive',
        'preterite_imperfect_contrast',
        'direct_object_pronoun_preverbal',
        'indirect_object_pronoun_preverbal',
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

  {
    type: 'text',
    title: 'En el restaurante',
    difficultyLevel: '3.5',
    durationSeconds: 105,
    topic: 'Restaurantes y bodas',
    textContent: `El restaurante está en una calle tranquila del centro. Es un lugar pequeño pero famoso. La comida aquí es buena, pero el servicio a veces es lento. Hoy está lleno: hay una boda. Los meseros están corriendo de mesa en mesa. La novia está nerviosa pero feliz. Su padre, en cambio, está aburrido — odia las bodas. "Eres aburrido, papá", le dice ella riendo. "No soy aburrido", responde él, "estoy aburrido. Es diferente." Todos en la mesa se ríen. El padre tiene razón: la lengua marca esa distinción con cuidado.`,
    languageFeatures: {
      grammar: [
        'ser_estar_contrast',
        'ser_classification',
        'estar_location',
        'estar_progressive',
        'estar_result_of_change',
        'estar_emotional_state',
        'indirect_object_pronoun_preverbal',
        'gender_agreement',
        'definite_articles',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['restaurante', 'tranquila', 'famoso', 'servicio', 'lleno', 'boda', 'meseros', 'novia', 'nerviosa', 'aburrido', 'distinción'],
        requiredVocabSize: 75,
      },
      structures: [
        'Aburrido meaning-shift in dialogue: eres aburrido (boring) vs estoy aburrido (bored)',
        'Estar progressive (corriendo) and result-of-change (lleno)',
        'Explicit meta-commentary by the character',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La carta de mi abuelo',
    difficultyLevel: '3.5',
    durationSeconds: 110,
    topic: 'Familia y memoria',
    textContent: `Ayer recibí una carta de mi abuelo. Es muy emocionante porque él casi nunca escribe. Mi abuelo es de un pueblo en Galicia, pero ahora vive en Buenos Aires. Tiene noventa y dos años. La carta era larga y estaba escrita a mano. Cuando la leí, estaba feliz pero también triste. Mi abuelo es una persona muy viva — siempre tiene energía y curiosidad. Pero la carta dice que está cansado últimamente. Una persona puede ser viva por carácter y estar cansada por edad: son dos cosas distintas. Le voy a llamar este fin de semana.`,
    languageFeatures: {
      grammar: [
        'ser_estar_contrast',
        'ser_classification',
        'ser_origin',
        'estar_emotional_state',
        'estar_physical_state',
        'estar_result_of_change',
        'preterite_perfective',
        'imperfect_descriptive',
        'direct_object_pronoun_preverbal',
        'future_informal_ir_a',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['carta', 'abuelo', 'emocionante', 'Galicia', 'mano', 'feliz', 'triste', 'viva', 'energía', 'curiosidad', 'cansado', 'edad'],
        requiredVocabSize: 85,
      },
      structures: [
        'Vivo meaning-shift: ser vivo (lively/sharp) vs estar vivo (alive) — here used with the lively sense',
        'Imperfect for descriptive backdrop, preterite for received-and-read events',
        'Future ir + a + infinitive',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La nueva profesora',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Educación y experiencia',
    textContent: `Tenemos una profesora nueva en la escuela. Es de Colombia. Es muy joven — solo tiene veinticinco años. Los primeros días estaba muy nerviosa, pero ahora está más tranquila. Es una persona muy paciente, lo cual es importante en este trabajo. Mi hermano dice que su clase es interesante, no aburrida como la del año pasado. "No es que el otro profesor fuera aburrido", explica mi hermano. "Es que estaba aburrido de enseñar después de cuarenta años. Hay una diferencia." Yo pienso que mi hermano está aprendiendo más que el español: está aprendiendo a observar el mundo con cuidado.`,
    languageFeatures: {
      grammar: [
        'ser_estar_contrast',
        'ser_profession',
        'ser_origin',
        'ser_classification',
        'estar_emotional_state',
        'estar_progressive',
        'preterite_perfective',
        'imperfect_descriptive',
        'gender_agreement',
        'definite_articles',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['profesora', 'Colombia', 'joven', 'nerviosa', 'tranquila', 'paciente', 'clase', 'interesante', 'aburrida', 'diferencia'],
        requiredVocabSize: 85,
      },
      structures: [
        'Aburrido meaning-shift across two passages: clase aburrida (boring class) vs profesor aburrido de enseñar (bored from teaching)',
        'Ser de for origin, ser as profession',
        'Estar progressive (está aprendiendo) and emotional state (estaba nerviosa)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El concierto',
    difficultyLevel: '3.5',
    durationSeconds: 105,
    topic: 'Música y emociones',
    textContent: `El concierto es esta noche, a las nueve. Es de jazz — mi tipo de música favorito. Estoy emocionado y un poco nervioso porque tengo entradas en primera fila. Mis amigos están viniendo de diferentes ciudades. La banda es muy famosa y su música está muy viva — no es jazz aburrido, es jazz que te hace bailar. Cuando algo está vivo así, los conciertos son experiencias inolvidables. Yo estoy listo: ropa elegante, cámara, y muchas ganas de escuchar buena música.`,
    languageFeatures: {
      grammar: [
        'ser_estar_contrast',
        'ser_time',
        'ser_classification',
        'estar_emotional_state',
        'estar_progressive',
        'estar_result_of_change',
        'gender_agreement',
        'definite_articles',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['concierto', 'jazz', 'favorito', 'emocionado', 'nervioso', 'entradas', 'fila', 'banda', 'famosa', 'viva', 'inolvidables'],
        requiredVocabSize: 75,
      },
      structures: [
        'Vivo meaning-shift: ser vivo (sharp) vs estar vivo (alive) — here música está viva (lively) vs aburrido contrast',
        'Listo meaning-shift in closing: estar listo (ready)',
        'Ser for time and classification',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El bus tarde',
    difficultyLevel: '4.0',
    durationSeconds: 130,
    topic: 'Mañanas y transporte',
    textContent: `Son las siete y media de la mañana. El bus de la escuela todavía no llega. Mi hijo Tomás ya está listo — uniforme puesto, mochila preparada, zapatos atados. Pero está aburrido esperando. "Mamá, ¿el chofer es lento o solo está lento hoy?", me pregunta. Es una buena pregunta para un niño de ocho años. Sé que el chofer es una persona muy puntual normalmente. Hoy debe estar pasando algo. A las siete cuarenta, el bus por fin llega. El chofer está disculpándose: "Lo siento — había mucho tráfico." Tomás sube y me dice adiós con la mano. Es listo: ya entendió la diferencia entre ser y estar con esta palabra también.`,
    languageFeatures: {
      grammar: [
        'ser_estar_contrast',
        'ser_time',
        'ser_classification',
        'estar_result_of_change',
        'estar_emotional_state',
        'estar_progressive',
        'indirect_object_pronoun_preverbal',
        'imperfect_descriptive',
        'preterite_perfective',
        'basic_questions',
        'gender_agreement',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['bus', 'escuela', 'uniforme', 'mochila', 'zapatos', 'aburrido', 'chofer', 'lento', 'puntual', 'tráfico', 'diferencia'],
        requiredVocabSize: 85,
      },
      structures: [
        'Listo meaning-shift twice: estar listo (ready, opening) vs ser listo (clever, closing)',
        'Lento explicit contrast: ser lento (trait) vs estar lento (state)',
        'Estar result-of-change with multiple participles (puesto, preparada, atados)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedSerEstarContent() {
  const coreCount = serEstarContent.filter(c => !c.languageFeatures!.grammar.includes('ser_estar_contrast')).length;
  const contrastCount = serEstarContent.filter(c => c.languageFeatures!.grammar.includes('ser_estar_contrast')).length;
  console.log('🌱 Seeding ser/estar exercise set (Stage 1 error pattern #1)...');
  console.log(`   ${coreCount} core sub-skill items (ser_*/estar_* coverage)`);
  console.log(`   ${contrastCount} ser_estar_contrast items (Noticing Hypothesis passages)`);
  console.log(`   ${serEstarContent.length} total items at difficulty 2.5–4.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(serEstarContent).returning();
    console.log(`✅ Seeded ${inserted.length} ser/estar content items.`);
    console.log('\n   Next: exercise sets for preterite/imperfect, object pronouns.');
  } catch (error) {
    console.error('❌ Failed to seed ser/estar content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedSerEstarContent();
