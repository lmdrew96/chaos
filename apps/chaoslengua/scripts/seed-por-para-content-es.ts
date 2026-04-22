// scripts/seed-por-para-content-es.ts
// ChaosLengua — por/para exercise set (Stage 1 error pattern #3)
//
// 9 focused content items exposing the por/para contrast that English L1
// learners predictably collapse (EN "for" covers both). Per
// spanish-specific.md §7: "Unlike many features where implicit exposure
// suffices, por/para reliably requires explicit semantic-feature instruction."
// So three of the nine passages include explicit minimal-pair contrasts
// with meta-commentary (Schmidt noticing).
//
// All items tagged por_vs_para (maps to feature key por_vs_para_intro).
// Stage 1 introduces para first (narrower semantic field) then por.
//
// Difficulty: 2.5-4.5.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const porParaContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // PARA-FOCUSED (narrower semantic field — teach first)
  // purpose, destination, recipient, deadline, opinion
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'El viaje a México',
    difficultyLevel: '2.5',
    durationSeconds: 80,
    topic: 'Viajes y familia',
    textContent: `Mañana salgo para el aeropuerto a las seis de la mañana. Tengo un boleto para Ciudad de México. Este viaje es especial: es para ver a mi abuela. Ella tiene ochenta y cinco años y vive sola. Compré unas flores para ella en el mercado. También tengo un libro para mi primo Diego — es un regalo para su cumpleaños. Para mí, la familia es lo más importante. Necesito llegar temprano porque mi abuela me espera para cenar.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'present_tense_regular_ar',
        'present_tense_stem_change',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'gender_agreement',
        'preterite_formation',
      ],
      vocabulary: {
        keywords: ['aeropuerto', 'boleto', 'abuela', 'flores', 'mercado', 'primo', 'regalo', 'cumpleaños', 'familia'],
        requiredVocabSize: 55,
      },
      structures: [
        'Para for destination (para el aeropuerto, para Ciudad de México)',
        'Para for purpose (para ver, para cenar)',
        'Para for recipient (para ella, para mi primo)',
        'Para for opinion (Para mí)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La tarea de historia',
    difficultyLevel: '3.0',
    durationSeconds: 100,
    topic: 'Vida estudiantil',
    textContent: `Mi profesora nos dio una tarea para el lunes. Tenemos que escribir un ensayo de tres páginas para la clase de historia. Para mí, escribir no es difícil — me gusta mucho. Pero algunos de mis compañeros prefieren otras materias. Para Lucía, las matemáticas son más fáciles. Para Roberto, el arte es su pasión. Yo compré un libro especial para mi ensayo ayer. Quería terminar todo antes del fin de semana, para no estar estresada el domingo. Es importante terminar el trabajo a tiempo para tener tiempo libre después.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'gustar_construction',
        'ser_vs_estar_core',
        'gender_agreement',
        'comparisons',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['profesora', 'tarea', 'ensayo', 'páginas', 'historia', 'compañeros', 'matemáticas', 'arte', 'pasión', 'estresada'],
        requiredVocabSize: 75,
      },
      structures: [
        'Para for deadline (para el lunes)',
        'Para for opinion (Para mí, Para Lucía, Para Roberto)',
        'Para for purpose (para no estar estresada, para tener tiempo libre)',
        'Para for recipient/target (para la clase de historia)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Estudiar medicina',
    difficultyLevel: '3.5',
    durationSeconds: 120,
    topic: 'Profesión y vocación',
    textContent: `Decidí estudiar medicina para ayudar a personas. Para mí, era una vocación clara desde niña. Mis padres no entendieron al principio. Para ellos, la medicina era una carrera muy larga y difícil. "Para ser médica, hay que sacrificar mucho", me decía mi madre. Pero yo estaba determinada. Trabajé cinco años para pagar la universidad. Estudié de noche para tener tiempo para el trabajo durante el día. Ahora, después de terminar, veo que mis padres tenían razón sobre el sacrificio. Pero también tenía razón yo sobre la vocación. Para una persona con pasión, cualquier sacrificio vale la pena.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['medicina', 'vocación', 'carrera', 'sacrificar', 'universidad', 'pasión'],
        requiredVocabSize: 80,
      },
      structures: [
        'Para for purpose clauses (para ayudar, para pagar, para tener tiempo)',
        'Para for opinion stacking (Para mí, Para ellos)',
        'Para ser + infinitive (purpose / in order to be)',
        'Para una persona con X (generic recipient / opinion)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // POR-FOCUSED (broader semantic field — six major subcategories)
  // cause, exchange, duration, means, path, agent
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Un día de lluvia',
    difficultyLevel: '3.0',
    durationSeconds: 110,
    topic: 'Vida cotidiana',
    textContent: `Ayer estuve en casa todo el día por la lluvia. No pude salir. Por la ventana, vi que el jardín estaba inundado. Empecé a preocuparme por mis plantas. Llamé por teléfono a mi hermana. Ella vive por el centro, donde llueve menos. Hablamos por media hora. Ella me dijo que compró sus plantas nuevas por quince euros cada una. "Valen la pena por la alegría que dan", me dijo. Pasé la tarde por la casa, limpiando y pensando. Por la noche, cuando por fin paró de llover, salí al jardín. Mis plantas estaban bien — gracias por preocuparme por nada.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['lluvia', 'ventana', 'jardín', 'inundado', 'plantas', 'teléfono', 'centro', 'alegría'],
        requiredVocabSize: 75,
      },
      structures: [
        'Por for cause (por la lluvia, por la alegría, gracias por)',
        'Por for means (por teléfono)',
        'Por for path/through (por la ventana, por el centro, por la casa)',
        'Por for duration (por media hora)',
        'Por for price (por quince euros)',
        'Por for time-of-day (Por la noche)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El viaje de mi primo',
    difficultyLevel: '3.5',
    durationSeconds: 125,
    topic: 'Viajes y cultura',
    textContent: `Ayer por la mañana, un mensaje llegó por correo electrónico. Era de mi primo que estudia en el extranjero. Me contaba sobre un viaje que hizo por España. Viajó en tren por muchas ciudades: Madrid, Barcelona, Sevilla, Granada. Pasó por varios pueblos también. En Granada visitó la Alhambra, un monumento famoso construido por los árabes en el siglo XIII. Mi primo me envió fotos por WhatsApp. Una foto especial fue tomada por una amiga suya en el Patio de los Leones. Es un lugar mágico, según él. Por el río Darro, pasaron dos horas caminando. Yo quiero hacer ese viaje también algún día. Por ahora, tengo que trabajar.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'present_tense_ser',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['mensaje', 'correo', 'electrónico', 'extranjero', 'viaje', 'tren', 'ciudades', 'Alhambra', 'monumento', 'mágico'],
        requiredVocabSize: 85,
      },
      structures: [
        'Por for means (por correo electrónico, por WhatsApp)',
        'Por for path/through (por España, por muchas ciudades, por varios pueblos, por el río)',
        'Por for agent (construido por los árabes, tomada por una amiga)',
        'Por for idiomatic time (por la mañana, por ahora)',
      ],
    },
    culturalNotes: 'The Alhambra in Granada is a Moorish palace complex built primarily in the 13th–14th centuries. The Patio de los Leones is its most iconic courtyard. The Darro river runs through the old city.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El abogado de mi padre',
    difficultyLevel: '4.0',
    durationSeconds: 145,
    topic: 'Justicia y valores',
    textContent: `Mi padre trabajaba como abogado. Una vez defendió a un hombre acusado injustamente por un robo que no cometió. El hombre no tenía dinero para pagar por un abogado. Mi padre lo defendió gratis — lo hizo por compasión, no por el dinero. El juicio duró tres semanas. Mi padre trabajó día y noche por la causa. Al final, el hombre fue declarado inocente por falta de pruebas. Nos dio las gracias llorando. "Usted lo hizo por mí cuando nadie más quiso. Nunca voy a poder pagarle por lo que hizo." Mi padre sonrió y le dijo: "Lo hice por justicia, no por compensación." Esa frase se quedó conmigo toda la vida. Hoy trabajo como abogada por las mismas razones.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'future_ir_a',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['abogado', 'acusado', 'robo', 'gratis', 'compasión', 'juicio', 'inocente', 'pruebas', 'justicia'],
        requiredVocabSize: 95,
      },
      structures: [
        'Por for cause/reason (por un robo, por compasión, por el dinero, por justicia, por falta de pruebas, por las mismas razones)',
        'Por for on-behalf-of (por la causa, por mí)',
        'Por for exchange (pagar por, pagarle por lo que hizo)',
        'Para for purpose (para pagar por un abogado)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // MINIMAL-PAIR CONTRAST — Explicit por/para noticing passages (3 items)
  // Per spanish-specific.md §7 — por/para reliably requires explicit
  // semantic-feature instruction. These passages pair both prepositions
  // with the same surface structure and include meta-commentary.
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Las flores de anoche',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Relaciones y lenguaje',
    textContent: `Anoche, después de la cena, mi esposo me trajo flores. "Son para ti", me dijo con una sonrisa. Las puse en un vaso cerca de la ventana. Pero luego le pregunté: "¿Por qué las compraste?" Él me miró raro. "Las compré por ti", me respondió. "Porque quería hacerte feliz."

Entonces pensé en la diferencia. Las flores eran para mí — yo era la destinataria del regalo. Pero él las compró por mí — yo era la razón, la causa de su acción. Una cosa es ser el destino de algo. Otra cosa es ser el motivo. A veces en español, estas dos ideas se separan en dos palabras. En inglés se dice "for" para las dos, y por eso, los estudiantes confunden siempre. Pero en español, por y para son dos historias diferentes.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['esposo', 'flores', 'sonrisa', 'vaso', 'ventana', 'destinataria', 'razón', 'causa', 'motivo', 'diferencia'],
        requiredVocabSize: 85,
      },
      structures: [
        'Minimal pair: para ti (recipient) vs por ti (cause/on-behalf-of)',
        'Explicit meta-commentary: "Una cosa es ser el destino de algo. Otra cosa es ser el motivo."',
        'Meta-reflection on EN "for" collapsing the distinction',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Trabajar por, trabajar para',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Trabajo y familia',
    textContent: `Mi tío Ernesto es carpintero. Trabaja para una empresa grande de muebles en Oaxaca. "Trabajo para ellos cinco días a la semana", nos cuenta. Pero los fines de semana, hace trabajos diferentes. "Esos los hago por mi hija", explica. Su hija tiene una discapacidad y necesita mucha atención médica. Ernesto usa ese dinero extra para pagar los doctores.

"Los lunes cuando voy a la fábrica, trabajo para el jefe. Trabajo para ganar un sueldo. Los sábados, cuando construyo una mesa en mi taller, trabajo por mi hija. Trabajo por amor, no por dinero." Esa distinción es importante: trabajar para alguien es tener un empleador. Trabajar por alguien es tener una razón. Mi tío hace las dos cosas, pero le importan por motivos muy diferentes.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'present_tense_ser',
        'present_tense_stem_change',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'gender_agreement',
        'definite_articles',
        'gustar_construction',
      ],
      vocabulary: {
        keywords: ['carpintero', 'empresa', 'muebles', 'Oaxaca', 'discapacidad', 'atención', 'fábrica', 'jefe', 'sueldo', 'taller'],
        requiredVocabSize: 90,
      },
      structures: [
        'Minimal pair: trabajar para alguien (employer) vs trabajar por alguien (on behalf of / cause)',
        'Para for purpose (para pagar, para ganar)',
        'Por for cause (por amor, por dinero, por motivos)',
        'Explicit meta-commentary: "trabajar para alguien es tener un empleador. Trabajar por alguien es tener una razón."',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Ir por, ir para',
    difficultyLevel: '4.0',
    durationSeconds: 135,
    topic: 'Vida familiar y lenguaje',
    textContent: `— Mamá, ¿dónde vas?
— Voy para el mercado. ¿Necesitas algo?
— Sí, ¿puedes traer un pan?
— Claro. Pero tu papá ya fue por el pan hace diez minutos.
— Ah, ¿sí? ¿A dónde fue exactamente?
— Fue a la panadería, pero también pasó por la ferretería. Se fue para comprar clavos.

Esa mañana, mi mamá me enseñó sin quererlo una lección de español. Cuando uno va "para" un lugar, el lugar es el destino. Cuando uno va "por" algo, el algo es el objetivo — lo que uno busca. Mi papá fue por el pan — iba a buscar el pan, a traerlo. Mi mamá iba para el mercado — el mercado era su destino. Y cuando ella pasó "por la ferretería", significa que atravesó ese lugar en su camino. "Por" y "para" son dos palabras pequeñas, pero llevan significados muy distintos.`,
    languageFeatures: {
      grammar: [
        'por_vs_para',
        'preterite_formation',
        'imperfect_formation',
        'future_ir_a',
        'reflexive_verbs_es',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'present_tense_stem_change',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['mercado', 'pan', 'panadería', 'ferretería', 'clavos', 'destino', 'objetivo', 'lección', 'significados'],
        requiredVocabSize: 85,
      },
      structures: [
        'Minimal triplet: ir para X (destination) vs ir por X (to fetch/obtain) vs pasar por X (through)',
        'Explicit meta-commentary on all three uses',
        'Dialogue framing makes the minimal pair salient',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedPorParaContent() {
  console.log('🌱 Seeding por/para exercise set (Stage 1 error pattern #3)...');
  console.log(`   3 para-focused items (purpose/destination/recipient/deadline/opinion)`);
  console.log(`   3 por-focused items (cause/exchange/duration/means/path/agent)`);
  console.log(`   3 minimal-pair contrast items (Schmidt noticing)`);
  console.log(`   ${porParaContent.length} total items at difficulty 2.5–4.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(porParaContent).returning();
    console.log(`✅ Seeded ${inserted.length} por/para content items.`);
  } catch (error) {
    console.error('❌ Failed to seed por/para content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedPorParaContent();
