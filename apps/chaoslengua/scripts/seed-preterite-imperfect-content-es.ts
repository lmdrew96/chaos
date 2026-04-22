// scripts/seed-preterite-imperfect-content-es.ts
// ChaosLengua — preterite/imperfect exercise set (Stage 1 error pattern #2)
//
// 9 focused content items exposing the aspectual contrast English L1 learners
// predictably collapse. Six passages tagged preterite_vs_imperfect_aspect use
// narrative structure as the teaching vehicle (preterite for foregrounded
// events, imperfect for setting/description/habitual) per spanish-specific.md
// §4 — "Teach through narrative structure, not lists of trigger words."
// Three passages tagged preterite_imperfect_meaning_shift pair both aspectual
// meanings of saber/conocer/querer/poder/tener within a single passage with
// explicit meta-commentary.
//
// Difficulty: 2.5-4.5. Restricted to Stage 1 tense inventory (preterite,
// imperfect, present, future ir+a). No pluperfect, no subjunctive — those
// are Stage 2 features and their presence would contaminate difficulty
// ratings.
//
// Cross-linguistic note: Romanian has perfect compus + imperfect but the
// aspectual line falls differently. RO perfect compus covers more territory
// than ES preterite, often handling what ES expresses with imperfect in
// descriptive contexts. Pure EN L1 learners over-preterite under pressure;
// RO-exposed learners may over-use preterite for descriptions specifically.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const preteriteImperfectContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // PRETERITE_VS_IMPERFECT_ASPECT — Narrative structure (6 items)
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Cuando era niño',
    difficultyLevel: '2.5',
    durationSeconds: 90,
    topic: 'Memorias de infancia',
    textContent: `Cuando era niño, vivía en un pueblo cerca del mar. Todas las mañanas me levantaba muy temprano, antes que mis padres. Caminaba hasta la playa con mi perro Lito. Él era pequeño y muy alegre. Siempre corría delante de mí. En el verano, el agua estaba fría pero yo entraba igual. Mi madre me decía que eso no era bueno para la salud. Un día, sin embargo, algo cambió. Encontré una caracola enorme en la arena. Era azul y blanca, y a mí me pareció hermosa. La puse en mi bolsillo y corrí a casa. Mi madre dijo que era un tesoro. Todavía la tengo hoy.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'present_tense_ser',
        'present_tense_estar',
        'reflexive_verbs_es',
        'gustar_construction',
        'gender_agreement',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['niño', 'pueblo', 'playa', 'perro', 'alegre', 'caracola', 'arena', 'tesoro'],
        requiredVocabSize: 55,
      },
      structures: [
        'Imperfect for habitual childhood events',
        'Preterite punctuating the narrative with single events',
        'Mixed aspect within a single memory',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El día que conocí a mi esposa',
    difficultyLevel: '3.0',
    durationSeconds: 110,
    topic: 'Relaciones y recuerdos',
    textContent: `Conocí a mi esposa un jueves por la tarde en un café del centro. Ese día llovía mucho y las calles estaban mojadas. Yo estaba sentado en una mesa cerca de la ventana, tomando café. Ella entró con un paraguas negro. No encontraba una mesa libre. Me miró y preguntó si podía sentarse conmigo. Le dije que sí, claro. Hablamos de libros, de trabajo, de familia. Ella era arquitecta, yo era profesor. Teníamos muchos amigos en común. Después de dos horas, el sol ya brillaba otra vez. Cuando ella se fue, me di cuenta de que olvidé preguntarle su número. Pero yo sabía su nombre: Carmen. Una semana después, la vi otra vez. Y así empezó todo.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_imperfect_meaning_shift',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'reflexive_verbs_es',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['esposa', 'café', 'paraguas', 'arquitecta', 'profesor', 'amigos', 'número', 'nombre'],
        requiredVocabSize: 65,
      },
      structures: [
        'Event-background narrative structure',
        'Preterite conocer (met for first time) teased',
        'Imperfect saber (knew her name)',
        'Background weather/state in imperfect; plot in preterite',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Una tarde en el parque',
    difficultyLevel: '3.5',
    durationSeconds: 120,
    topic: 'Anécdotas urbanas',
    textContent: `Era una tarde de sábado en agosto. El parque estaba lleno de gente. Los niños jugaban cerca de la fuente. Dos señoras mayores conversaban en un banco. Un vendedor vendía helados debajo de un árbol. El sol caía entre las hojas y dibujaba figuras de luz en el suelo. Yo caminaba lentamente con mi cuaderno en la mano. Quería escribir, pero no tenía ideas. De repente, vi algo extraño. Un perro grande corrió hacia mí. Por un momento, tuve miedo. Pero el perro se detuvo a dos pasos y movió la cola. Su dueña se acercó corriendo. "Perdón, señor, es muy amigable", me dijo. Y era verdad: el perro puso la cabeza en mi rodilla y se quedó allí. Ese día no escribí nada. Pero encontré la inspiración para un cuento sobre un perro.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'reflexive_verbs_es',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['tarde', 'parque', 'fuente', 'banco', 'vendedor', 'helados', 'cuaderno', 'inspiración', 'cuento'],
        requiredVocabSize: 75,
      },
      structures: [
        'Descriptive scene in imperfect (setting)',
        'Interrupting event in preterite (inciting incident)',
        'Return to preterite for resolution',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Mi abuela cocinaba',
    difficultyLevel: '3.5',
    durationSeconds: 120,
    topic: 'Tradiciones familiares',
    textContent: `Mi abuela cocinaba para toda la familia los domingos. Se levantaba a las seis de la mañana y empezaba a preparar la comida. Hacía sopa, pollo asado, arroz, y siempre un postre. El olor llenaba toda la casa. Mis primos y yo corríamos por el jardín mientras ella trabajaba. A veces mi abuelo nos llamaba y nos sentábamos con él a jugar a las cartas. Recuerdo un domingo particular. Yo tenía ocho años. Mi abuela me pidió ayuda por primera vez. "Ven, mi niña, vamos a hacer flan juntas." Fuimos a la cocina. Ella me enseñó a batir los huevos y a medir el azúcar. Cuando terminamos, el flan estaba perfecto. Todos dijeron que era el mejor flan del mundo.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'reflexive_verbs_es',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['abuela', 'domingos', 'sopa', 'pollo', 'arroz', 'postre', 'primos', 'flan', 'huevos', 'azúcar'],
        requiredVocabSize: 80,
      },
      structures: [
        'Habitual imperfect (routine Sundays)',
        'Pivot to specific memory via "un domingo particular"',
        'Preterite sequence for the memorable event',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La historia del accidente',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Narrativa familiar',
    textContent: `Mi hermana trabajaba como enfermera en un hospital de Buenos Aires cuando ocurrió el accidente. Era noviembre. Hacía mucho calor ese día, y las calles estaban llenas de gente que iba de compras. Mi hermana tenía turno de noche. Mientras ella se preparaba para salir de casa, yo dormía en el sofá. De repente sonó el teléfono. Era un policía. Me dijo que mi madre tuvo un accidente en su auto esa misma tarde. Salté del sofá. Mi hermana ya no estaba en casa: salió unos minutos antes. Llamé a mi hermano y los dos fuimos al hospital. Cuando llegamos, mi madre estaba bien. Tenía un brazo roto y algunos moretones, pero no era grave. Mi hermana apareció en la sala de espera. Estaba pálida. Ella no sabía que era nuestra madre hasta ese momento.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_imperfect_meaning_shift',
        'preterite_formation',
        'imperfect_formation',
        'reflexive_verbs_es',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['hermana', 'enfermera', 'hospital', 'accidente', 'noviembre', 'turno', 'policía', 'brazo', 'moretones', 'pálida'],
        requiredVocabSize: 95,
      },
      structures: [
        'Multiple simultaneous ongoing actions in imperfect',
        'Preterite punctuation: phone rang, she left, they went',
        'Tuvo (got/received accident) — tener meaning-shift teaser',
        'Sabía (didn\'t know) — saber meaning-shift teaser',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Mi cumpleaños número dieciocho',
    difficultyLevel: '4.5',
    durationSeconds: 160,
    topic: 'Transiciones y madurez',
    textContent: `Recuerdo muy bien el día que cumplí dieciocho años. Fue un martes de octubre. Esa mañana me desperté más temprano que de costumbre. No podía dormir. La luz entraba por la ventana y afuera se escuchaba el ruido de los pájaros. Mi madre ya estaba en la cocina preparando el desayuno. Ella sabía que yo no quería una fiesta grande. Invitó solo a unos pocos amigos. Durante todo el día, recibí llamadas y mensajes. Mi hermana mayor, que vivía en Madrid, me llamó por la tarde. Hablamos casi una hora. Ella me dijo algo que nunca voy a olvidar: "Ser adulto no es una cosa que pasa en un día. Es una cosa que aprendes durante muchos años." Yo no entendí bien en ese momento. Ahora, años después, sí entiendo. Esa noche, mis amigos llegaron con una tarta casera. Encendimos las velas. Yo soplé y pedí un deseo. El deseo no se cumplió como yo esperaba, pero creo que fue mejor así.`,
    languageFeatures: {
      grammar: [
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'future_ir_a',
        'reflexive_verbs_es',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['cumpleaños', 'dieciocho', 'martes', 'pájaros', 'desayuno', 'mensajes', 'tarta', 'velas', 'deseo'],
        requiredVocabSize: 95,
      },
      structures: [
        'Extended narrative with aspect shifts',
        'Imperfect for emotional states and backgrounds',
        'Preterite for plot-advancing events',
        'Meta-reflection in present tense (framing device)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // PRETERITE_IMPERFECT_MEANING_SHIFT — Noticing Hypothesis passages (3 items)
  // saber / conocer / querer / poder / tener pairs within a single passage
  // with explicit meta-commentary.
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Ya lo sabía',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Relaciones y verdad',
    textContent: `Ayer supe algo que cambió mi opinión sobre mi mejor amiga Laura. Mi hermana me llamó a las ocho de la noche. "Tengo que decirte algo sobre Laura", me dijo. Después de escucharla, me quedé en silencio. No podía creerlo. La verdad es que, en el fondo, yo ya sabía. Sabía hace meses que algo no estaba bien. Pero no quería aceptarlo. Hay una diferencia entre saber y saber: una cosa es tener una sospecha, otra cosa es tener una confirmación. Yo sabía desde hace tiempo. Ayer, por fin, supe de verdad. Hoy ya no estoy enojada. Estoy triste, pero también estoy tranquila. Hay momentos en que es mejor saber, aunque duela. Ese conocimiento me da libertad.`,
    languageFeatures: {
      grammar: [
        'preterite_imperfect_meaning_shift',
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['opinión', 'silencio', 'sospecha', 'confirmación', 'enojada', 'tranquila', 'libertad'],
        requiredVocabSize: 85,
      },
      structures: [
        'Saber meaning-shift: sabía (had known) vs supe (found out)',
        'Explicit meta-commentary: "Yo sabía desde hace tiempo. Ayer, por fin, supe de verdad."',
        'Emotional reflection alongside temporal narrative',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Conocer y conocer',
    difficultyLevel: '4.0',
    durationSeconds: 145,
    topic: 'Viajes y cultura',
    textContent: `Antes de mi viaje a Sevilla, yo no conocía España. Conocía la literatura y la historia, pero no conocía el país de verdad. En Sevilla conocí a Manuel, un estudiante de flamenco. Conocí a su familia una semana después. Conocía a mucha gente ya — tenía amigos de todo el mundo — pero conocer a los padres de Manuel fue diferente. Ellos eran muy amables.

Un día, Manuel me invitó a una fiesta. Yo no quería ir porque estaba cansada del viaje. Pero él insistió tanto que quise ir solo por él. Es curioso: cuando dices "yo quería ir", significa que tenías la intención pero quizás no fuiste. Cuando dices "yo quise ir", significa que hiciste el esfuerzo. Esa noche en la fiesta conocí algo de Sevilla: la alegría de la gente cuando canta junta. Eso no está en ningún libro.`,
    languageFeatures: {
      grammar: [
        'preterite_imperfect_meaning_shift',
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['viaje', 'Sevilla', 'literatura', 'historia', 'flamenco', 'familia', 'amables', 'alegría'],
        requiredVocabSize: 90,
      },
      structures: [
        'Conocer meaning-shift: conocía (was acquainted) vs conocí (met for first time)',
        'Querer meaning-shift: quería (wanted) vs quise (tried/decided to)',
        'Explicit meta-commentary on both pairs',
      ],
    },
    culturalNotes: 'Sevilla\'s flamenco tradition includes peñas flamencas — small gatherings where musicians, singers, and dancers perform informally. Participation often includes spontaneous group singing.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'No pude hacerlo',
    difficultyLevel: '4.0',
    durationSeconds: 145,
    topic: 'Perseverancia y logros',
    textContent: `La primera vez que quise correr una maratón, no pude. Tenía veinte años y estaba en forma, pero el día de la carrera me enfermé. Era el peor momento posible. No pude correr ni siquiera cinco kilómetros. Lo intenté, pero mi cuerpo no respondía.

Al año siguiente, tuve otra oportunidad. Esta vez sí pude terminar. Tres horas y diez minutos. Cuando crucé la meta, no podía creer lo que logré.

Hay una diferencia importante: cuando yo "podía" correr, era una habilidad general que tenía. Cuando yo "pude" correr, era un logro específico, en un momento específico. Y cuando "no pude" — bueno, eso no significa que nunca tuve la capacidad. Significa que esa vez, por esa razón específica, no funcionó. Yo tenía la fuerza de joven, pero ese día en particular, tuve una gripe. Son tiempos diferentes para realidades diferentes.`,
    languageFeatures: {
      grammar: [
        'preterite_imperfect_meaning_shift',
        'preterite_vs_imperfect_aspect',
        'preterite_formation',
        'imperfect_formation',
        'direct_object_pronouns',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['maratón', 'carrera', 'kilómetros', 'oportunidad', 'meta', 'habilidad', 'logro', 'capacidad', 'gripe'],
        requiredVocabSize: 90,
      },
      structures: [
        'Poder meaning-shift: podía (could, general ability) vs pude (managed to) vs no pude (failed to)',
        'Tener meaning-shift: tenía (had, state) vs tuve (got/received)',
        'Querer meaning-shift: quise (tried to) recurring',
        'Explicit meta-commentary unpacking all three verbs',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedPreteriteImperfectContent() {
  console.log('🌱 Seeding preterite/imperfect exercise set (Stage 1 error pattern #2)...');
  console.log(`   6 preterite_vs_imperfect_aspect items (narrative structure)`);
  console.log(`   3 preterite_imperfect_meaning_shift items (Noticing Hypothesis)`);
  console.log(`   ${preteriteImperfectContent.length} total items at difficulty 2.5–4.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(preteriteImperfectContent).returning();
    console.log(`✅ Seeded ${inserted.length} preterite/imperfect content items.`);
  } catch (error) {
    console.error('❌ Failed to seed preterite/imperfect content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedPreteriteImperfectContent();
