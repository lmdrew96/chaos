// scripts/seed-object-pronouns-content-es.ts
// ChaosLengua — direct/indirect object pronouns exercise set (Stage 1 pattern #4)
//
// 9 focused content items exposing Spanish object pronoun forms and placement.
// Per spanish-specific.md §6:
//   Stage 1: DO/IO pronouns with finite verbs, pre-verbal position.
//            Separate, not combined. High-frequency contexts.
//   Stage 2: Combined clitics + se-substitution rule + attachment to
//            infinitives/gerunds/imperatives.
//
// Distribution:
// - 3 items tagged direct_object_pronouns (pre-verbal, finite-verb focus)
// - 3 items tagged indirect_object_pronouns (including clitic doubling with
//   proper nouns + gustar-family saturation)
// - 3 items tagged combined_object_pronouns (Stage 2 prep — me+lo, te+lo,
//   and the iconic "se lo" substitution rule with explicit meta-commentary)
//
// Clitic doubling with "le/les + proper noun or specific human" is obligatory
// in Spanish and featured heavily in the IO passages since it has no EN
// analogue.
//
// Difficulty: 2.5-4.0. Combined clitic items sit at 3.5-4.0 since they
// preview Stage 2 material.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const objectPronounContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // DIRECT_OBJECT_PRONOUNS (3 items) — pre-verbal, finite-verb focus
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Las llaves perdidas',
    difficultyLevel: '2.5',
    durationSeconds: 90,
    topic: 'Vida familiar',
    textContent: `Mi hermana Laura tiene muchas cosas en su cuarto. Yo siempre le pregunto: "¿Dónde están tus llaves?" Y ella siempre las busca, pero no las encuentra. A veces las encuentra debajo de la cama. Otras veces las deja en la cocina. Ayer, por ejemplo, no las encontró en ningún lado. Yo la ayudé. Las vi sobre la mesa del comedor. "¡Aquí las tienes!", le dije. Ella me miró sorprendida. Las tomó y me dio un abrazo. "Gracias", me dijo. "Eres la mejor hermana del mundo." Yo la quiero mucho.`,
    languageFeatures: {
      grammar: [
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'preterite_formation',
        'imperfect_formation',
        'present_tense_stem_change',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['hermana', 'llaves', 'cuarto', 'cama', 'cocina', 'mesa', 'comedor', 'abrazo'],
        requiredVocabSize: 55,
      },
      structures: [
        'DO pronoun "las" replacing "las llaves" across multiple clauses',
        'DO pronoun "la" for specific human (Laura)',
        'Pre-verbal placement throughout (las busca, las encuentra, las deja, la quiero)',
        'IO pronouns co-occur naturally (le pregunto, le dije, me dijo)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Mi mejor amigo Pablo',
    difficultyLevel: '3.0',
    durationSeconds: 105,
    topic: 'Amistad y relaciones',
    textContent: `Tengo un mejor amigo, Pablo. Lo conozco desde la escuela primaria. Nos vemos una vez a la semana. Yo lo llamo los lunes para organizar. Él siempre me invita a tomar café. Cuando lo veo por la calle, siempre lo saludo desde lejos. La última vez que lo vi, estaba con su novia Marina. Yo no la conocía todavía. Ahora la conozco bien. Marina es muy simpática. A ella también la invité a mi cumpleaños. Mis amigos la adoran y ella los adora también.`,
    languageFeatures: {
      grammar: [
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'preterite_formation',
        'imperfect_formation',
        'ser_vs_estar_core',
        'personal_a',
        'gender_agreement',
        'basic_prepositions',
      ],
      vocabulary: {
        keywords: ['amigo', 'escuela', 'primaria', 'café', 'calle', 'novia', 'simpática', 'cumpleaños'],
        requiredVocabSize: 65,
      },
      structures: [
        'DO "lo" replacing specific masculine human (Pablo)',
        'DO "la" replacing specific feminine human (Marina)',
        'DO "los" replacing masculine plural (mis amigos)',
        'Personal "a" before human DOs (a Marina, a ella, a mis amigos)',
        'Clitic doubling: "A ella también la invité"',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La frase de mi abuelo',
    difficultyLevel: '3.5',
    durationSeconds: 125,
    topic: 'Memoria y reflexión',
    textContent: `Mi abuelo siempre decía: "La vida es complicada, pero hay que aceptarla como es." Yo no lo entendía cuando era niño. Ahora lo entiendo mejor. Cuando alguien me dice algo importante, pienso en esa frase. La guardo en mi memoria como un tesoro. "¿Sabes por qué?", me preguntan a veces. "Sí, lo sé", respondo yo. "Y también lo creo."

Un día mi jefe me criticó injustamente. Yo no respondí, aunque lo tenía claro todo. Lo pensé bien antes de hablar. Después le expliqué mi punto de vista con calma. Él lo aceptó. Mi abuelo siempre aprobaba esas respuestas. La paciencia, como él siempre decía, es una virtud. Y yo, por fin, la estoy aprendiendo.`,
    languageFeatures: {
      grammar: [
        'direct_object_pronouns',
        'indirect_object_pronouns',
        'preterite_formation',
        'imperfect_formation',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['abuelo', 'vida', 'complicada', 'memoria', 'tesoro', 'jefe', 'punto', 'vista', 'paciencia', 'virtud'],
        requiredVocabSize: 85,
      },
      structures: [
        'Neuter "lo" for ideas and statements (lo entendía, lo sé, lo creo, lo pensé, lo aceptó)',
        'DO "la" replacing feminine abstract nouns (la frase, la paciencia)',
        'Pre-verbal placement with progressive (la estoy aprendiendo)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // INDIRECT_OBJECT_PRONOUNS (3 items) — with clitic doubling
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'Las mañanas con mi madre',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Vida familiar cotidiana',
    textContent: `Mi madre siempre me habla por teléfono por las mañanas. Me dice "Buenos días, mi amor" y me pregunta cómo dormí. A veces le cuento mis sueños. Le gusta mucho escucharlos. Cuando mi hermano Samuel viene a cenar, mi madre le prepara su plato favorito: enchiladas. Siempre le pone queso extra, porque sabe que le encanta. A mí me da el plato con menos queso, porque sabe que prefiero el picante. Así es mi madre — siempre nos da lo que cada uno necesita. Siempre le doy las gracias con un abrazo.`,
    languageFeatures: {
      grammar: [
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'gustar_construction',
        'preterite_formation',
        'present_tense_stem_change',
        'ser_vs_estar_core',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['madre', 'teléfono', 'sueños', 'hermano', 'enchiladas', 'queso', 'picante'],
        requiredVocabSize: 60,
      },
      structures: [
        'IO pronouns with recipient verbs (me habla, me dice, le cuento, le prepara, le pone, me da, le doy)',
        'Gustar-family with IO (le gusta, le encanta)',
        'IO referent shifts across sentences (me → le/Samuel → nos/all)',
      ],
    },
    culturalNotes: 'Enchiladas are a staple of Mexican cuisine — tortillas rolled around a filling, typically topped with sauce and cheese.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El cumpleaños de Cristina',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Trabajo y celebraciones',
    textContent: `Ayer fue el cumpleaños de mi compañera de trabajo Cristina. Le dimos un regalo entre todos los empleados. Le compramos un libro de arte que ella quería desde hace meses. Cuando le dimos el libro, se puso muy contenta.

A mi jefe también le avisamos una semana antes. "Quiero contribuir", nos dijo. Le pedimos veinte euros y los puso sin preguntar. Le dijimos gracias, claro.

Cristina, emocionada, nos dio las gracias a cada uno. A mí me dio un abrazo fuerte. A María, que trajo la torta, también le dio un abrazo. A todos mis compañeros les sonrió con los ojos llenos de lágrimas. Le decimos en broma que es muy sentimental. Pero en el fondo, nos gusta mucho cuando es así.`,
    languageFeatures: {
      grammar: [
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'gustar_construction',
        'preterite_formation',
        'imperfect_formation',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['cumpleaños', 'compañera', 'regalo', 'empleados', 'arte', 'jefe', 'euros', 'torta', 'lágrimas'],
        requiredVocabSize: 85,
      },
      structures: [
        'Clitic doubling with proper nouns: "A mí me dio", "A María... le dio"',
        'Clitic doubling with plural group: "A todos mis compañeros les sonrió"',
        'Obligatory "le/les" clitic even when full noun stated',
        'IO across dative-taking verbs (dar, pedir, decir, avisar)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que nos gusta',
    difficultyLevel: '4.0',
    durationSeconds: 140,
    topic: 'Familia y diferencias',
    textContent: `A mi hermano Fernando le encantan los deportes extremos. Le gusta escalar montañas. Le fascina el windsurf. A mí me parecen peligrosos, pero a él le emocionan. No le molesta el riesgo. Al contrario, le da vida.

A mis padres les preocupa la seguridad de Fernando. A mi madre especialmente le duele pensar en los accidentes. "A ti no te importa", me dice a veces. No es verdad: a mí también me importa mi hermano. Pero a él no le gusta ser protegido. Quiere libertad.

A todos nos gusta una cosa diferente: a mi padre le interesa la política, a mi madre le encanta cocinar, a Fernando le fascinan las alturas. A mí me gustan los libros. Lo que nos une no es lo que nos gusta — lo que nos une es que nos respetamos.`,
    languageFeatures: {
      grammar: [
        'indirect_object_pronouns',
        'gustar_construction',
        'ser_vs_estar_core',
        'present_tense_ser',
        'present_tense_estar',
        'reflexive_verbs_es',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['deportes', 'extremos', 'escalar', 'montañas', 'windsurf', 'peligrosos', 'riesgo', 'seguridad', 'accidentes', 'libertad', 'política', 'alturas'],
        requiredVocabSize: 95,
      },
      structures: [
        'Gustar-family saturation: gustar, encantar, fascinar, molestar, preocupar, doler, importar, interesar, parecer',
        'Clitic doubling obligatory throughout',
        'IO pronoun as experiencer (reversal from EN subject)',
        'Emphatic "a mí" / "a él" for contrast',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // COMBINED_OBJECT_PRONOUNS (3 items) — Stage 2 prep with meta-commentary
  // me+lo, te+lo, and the iconic "se lo" substitution rule
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'La historia del pescador',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Memorias y narrativas familiares',
    textContent: `Mi padre me contó una historia cuando era niño. Me la contó muchas veces, pero siempre me la contaba de forma diferente.

La historia era de un pescador. El pescador encontró una botella en el mar. Dentro de la botella había un mensaje. ¿Qué decía el mensaje? Mi padre nunca me lo dijo. "Te lo voy a decir más tarde", me prometía siempre.

Pasaron los años. Yo crecí y me olvidé de la historia. Un día, ya adulto, volví a ver a mi padre. "¿Te acuerdas de la botella?", le pregunté. "Sí", me dijo. "¿Me vas a decir por fin qué decía el mensaje?" Él sonrió. "Ya te lo dije. Siempre te lo dije. El mensaje era sobre paciencia. Y la paciencia, mi hijo, nadie te la puede enseñar con palabras. Solo con el tiempo."

En ese momento, finalmente entendí.`,
    languageFeatures: {
      grammar: [
        'combined_object_pronouns',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'preterite_formation',
        'imperfect_formation',
        'future_ir_a',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['padre', 'historia', 'pescador', 'botella', 'mar', 'mensaje', 'paciencia', 'tiempo'],
        requiredVocabSize: 85,
      },
      structures: [
        'Combined clitics: me + la/lo, te + la/lo (no se-substitution yet)',
        'Order: IO before DO',
        'Pre-verbal placement throughout',
        'Combined clitics repeat naturally in narrative context',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La regla del "se lo"',
    difficultyLevel: '4.0',
    durationSeconds: 155,
    topic: 'Familia y gramática',
    textContent: `Mi tía Isabel tiene una regla: cuando alguien le pide algo, ella siempre se lo da. Es muy generosa. El año pasado, mi primo Mateo le pidió su bicicleta. Ella se la dio. Otro día, mi abuela le pidió sus libros antiguos. Mi tía se los dio sin dudar. Cuando mis sobrinos le piden dulces, ella se los da con amor.

Pero hay una cosa interesante en español. Si yo digo "le di la bicicleta a Mateo", puedo usar pronombres para reemplazar "la bicicleta" y "a Mateo". ¿Cómo? No digo "le la di" — eso no suena bien. En su lugar, el "le" cambia a "se". Entonces digo: "se la di". Lo mismo con cualquier combinación de le/les + lo/la/los/las.

Mi tía Isabel no conoce esta regla gramatical, pero la usa perfectamente. Como casi todos los hispanohablantes: saben las reglas sin saberlas. Yo, como estudiante extranjero, tengo que aprenderlas explícitamente. Pero cuando alguien me explica la regla, se la agradezco mucho.`,
    languageFeatures: {
      grammar: [
        'combined_object_pronouns',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'preterite_formation',
        'present_tense_ser',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['tía', 'regla', 'generosa', 'bicicleta', 'libros', 'antiguos', 'sobrinos', 'dulces', 'hispanohablantes', 'extranjero'],
        requiredVocabSize: 95,
      },
      structures: [
        'Se-substitution rule explicit: le+lo → se+lo, le+la → se+la, etc.',
        'Meta-commentary showing WRONG form ("le la di") vs RIGHT ("se la di")',
        'Multiple se-substitution examples in natural context',
        'Reflection on implicit vs explicit rule knowledge',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El libro de Julieta',
    difficultyLevel: '4.0',
    durationSeconds: 150,
    topic: 'Amistad y responsabilidad',
    textContent: `La semana pasada, mi amiga Julieta me pidió un favor. "Necesito un libro urgente para mi clase", me dijo. "¿Me lo puedes prestar si lo tienes?" Yo lo tenía. Se lo di ese mismo día.

Dos días después, Julieta no me devolvió el libro. Le pregunté dónde estaba. "Uy, lo olvidé", me respondió. "Te lo traigo mañana." Pero otra semana pasó. Finalmente, cuando fui a su casa, vi mi libro en la mesa. "Oye, Julieta, ¿me lo das por favor? Lo necesito." Ella lo tomó y me lo entregó con vergüenza. "Perdón", me dijo. "Soy desastrosa." "No importa", le contesté. "Ya me lo devolviste."

A veces las cosas pequeñas muestran las diferencias en una amistad. Yo no se lo dije a Julieta, pero me di cuenta ese día que ella y yo somos diferentes. Yo soy muy puntual con mis cosas. Ella no. Cuando alguien me presta algo, yo se lo devuelvo al día siguiente. Cuando ella me presta algo, sé que puedo tomarme mi tiempo.`,
    languageFeatures: {
      grammar: [
        'combined_object_pronouns',
        'indirect_object_pronouns',
        'direct_object_pronouns',
        'preterite_formation',
        'imperfect_formation',
        'reflexive_verbs_es',
        'ser_vs_estar_core',
        'gender_agreement',
        'definite_articles',
      ],
      vocabulary: {
        keywords: ['favor', 'urgente', 'clase', 'prestar', 'vergüenza', 'desastrosa', 'puntual', 'amistad'],
        requiredVocabSize: 90,
      },
      structures: [
        'Combined clitics in natural dialogue (me lo, te lo, se lo)',
        'Se-substitution used twice (se lo di to Julieta, se lo dije about Julieta)',
        'Se-substitution implicit — no meta-commentary this time, just usage',
        'Multiple speakers exchange combined-clitic utterances',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedObjectPronounContent() {
  console.log('🌱 Seeding object pronouns exercise set (Stage 1 error pattern #4)...');
  console.log(`   3 direct_object_pronouns items (pre-verbal, finite-verb focus)`);
  console.log(`   3 indirect_object_pronouns items (with clitic doubling + gustar-family)`);
  console.log(`   3 combined_object_pronouns items (Stage 2 prep — me+lo, se-substitution)`);
  console.log(`   ${objectPronounContent.length} total items at difficulty 2.5–4.0\n`);

  try {
    const inserted = await db.insert(contentItems).values(objectPronounContent).returning();
    console.log(`✅ Seeded ${inserted.length} object pronoun content items.`);
    console.log('\n   ✅ All four Stage 1 error-pattern exercise sets are now seeded.');
    console.log('      (ser/estar + preterite/imperfect + por/para + object pronouns)');
  } catch (error) {
    console.error('❌ Failed to seed object pronoun content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedObjectPronounContent();
