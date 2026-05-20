// scripts/seed-a1-foundation-es.ts
// ChaosLengua — A1 foundation: estar, tener, -er/-ir verbs, indefinite articles
//
// 12 content items filling the A1 grammar gaps left after Stage 1 error-pattern
// seeding. These are the structural building blocks EN L1 learners encounter
// before ser/estar contrast becomes relevant: estar for states/location/progressive,
// tener for possession/age/idioms/obligation, -er/-ir verb conjugation, and
// indefinite article use (including profession omission and gender agreement).
//
// Distribution:
// - 3 items tagged present_tense_estar (location, states, progressive)
// - 3 items tagged present_tense_tener (possession/age, idioms, tener que)
// - 3 items tagged present_tense_regular_er_ir (-er, -ir, mixed)
// - 3 items tagged indefinite_articles (gender, profession omission, unos/unas)
//
// Difficulty: 1.5–2.5 (true A1 entry through A1/A2 boundary). Lower than
// existing scripts by design — these are first-contact items for new users.
//
// Dialectal baseline: LatAm-neutral. No vosotros, no voseo, seseo assumed.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const a1FoundationContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // PRESENT_TENSE_ESTAR (3 items) — location, states, progressive
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Mi habitación',
    difficultyLevel: '1.5',
    durationSeconds: 60,
    topic: 'Casa y objetos cotidianos',
    textContent: `Mi habitación es pequeña pero cómoda. La cama está al lado de la ventana. La mesa está en el centro. Mis libros están encima de la mesa. Mi mochila está debajo de la silla. La lámpara está a la derecha de la cama.

Cuando estoy en mi habitación, me siento tranquila. Mi gato también está aquí. Ahora está dormido en la cama. ¡Mi gato siempre está en mi cama!`,
    languageFeatures: {
      grammar: [
        'present_tense_estar',
        'gender_agreement',
        'definite_articles',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['habitación', 'cama', 'ventana', 'mesa', 'libros', 'mochila', 'silla', 'lámpara', 'gato'],
        requiredVocabSize: 30,
      },
      structures: [
        'Estar for physical location: está al lado de, está en el centro, están encima de, está debajo de',
        'Estar for personal presence: estoy en mi habitación',
        'Estar for resultant state: está dormido',
        'Preposition + estar location phrases throughout',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: '¿Cómo estás hoy?',
    difficultyLevel: '2.0',
    durationSeconds: 80,
    topic: 'Saludos y estados físicos y emocionales',
    textContent: `Hoy es lunes. Estoy cansado porque dormí poco. Mi amiga Rosa me pregunta: "¿Cómo estás?" "Estoy cansado y estoy un poco enfermo", le digo. "¡Pobrecito!", dice ella.

Mi compañero Daniel está contento hoy. Tiene un examen importante y está nervioso, pero también está emocionado. "Estoy listo", dice. Su examen empieza a las diez.

Nuestra profesora está ocupada. Siempre está ocupada los lunes. Pero cuando la saludo, siempre me pregunta cómo estoy. Eso me gusta mucho.`,
    languageFeatures: {
      grammar: [
        'present_tense_estar',
        'gender_agreement',
        'basic_questions',
        'basic_negation',
      ],
      vocabulary: {
        keywords: ['cansado', 'enfermo', 'contento', 'nervioso', 'emocionado', 'listo', 'ocupado', 'examen', 'lunes'],
        requiredVocabSize: 45,
      },
      structures: [
        'Estar for temporary physical/emotional states: cansado, enfermo, contento, nervioso, emocionado, listo, ocupado',
        'First vs third person contrast: estoy / está',
        'Question form ¿Cómo estás? — informal second person',
        'Frequency adverb + estar: siempre está ocupada los lunes',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Una tarde en casa',
    difficultyLevel: '2.5',
    durationSeconds: 95,
    topic: 'Vida familiar y actividades cotidianas',
    textContent: `Son las cinco de la tarde. Estoy en casa con mi familia. Mi madre está cocinando en la cocina. Está preparando sopa de tomate. Mi padre está leyendo el periódico en el sofá. Está muy concentrado.

Mi hermano pequeño está jugando videojuegos en su cuarto. Está ganando, creo. Mi hermana está hablando por teléfono con su amiga. Está riéndose mucho.

Yo estoy estudiando español. Estoy aprendiendo mucho. El español no es fácil, pero estoy progresando. Estoy muy contento con mis clases.`,
    languageFeatures: {
      grammar: [
        'present_tense_estar',
        'present_tense_ser',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['tarde', 'cocina', 'sopa', 'periódico', 'sofá', 'concentrado', 'videojuegos', 'teléfono', 'español'],
        requiredVocabSize: 55,
      },
      structures: [
        'Estar + gerund = progressive: está cocinando, está leyendo, está jugando, estoy estudiando',
        'All persons of estar progressive in one passage',
        'Contrast: ser for identity (el español no es fácil) vs estar for activity/state',
        'Intensifier muy with estar adjectives: está muy concentrado, estoy muy contento',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // PRESENT_TENSE_TENER (3 items) — possession/age, idioms, tener que
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Mi familia',
    difficultyLevel: '1.5',
    durationSeconds: 65,
    topic: 'Familia y descripciones personales',
    textContent: `Me llamo Valentina. Tengo veintidós años. Tengo una familia pequeña. Mi madre tiene cuarenta y ocho años. Mi padre tiene cincuenta años. Mi hermano tiene dieciséis años.

Mi madre tiene el pelo negro. Mi padre tiene los ojos azules. Mi hermano tiene el pelo largo. Yo tengo el pelo corto.

Mi familia tiene un perro. El perro tiene tres años. Se llama Pipo. También tenemos un apartamento pequeño en la ciudad.`,
    languageFeatures: {
      grammar: [
        'present_tense_tener',
        'gender_agreement',
        'indefinite_articles',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['familia', 'años', 'madre', 'padre', 'hermano', 'pelo', 'negro', 'ojos', 'azules', 'largo', 'corto', 'perro'],
        requiredVocabSize: 30,
      },
      structures: [
        'Tener for age: tengo veintidós años, tiene cuarenta y ocho años',
        'Tener for possession: tengo una familia, tiene el pelo negro',
        'Tener for physical characteristics: tiene los ojos azules, tiene el pelo largo',
        'Person contrast: tengo / tiene / tenemos',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Después del partido',
    difficultyLevel: '2.0',
    durationSeconds: 85,
    topic: 'Deportes y sensaciones físicas',
    textContent: `Hoy jugamos fútbol durante dos horas. Ahora tenemos mucha hambre y mucha sed. "Tengo hambre", dice mi amigo Carlos. "Yo también tengo mucha sed", digo yo.

Después del partido, tenemos frío porque está lloviendo. Carlos tiene prisa para llegar a casa. Yo también tengo prisa.

En el restaurante, Carlos tiene suerte: hay pizza. "¡Tengo mucha suerte!", dice. Pedimos dos pizzas grandes. Carlos tiene razón: la pizza de este lugar es deliciosa. Comemos todo porque tenemos mucha hambre. Ahora no tenemos hambre. Tenemos sueño.`,
    languageFeatures: {
      grammar: [
        'present_tense_tener',
        'present_tense_estar',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['partido', 'hambre', 'sed', 'frío', 'prisa', 'suerte', 'razón', 'sueño', 'pizza', 'restaurante'],
        requiredVocabSize: 50,
      },
      structures: [
        'Tener idioms: tener hambre, sed, frío, prisa, suerte, razón, sueño',
        'EN uses "to be" for these — I\'m hungry = tengo hambre (NOT estoy hambre)',
        'Gender-sensitive quantity: mucha hambre / mucha sed (feminine nouns)',
        'Idioms shift state through narrative: tenemos hambre → no tenemos hambre → tenemos sueño',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La lista de obligaciones',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Responsabilidades y obligaciones cotidianas',
    textContent: `Hoy tengo muchas cosas que hacer. Primero, tengo que ir al banco. Luego, tengo que comprar comida en el supermercado. También tengo que llamar a mi dentista para pedir una cita.

Mi hermana también tiene que estudiar hoy. Tiene un examen mañana y tiene que prepararse bien. "¿Tienes que trabajar también?", le pregunto. "Sí", dice ella. "Tengo que trabajar hasta las seis."

Al final del día, los dos tenemos que descansar. Tenemos que dormir bien para mañana. ¿Qué tienes que hacer tú hoy?`,
    languageFeatures: {
      grammar: [
        'present_tense_tener',
        'reflexive_verbs_es',
        'basic_questions',
        'future_informal_ir_a',
      ],
      vocabulary: {
        keywords: ['banco', 'supermercado', 'dentista', 'cita', 'examen', 'prepararse', 'descansar', 'obligaciones'],
        requiredVocabSize: 60,
      },
      structures: [
        'Tener que + infinitive = obligation ("have to / must")',
        'All persons: tengo que / tienes que / tiene que / tenemos que',
        'Tener que is the primary EN "have to" equivalent at A1 (deber de is B2+)',
        'Closing question invites learner production of the structure',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // PRESENT_TENSE_REGULAR_ER_IR (3 items) — -er, -ir, mixed
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'El desayuno',
    difficultyLevel: '1.5',
    durationSeconds: 60,
    topic: 'Comida y rutinas matutinas',
    textContent: `Cada mañana, mi familia come juntos. Mi madre bebe café con leche. Mi padre bebe jugo de naranja. Yo como tostadas con mantequilla. Mi hermano come cereal.

Después del desayuno, mi padre lee el periódico. Yo leo mis mensajes en el teléfono. Mi hermano ve la televisión un poco. Mi madre no lee y no ve la tele — ella prefiere escuchar música.

¿Qué comes tú por las mañanas?`,
    languageFeatures: {
      grammar: [
        'present_tense_regular_er_ir',
        'present_tense_ser',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['desayuno', 'café', 'leche', 'jugo', 'naranja', 'tostadas', 'mantequilla', 'cereal', 'periódico', 'tele'],
        requiredVocabSize: 30,
      },
      structures: [
        '-er verbs: comer (como/comes/come), beber (bebo/bebes/bebe), leer (leo/lees/lee)',
        '-er verb ver: irregular yo form veo (not veer)',
        '3sg and 1sg across all: come/como, bebe/bebo, lee/leo',
        'Regular -er paradigm: beber → bebo/bebes/bebe/bebemos/beben',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Mi apartamento nuevo',
    difficultyLevel: '2.0',
    durationSeconds: 85,
    topic: 'Vivienda y vida cotidiana',
    textContent: `Vivo en un apartamento nuevo desde el mes pasado. Es pequeño, pero me gusta. Todos los días, abro las ventanas para tener aire fresco. Por las mañanas, subo las escaleras porque el ascensor no funciona.

Mi vecina Isabel también vive en el edificio. Ella escribe novelas en casa. A veces abro su puerta y le digo hola. Vivimos en el mismo piso.

Cuando salgo de casa, siempre decido qué ropa ponerme. A veces mi amiga me escribe por teléfono: "¿A qué hora sales?" "Salgo a las ocho", le escribo. Vivir solo es diferente. Pero me gusta.`,
    languageFeatures: {
      grammar: [
        'present_tense_regular_er_ir',
        'present_tense_estar',
        'reflexive_verbs_es',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['apartamento', 'ventanas', 'aire', 'escaleras', 'ascensor', 'vecina', 'novelas', 'edificio', 'piso'],
        requiredVocabSize: 50,
      },
      structures: [
        '-ir verbs: vivir (vivo/vive/vivimos), abrir (abro/abres), subir (subo), escribir (escribe/escribo/escribes), decidir (decido)',
        'Irregular -ir yo forms: salir → salgo (not salo), decir → digo',
        '-ir paradigm: vivir → vivo/vives/vive/vivimos/viven',
        'Contrast: -er and -ir share the same 1sg -o ending (como/vivo)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Los fines de semana',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Tiempo libre y amigos',
    textContent: `Los fines de semana, mis amigos y yo salimos juntos. Normalmente comemos en algún restaurante del barrio. A veces bebemos café en una terraza. Mis amigos leen el menú despacio porque hay muchas opciones.

Mi amiga Camila siempre escribe mensajes antes de salir: "¿A qué hora llegamos?" Yo le respondo rápido. Su novio Francisco vive cerca y sube en cinco minutos. Cuando llegamos, abrimos la puerta del restaurante y buscamos mesa.

Después de comer, a veces vemos una película en casa de alguien. Comemos palomitas. Bebemos té. La semana siempre termina igual: bien.`,
    languageFeatures: {
      grammar: [
        'present_tense_regular_er_ir',
        'present_tense_estar',
        'reflexive_verbs_es',
        'future_informal_ir_a',
      ],
      vocabulary: {
        keywords: ['fines', 'semana', 'restaurante', 'barrio', 'terraza', 'menú', 'palomitas', 'película', 'opciones'],
        requiredVocabSize: 65,
      },
      structures: [
        '-er + -ir mixed: comer/beber/leer (er) + salir/subir/vivir/escribir/abrir (ir)',
        'Nosotros forms: salimos, comemos, bebemos, abrimos, vemos',
        '3sg for other characters: vive, sube, escribe — contrasts with nosotros forms',
        'Natural register: friends coordinating by text message',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // INDEFINITE_ARTICLES (3 items) — gender, profession omission, unos/unas
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'En la tienda',
    difficultyLevel: '1.5',
    durationSeconds: 65,
    topic: 'Compras y descripciones de objetos',
    textContent: `Estoy en una tienda. Necesito comprar unas cosas. Busco un libro de español. También quiero una mochila nueva.

En la tienda hay un señor muy amable. Le pregunto: "¿Tiene un diccionario?" "Sí", dice él. "Tenemos un diccionario muy bueno." Me muestra una mesa con libros. Hay un diccionario grande y un diccionario pequeño. Compro un diccionario pequeño.

También veo una mochila azul. Es bonita. El precio es muy bueno. Compro la mochila también. Salgo de la tienda con un libro y una mochila. ¡Perfecto!`,
    languageFeatures: {
      grammar: [
        'indefinite_articles',
        'present_tense_estar',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['tienda', 'libro', 'español', 'mochila', 'señor', 'diccionario', 'precio', 'azul', 'bonita'],
        requiredVocabSize: 30,
      },
      structures: [
        'Indefinite articles: un (masculine), una (feminine)',
        'Article-noun gender agreement: un libro / una mochila / un diccionario / una tienda',
        'Indefinite → definite shift once item is identified: un diccionario → el diccionario',
        'Plural indefinite unas briefly introduced (unas cosas)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: '¿A qué te dedicas?',
    difficultyLevel: '2.0',
    durationSeconds: 85,
    topic: 'Profesiones y presentaciones',
    textContent: `En una fiesta, conozco a gente nueva. Siempre pregunto: "¿A qué te dedicas?"

Mi nuevo amigo Marcos dice: "Soy médico." No dice "soy un médico" — en español, con el verbo ser, generalmente no usamos el artículo con profesiones: soy médico, eres estudiante, es profesora.

Pero si la profesión tiene un adjetivo, el artículo aparece. Marcos dice: "Soy un médico muy joven." Ahora sí hay artículo. Y su amiga Sofía dice: "Soy una profesora muy estricta."

Yo digo: "Soy estudiante de español." Sin artículo. Pero también puedo decir: "Soy un estudiante entusiasta." Con adjetivo, con artículo.`,
    languageFeatures: {
      grammar: [
        'indefinite_articles',
        'present_tense_ser',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['fiesta', 'médico', 'profesora', 'estudiante', 'profesión', 'artículo', 'adjetivo', 'entusiasta', 'estricta'],
        requiredVocabSize: 50,
      },
      structures: [
        'Profession + ser without article: soy médico, eres estudiante, es profesora',
        'Profession + modifier adds article: soy un médico muy joven, es una profesora estricta',
        'L1 interference: EN always uses "a" (I\'m a doctor) — ES drops it after ser + bare profession',
        'Explicit meta-commentary following Schmidt Noticing Hypothesis',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El mercado del domingo',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Mercados y compras en la ciudad',
    textContent: `Los domingos hay un mercado cerca de mi casa. Venden unas frutas increíbles. Hay unos limones enormes y unas fresas perfectas. Compro unos plátanos, unas naranjas y un melón grande.

También hay un señor que vende unos quesos artesanales. "¿Quiere probar unos trozos?", me pregunta. "Sí, gracias", digo. Pruebo unos quesos suaves y uno muy fuerte. El fuerte es delicioso.

En otro puesto venden unas plantas bonitas. Compro una planta para mi apartamento. "¿Tiene unos tiestos más pequeños?", pregunto. El vendedor me muestra unos tiestos azules. Compro uno. Es un domingo perfecto.`,
    languageFeatures: {
      grammar: [
        'indefinite_articles',
        'present_tense_regular_er_ir',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['mercado', 'limones', 'fresas', 'plátanos', 'naranjas', 'melón', 'quesos', 'artesanales', 'trozos', 'tiestos', 'plantas'],
        requiredVocabSize: 65,
      },
      structures: [
        'Plural indefinite unos/unas for approximate or unspecified quantities',
        'Unos/unas → "some" or "a few": unos limones, unas fresas, unos quesos',
        'Singular un/una for first introduction of a new referent',
        'Gender agreement in plurals: unos quesos / unas plantas / unos tiestos',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedA1FoundationContent() {
  console.log('🌱 Seeding A1 foundation content (estar, tener, -er/-ir verbs, indefinite articles)...');
  console.log('   3 present_tense_estar items (location, states, progressive)');
  console.log('   3 present_tense_tener items (possession/age, idioms, tener que)');
  console.log('   3 present_tense_regular_er_ir items (-er verbs, -ir verbs, mixed)');
  console.log('   3 indefinite_articles items (gender agreement, profession omission, unos/unas)');
  console.log(`   ${a1FoundationContent.length} total items at difficulty 1.5–2.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(a1FoundationContent).returning();
    console.log(`✅ Seeded ${inserted.length} A1 foundation content items.`);
  } catch (error) {
    console.error('❌ Failed to seed A1 foundation content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedA1FoundationContent();
