// scripts/seed-false-cognates-es.ts
// ChaosLengua — false cognate exercise set (vocab pattern #1)
//
// 9 content items targeting Spanish-English false cognates ("falsos amigos").
// Classified as "Yes — iconic" L1 interference in the Error Garden taxonomy
// with bridge key vocab_false_cognates. EN L1 learners reliably over-trust
// Spanish-looking words — these items use Schmidt (1990) Noticing Hypothesis
// by placing false cognates in context where the EN meaning would produce
// obvious absurdity, then offering the correct interpretation.
//
// Distribution:
//   Block A (2.5) — high-frequency, single-word confusions:
//     embarazada (pregnant, NOT embarrassed) / embarazoso (IS embarrassing)
//     éxito (success, NOT exit) / actual (current, NOT actual)
//     sensible (sensitive, NOT sensible) / simpático (friendly, NOT sympathetic)
//   Block B (3.0) — in-context confusion with fuller narrative:
//     asistir a (attend, NOT assist) / contestar (answer, NOT contest)
//     librería (bookstore, NOT library)
//     largo (long, NOT large) / grande (big, NOT great/large)
//   Block C (3.5-4.0) — complex narrative with denser false cognate load:
//     realizar (accomplish, NOT realize) / pretender (intend, NOT pretend)
//     molestar (bother, NOT molest) / soportar (tolerate, NOT support)
//     review passage: carpeta (folder) + gracioso (funny) + callbacks
//
// Difficulty: 2.5–4.0. Higher difficulty = more false cognates per passage
// + more complex surrounding grammar.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const falseCognateContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // BLOCK A (2.5) — High-frequency, single-word confusions
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: '¡Qué embarazoso!',
    difficultyLevel: '2.5',
    durationSeconds: 105,
    topic: 'Situaciones sociales y falsos cognados',
    textContent: `Mi amiga Diana está embarazada. Tiene siete meses de embarazo. Ayer, en la oficina, yo quería anunciar la noticia. Le dije a mi colega en voz muy alta, delante de todos: "¡Diana está embarazada!"

Diana me miró con cara de sorpresa. Fue muy embarazoso para mí. ¡Pero un momento! "Embarazoso" sí significa lo mismo que "embarrassing" en inglés. Lo que cambió fue la situación.

Recuerda: "embarazada" significa "pregnant". "Embarrassed" en español es "avergonzado" o "avergonzada". Y "embarazoso" significa "embarrassing" o "awkward". Son palabras similares con significados muy diferentes.`,
    languageFeatures: {
      grammar: [
        'present_tense_estar',
        'preterite_perfective',
        'imperfect_descriptive',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['embarazada', 'embarazoso', 'embarazo', 'avergonzado', 'anunciar', 'noticia', 'colega', 'sorpresa'],
        requiredVocabSize: 60,
      },
      structures: [
        'FALSE COGNATE: embarazada = pregnant (NOT embarrassed)',
        'TRUE COGNATE: embarazoso = embarrassing (correct mapping)',
        'CORRECT FORM: embarrassed = avergonzado/a',
        'Minimal triad (embarazada/embarazoso/avergonzado) contrasted in one passage',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El éxito de la empresa',
    difficultyLevel: '2.5',
    durationSeconds: 95,
    topic: 'Trabajo y noticias del día',
    textContent: `La empresa donde trabajo tiene mucho éxito. El director habló sobre la situación actual de la compañía. "En el contexto actual, nuestros resultados son excelentes", dijo.

En inglés, "exit" significa "salida". Pero en español, "éxito" significa "success". La salida del edificio se llama "salida", no "éxito".

Y "actual" en español no significa "actual" en inglés. "Actual" en español significa "current" o "present-day". Para decir "actual" en inglés, usamos "real" o "verdadero".

El éxito actual de la empresa es real. Eso sí es verdadero.`,
    languageFeatures: {
      grammar: [
        'present_tense_ser',
        'present_tense_tener',
        'preterite_perfective',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['éxito', 'empresa', 'actual', 'director', 'situación', 'resultados', 'salida', 'verdadero'],
        requiredVocabSize: 60,
      },
      structures: [
        'FALSE COGNATE: éxito = success (NOT exit); exit = salida',
        'FALSE COGNATE: actual = current/present-day (NOT actual/real); actual = real/verdadero',
        'Meta-commentary embedded in business context',
        'Final sentence uses both correct words naturally for reinforcement',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Una persona sensible',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Personalidad y relaciones humanas',
    textContent: `Mi prima Laura es muy sensible. Cuando escucha una historia triste, llora. Cuando alguien tiene un problema, lo siente profundamente. Es una persona muy empática.

En inglés, "sensible" significa "razonable" o "con sentido común". No significa "sensitive". Para "sensible" en inglés, en español decimos "sensato" o "razonable". Laura no siempre es sensata — es sensible.

Laura también es muy simpática. La palabra "simpático" no significa "sympathetic". "Sympathetic" en español es "comprensivo" o "empático". "Simpático" significa "friendly", "nice", "likeable".

Laura es sensible, simpática y también muy sensata cuando es necesario.`,
    languageFeatures: {
      grammar: [
        'present_tense_ser',
        'present_tense_estar',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['sensible', 'sensato', 'simpático', 'comprensivo', 'empático', 'razonable', 'profundamente'],
        requiredVocabSize: 65,
      },
      structures: [
        'FALSE COGNATE: sensible = sensitive (NOT sensible/reasonable); sensible = sensato/razonable',
        'FALSE COGNATE: simpático = friendly/nice (NOT sympathetic); sympathetic = comprensivo/empático',
        'Both words contrasted using the same person as the example',
        'Final sentence uses all three words correctly — active reinforcement',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // BLOCK B (3.0) — In-context confusion with fuller narrative
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'La reunión de trabajo',
    difficultyLevel: '3.0',
    durationSeconds: 115,
    topic: 'Trabajo y comunicación profesional',
    textContent: `Ayer asistí a una reunión importante. "Asistir a" en español no significa "to assist" — significa "to attend". Si quieres decir "I assisted my boss", en español dices "ayudé a mi jefe".

En la reunión, el gerente hizo una pregunta difícil. Le contesté con calma. "Contestar" no significa "to contest" — significa "to answer". Para "contest" en español usamos "impugnar" o "cuestionar".

La reunión fue larga pero productiva. Al final, todos nos fuimos contentos. Mi colega me preguntó: "¿Asistirás mañana también?" "Sí", le contesté. Y esta vez supe exactamente lo que decía.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'future_informal_ir_a',
        'indirect_object_pronoun_preverbal',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['asistir', 'reunión', 'ayudé', 'gerente', 'contestar', 'impugnar', 'cuestionar', 'productiva'],
        requiredVocabSize: 70,
      },
      structures: [
        'FALSE COGNATE: asistir a = to attend (NOT to assist); assist = ayudar',
        'FALSE COGNATE: contestar = to answer (NOT to contest); contest = impugnar/cuestionar',
        'Narrative: professional context where both false cognates arise naturally',
        'Final paragraph uses both verbs correctly in dialogue',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Buscando el libro',
    difficultyLevel: '3.0',
    durationSeconds: 110,
    topic: 'Cultura, lectura y ciudad',
    textContent: `Quería comprar un libro de poesía. Fui a la librería de mi barrio, pero no lo encontré. La señora me dijo: "Ese libro no lo tenemos. Prueba en la biblioteca."

Importante: una "librería" es una bookstore, no una library. La "biblioteca" es una library. En inglés, "library" y "librería" parecen similares, pero son lugares muy diferentes.

Fui a la biblioteca. Allí no se compran libros — se prestan. Pedí el libro prestado por tres semanas. Fue perfecto. Leer en la biblioteca es tranquilo.

Si quieres comprar el libro, vas a la librería. Si quieres leerlo gratis, vas a la biblioteca.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'direct_object_pronoun_preverbal',
        'reflexive_verbs_es',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['librería', 'biblioteca', 'poesía', 'prestado', 'gratis', 'barrio', 'prestan', 'tranquilo'],
        requiredVocabSize: 70,
      },
      structures: [
        'FALSE COGNATE: librería = bookstore (NOT library); library = biblioteca',
        'Narrative: character makes the error → arrives at wrong place → corrected',
        'Summary rule at end: explicit reinforcement after noticing moment',
        'Preterite throughout — cross-feature exposure',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Un viaje muy largo',
    difficultyLevel: '3.0',
    durationSeconds: 115,
    topic: 'Viajes y vacaciones',
    textContent: `El mes pasado hice un viaje muy largo. Viajé de Buenos Aires a Bogotá. El vuelo duró once horas.

"Largo" en español no significa "large". Significa "long". Un viaje largo es a long trip. Un objeto largo es a long object. Para "large" usamos "grande" o "gran".

Mi maleta era grande, no larga. Era un vuelo largo con una maleta grande. También el avión era grande — un avión enorme. El pasillo era largo y estrecho.

En el hotel, la cama era larga y cómoda. Mi habitación era grande. A veces confundimos "largo" y "large" porque parecen similares. Pero ahora lo sé: largo es long, grande es large.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'ser_estar_contrast',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['largo', 'grande', 'viaje', 'vuelo', 'maleta', 'enorme', 'pasillo', 'estrecho', 'cama'],
        requiredVocabSize: 70,
      },
      structures: [
        'FALSE COGNATE: largo = long (NOT large); large = grande/gran',
        'Minimal pair in same sentence: vuelo largo / maleta grande',
        'Repeated contrast across passage for reinforcement through noticing',
        'Final sentence is learner self-correction — completing the noticing arc',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // BLOCK C (3.5-4.0) — Dense false cognate load in complex narratives
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'El proyecto que no salió bien',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Trabajo, arte y expectativas',
    textContent: `Quería realizar un proyecto de arte muy ambicioso. "Realizar" en español significa "to carry out", "to accomplish" o "to make happen". No significa "to realize" en el sentido de "darse cuenta de algo". Para eso usamos "darse cuenta de" o "comprender".

Pretendía terminarlo en un mes. "Pretender" en español no significa "to pretend". Significa "to try to" o "to intend to". Para "pretend" usamos "fingir" o "hacer como si".

Al final no pude realizarlo todo. Me di cuenta de que era demasiado ambicioso. Pero pretendo intentarlo de nuevo el próximo año. No voy a fingir que no fue difícil — sí lo fue.

Realizar es accomplish. Darse cuenta es realize. Pretender es intend/try to. Fingir es pretend.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'future_informal_ir_a',
        'reflexive_verbs_es',
        'direct_object_pronoun_preverbal',
      ],
      vocabulary: {
        keywords: ['realizar', 'pretender', 'darse cuenta', 'fingir', 'proyecto', 'ambicioso', 'comprender', 'accomplir'],
        requiredVocabSize: 80,
      },
      structures: [
        'FALSE COGNATE: realizar = to carry out/accomplish (NOT to realize); realize = darse cuenta de',
        'FALSE COGNATE: pretender = to intend/try to (NOT to pretend); pretend = fingir',
        'Both false cognates and their correct equivalents used naturally in same passage',
        'Final summary line packs all four forms for explicit memorization',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Los vecinos del tercero',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Convivencia urbana y relaciones vecinales',
    textContent: `Mis vecinos del tercer piso hacen mucho ruido. No soporto el ruido tarde por la noche. "Soportar" en español no significa "to support". Significa "to tolerate" o "to stand/bear". Para "support" usamos "apoyar" o "sostener".

Un día decidí hablar con ellos. Toqué a su puerta. "No quiero molestar", les dije, "pero el ruido es un problema." "Molestar" no significa "to molest" — significa "to bother" o "to disturb". Para "molest" en el sentido legal, usamos "acosar" o "agredir".

Mis vecinos fueron muy simpáticos. Me dijeron que lo sentían. Me apoyaron cuando pedí silencio. Ahora soporto vivir en el edificio con calma. Porque el silencio, cuando por fin llega, es perfecto.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'direct_object_pronoun_preverbal',
        'indirect_object_pronoun_preverbal',
        'reflexive_verbs_es',
      ],
      vocabulary: {
        keywords: ['soportar', 'apoyar', 'molestar', 'acosar', 'vecinos', 'ruido', 'piso', 'silencio', 'edificio'],
        requiredVocabSize: 80,
      },
      structures: [
        'FALSE COGNATE: soportar = to tolerate/stand/bear (NOT to support); support = apoyar/sostener',
        'FALSE COGNATE: molestar = to bother/disturb (NOT to molest); molest = acosar/agredir',
        'High-stakes false cognate note: "no te molestes" means "don\'t bother" — not a threat',
        'Correct forms (apoyar, acosar) then appear naturally at end',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El primer día en la oficina',
    difficultyLevel: '4.0',
    durationSeconds: 150,
    topic: 'Trabajo y adaptación cultural',
    textContent: `Mi primer día en la nueva oficina fue interesante. Necesitaba una carpeta para mis documentos. "Carpeta" en español es "folder", no "carpet". La "alfombra" es el carpet. Busqué una carpeta por todas partes y al final la encontré.

Mi colega Rodrigo es muy gracioso. Me hizo reír varias veces. "Gracioso" no significa "gracious". Significa "funny" o "amusing". "Gracious" en español sería "cortés" o "generoso".

Durante el día, realicé varias tareas. Asistí a dos reuniones. Contesté muchos correos. No soporté el café de la oficina — era horrible. Molestó un poco, pero lo superé.

Al final del día, me di cuenta de que este trabajo es bueno. Pretendo quedarme mucho tiempo.`,
    languageFeatures: {
      grammar: [
        'preterite_perfective',
        'imperfect_descriptive',
        'direct_object_pronoun_preverbal',
        'reflexive_verbs_es',
        'indefinite_articles',
      ],
      vocabulary: {
        keywords: ['carpeta', 'alfombra', 'gracioso', 'cortés', 'realizar', 'asistir', 'contestar', 'soportar', 'molestar', 'pretender'],
        requiredVocabSize: 95,
      },
      structures: [
        'FALSE COGNATE: carpeta = folder (NOT carpet); carpet = alfombra',
        'FALSE COGNATE: gracioso = funny/amusing (NOT gracious); gracious = cortés/generoso',
        'Review passage: realizar, asistir, contestar, soportar, molestar, pretender all appear in final paragraph',
        'Dense callback to all prior false cognates — spaced retrieval within the set',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedFalseCognateContent() {
  console.log('🌱 Seeding false cognate exercise set (vocab pattern #1)...');
  console.log('   3 Block A items (2.5): embarazada, éxito/actual, sensible/simpático');
  console.log('   3 Block B items (3.0): asistir/contestar, librería, largo/grande');
  console.log('   3 Block C items (3.5–4.0): realizar/pretender, molestar/soportar, mixed review');
  console.log(`   ${falseCognateContent.length} total items at difficulty 2.5–4.0\n`);

  try {
    const inserted = await db.insert(contentItems).values(falseCognateContent).returning();
    console.log(`✅ Seeded ${inserted.length} false cognate content items.`);
  } catch (error) {
    console.error('❌ Failed to seed false cognate content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedFalseCognateContent();
