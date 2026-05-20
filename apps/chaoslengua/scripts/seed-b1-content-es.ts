// scripts/seed-b1-content-es.ts
// ChaosLengua — B1 content set (difficulty 5.0–6.0)
//
// 10 authentic-style text passages for intermediate learners. These appear in
// Deep Fog for A2/B1 users (fog range min 3.5–5.0). Unlike Stage 1 scripts,
// these do NOT include explicit grammar meta-commentary — the goal is incidental
// exposure to natural Spanish prose, not pedagogically engineered input.
//
// Register: personal essays, narrative vignettes, reflective prose. Topics are
// universal (relationships, city life, memory, decisions) so the language, not
// cultural specificity, is the challenge.
//
// Grammar features naturally present:
//   present_perfect_es — he/ha/hemos + participio
//   impersonal_se — se dice, se puede, se escucha
//   relative_clauses_que — la persona que, el momento en que
//   conditional_simple — sería, podría, habría
//   subjunctive_present_intro — ojalá, quizás, espero que, quiero que
//   subjunctive_noun_clause — me alegra que, es importante que
//   subjunctive_adverbial — para que, antes de que, cuando + future
//
// Difficulty: 5.0–6.0 (B1 range on the 1–10 scale where ≤5.0 = B1 boundary).
// Vocabulary load: 90–120 required vocab size. Sentences average 18–25 words.
// No pedagogical callouts. No explicit structure labels.
//
// PREREQUISITE: seed-grammar-features-b1-b2-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const b1Content: NewContentItem[] = [

  {
    type: 'text',
    title: 'La ciudad de noche',
    difficultyLevel: '5.0',
    durationSeconds: 140,
    topic: 'Vida urbana y observación',
    textContent: `La ciudad cambia por la noche. Se apagan las luces de las tiendas y se encienden otras. Se escuchan músicas que durante el día no se oyen. Se mezclan idiomas en las esquinas.

He vivido en esta ciudad cinco años y todavía no la conozco del todo. He caminado por calles que no sabía que existían. He encontrado restaurantes que no aparecen en ninguna aplicación. He hablado con personas que llevan toda la vida aquí y que tampoco conocen todos los rincones.

Hay algo que se pierde cuando uno conoce demasiado bien un lugar. La sorpresa desaparece. Las calles se vuelven predecibles. Se deja de mirar hacia arriba.

Por eso me gusta salir tarde, cuando la ciudad se transforma y vuelve a ser un poco desconocida. Cuando se pueden ver las cosas como si fuera la primera vez.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'present_perfect_es',
        'relative_clauses_que',
        'subjunctive_present_intro',
        'preterite_imperfect_contrast',
      ],
      vocabulary: {
        keywords: ['esquinas', 'rincones', 'predecibles', 'transformar', 'desconocida', 'encienden', 'apagan'],
        requiredVocabSize: 90,
      },
      structures: [
        'Impersonal se throughout: se apagan, se encienden, se escuchan, se mezclan, se pierde, se puede',
        'Present perfect for past-with-present-relevance: he vivido, he caminado, he encontrado, he hablado',
        'Relative clauses: calles que no sabía que existían, personas que llevan toda la vida aquí',
        'Subjunctive: como si fuera la primera vez (si + subjunctive)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Un mensaje sin leer',
    difficultyLevel: '5.0',
    durationSeconds: 150,
    topic: 'Relaciones y comunicación digital',
    textContent: `Hace tres semanas que no leo el mensaje. Está ahí, con ese pequeño indicador que señala que no lo he abierto todavía.

Sé lo que dice. O creo saberlo. Marcos me escribió después de nuestra última conversación, que no terminó bien. En ese momento me fui sin decir nada. Cuando llegué a casa, vi la notificación. Lo pensé mucho. Pero no lo abrí.

Han pasado veintiún días. He tenido el teléfono en la mano muchas veces. He escrito respuestas que no he enviado. Me he preguntado si él todavía espera una respuesta. Probablemente ya ha entendido que no voy a contestar.

Pero el mensaje sigue ahí. Y yo sigo sin abrirlo. No sé exactamente qué estoy esperando. Tal vez el momento en que sepa qué decir. Tal vez que pase suficiente tiempo para que la conversación pueda empezar de otra manera.

O tal vez ya es demasiado tarde para eso.`,
    languageFeatures: {
      grammar: [
        'present_perfect_es',
        'relative_clauses_que',
        'subjunctive_adverbial',
        'imperfect_descriptive',
        'preterite_perfective',
      ],
      vocabulary: {
        keywords: ['indicador', 'notificación', 'contestar', 'respuesta', 'momento', 'conversación', 'suficiente'],
        requiredVocabSize: 95,
      },
      structures: [
        'Present perfect for personal relevance: han pasado, he tenido, he escrito, he preguntado, ha entendido',
        'Relative clause: el momento en que sepa qué decir (subjunctive in relative)',
        'Adverbial: para que la conversación pueda empezar — para que + subjunctive',
        'Hace + time + que + present: hace tres semanas que no leo',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que dicen las paredes',
    difficultyLevel: '5.2',
    durationSeconds: 150,
    topic: 'Arte urbano y memoria del barrio',
    textContent: `En el barrio donde crecí, las paredes hablan. No de forma literal, claro. Pero si uno sabe mirar, puede entender mucho.

Se han pintado murales que cuentan historias que no aparecen en los libros de historia. Hay uno que muestra a una mujer que lleva agua en la cabeza, con los colores del desierto del norte. Hay otro que tiene los colores de una bandera que ya nadie usa. En algunos muros se escriben mensajes que nadie borra: fechas, nombres, palabras que alguien necesitaba dejar antes de irse.

Se dice que una ciudad que no tiene grafiti es una ciudad que no tiene voz. No sé si eso es completamente verdad. Pero sí sé que los muros que he visto en otros lugares me han dicho cosas que los museos no dicen.

El barrio ha cambiado mucho desde que me fui. Se han construido edificios nuevos. Se han cerrado las tiendas de siempre. Pero las paredes que quedan siguen contando lo mismo.

Ojalá que alguien las fotografíe antes de que las pinten de blanco.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'present_perfect_es',
        'relative_clauses_que',
        'subjunctive_present_intro',
        'subjunctive_adverbial',
        'preterite_imperfect_contrast',
      ],
      vocabulary: {
        keywords: ['murales', 'grafiti', 'barrio', 'borra', 'desierto', 'bandera', 'fotografíe', 'construido'],
        requiredVocabSize: 100,
      },
      structures: [
        'Impersonal se: se han pintado, se escriben, se dice, se han construido, se han cerrado',
        'Present perfect: se han pintado, me han dicho, ha cambiado',
        'Subjunctive: ojalá que alguien las fotografíe (ojalá + subjunctive)',
        'Before-clause: antes de que las pinten (antes de que + subjunctive)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La carta que nunca envié',
    difficultyLevel: '5.5',
    durationSeconds: 160,
    topic: 'Familia, distancia y palabras no dichas',
    textContent: `Querida mamá:

Nunca te enviaré esta carta. O tal vez sí, algún día, cuando sienta que es el momento adecuado.

Quiero que sepas que entiendo todo lo que hiciste. De niña no lo entendía. Quería que las cosas fueran diferentes. Quería que estuvieras más presente. Pero ahora que soy adulta, comprendo lo difícil que era tu situación.

Si pudiera volver atrás, te diría muchas cosas que callé. Te escucharía más. Te haría las preguntas que nunca te hice. No porque crea que eso cambiaría algo, sino porque me arrepiento de los silencios que dejé crecer entre nosotras.

No sé si leerías esta carta. Tal vez la guardarías sin abrirla, como yo guardo algunas cosas: con cuidado, sin mirar demasiado.

No te escribo para pedirte nada. Te escribo para que sepas que pienso en ti más de lo que demuestro. Y para que, si algún día lees esto, no tengas dudas.

Con todo mi querer,
Tu hija`,
    languageFeatures: {
      grammar: [
        'subjunctive_noun_clause',
        'subjunctive_present_intro',
        'subjunctive_adverbial',
        'conditional_simple',
        'imperfect_descriptive',
        'preterite_perfective',
      ],
      vocabulary: {
        keywords: ['adecuado', 'presente', 'arrepiento', 'silencios', 'demuestro', 'callé', 'situación', 'dudas'],
        requiredVocabSize: 100,
      },
      structures: [
        'Subjunctive noun clause: quiero que sepas, quería que fueran, quería que estuvieras',
        'Purpose clause: para que sepas, para que no tengas dudas (para que + subjunctive)',
        'Temporal: cuando sienta que es el momento (cuando + subjunctive = future)',
        'Conditional: si pudiera volver / te diría / te escucharía / te haría',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Cuando sea mayor',
    difficultyLevel: '5.5',
    durationSeconds: 155,
    topic: 'Infancia, expectativas y el tiempo',
    textContent: `Mi sobrina Lucía tiene ocho años y sabe exactamente lo que hará cuando sea mayor.

"Cuando sea grande, voy a vivir en una casa con jardín y tres perros", me dice. "Cuando tenga dinero propio, voy a viajar a todos los continentes." "Cuando sea famosa, voy a ayudar a la gente que lo necesite."

Le pregunto si no le da miedo crecer. Me mira como si la pregunta fuera la más extraña del mundo. "No", dice sin dudar. "Cuando sea mayor, voy a poder hacer todo lo que quiero."

Ojalá que esa certeza le dure. Hay algo hermoso que se pierde cuando uno aprende que "cuando sea mayor" no siempre llega como se esperaba. Los planes cambian. Las circunstancias mandan. Lo que parecía seguro resulta complicado.

Pero también hay algo que se gana: la capacidad de querer cosas nuevas que uno no podía imaginar a los ocho años.

Yo también tenía mi lista. La mayoría de las cosas que quería no ocurrieron. Otras que no estaban en ninguna lista, sí.`,
    languageFeatures: {
      grammar: [
        'subjunctive_adverbial',
        'subjunctive_present_intro',
        'future_informal_ir_a',
        'imperfect_descriptive',
        'relative_clauses_que',
        'impersonal_se',
      ],
      vocabulary: {
        keywords: ['certeza', 'circunstancias', 'continentes', 'capacidad', 'expectativas', 'imaginar', 'extraña'],
        requiredVocabSize: 100,
      },
      structures: [
        'Cuando + subjunctive for future: cuando sea mayor, cuando tenga dinero, cuando sea famosa',
        'Ojalá + subjunctive: ojalá que esa certeza le dure',
        'Que la pregunta fuera (imperfect subjunctive after como si)',
        'Relative clauses: la gente que lo necesite (subjunctive in relative — uncertain referent)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El hombre que siempre llegaba tarde',
    difficultyLevel: '5.5',
    durationSeconds: 165,
    topic: 'Trabajo, juicios y perspectiva',
    textContent: `En la oficina donde trabajé durante cinco años había un hombre que siempre llegaba tarde. Se llamaba Germán. Era el tipo de persona que entraba sin disculparse, que se sentaba como si nada, que respondía correos mientras los demás hablaban en las reuniones.

Todos teníamos una opinión sobre él. Se murmuraba en los pasillos. Algunos decían que era irrespetuoso. Otros pensaban que simplemente no le importaba.

Lo que nadie sabía era por qué llegaba tarde. Un día, por casualidad, lo vi en el metro. Viajaba con una niña pequeña que llevaba uniforme escolar. La dejaba en la puerta del colegio que quedaba en la otra punta de la ciudad. Luego tomaba dos líneas de metro y un autobús para llegar a la oficina.

Después de ese día, lo vi diferente. Seguía llegando tarde, claro. Pero ya conocía la razón que había detrás de esos minutos que nos irritaban a todos.

He pensado en Germán muchas veces desde entonces. Me ha servido de recordatorio: hay cosas que no se ven y que lo explican todo. Y conviene no olvidarlo antes de opinar.`,
    languageFeatures: {
      grammar: [
        'relative_clauses_que',
        'impersonal_se',
        'present_perfect_es',
        'preterite_imperfect_contrast',
        'imperfect_descriptive',
      ],
      vocabulary: {
        keywords: ['murmuraba', 'pasillos', 'irrespetuoso', 'casualidad', 'uniforme', 'irritaban', 'recordatorio', 'disculparse'],
        requiredVocabSize: 105,
      },
      structures: [
        'Dense relative clauses: un hombre que siempre llegaba tarde, el tipo de persona que entraba, el colegio que quedaba',
        'Impersonal se: se murmuraba, se ven (things not seen)',
        'Present perfect for lesson learned: he pensado, me ha servido',
        'Como si + imperfect subjunctive: como si nada (fixed phrase)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Por si acaso',
    difficultyLevel: '5.8',
    durationSeconds: 165,
    topic: 'Filosofía cotidiana y generaciones',
    textContent: `Mi abuela guarda cosas "por si acaso". Tiene cajones llenos de botones que quizás algún día necesite. Guarda cartas y papeles que podrían ser útiles. Conserva ropa que quizás vuelva a estar de moda.

Al principio me parecía excesivo. Yo intento vivir con lo mínimo posible. Tiro lo que no uso. Pero últimamente pienso que tal vez mi abuela tenga razón en algo que yo no había considerado.

Vivir con "por si acaso" significa no descartar posibilidades. Significa dejar espacio para lo que podría ocurrir. Para lo que quizás ocurra. Para lo que, aunque no sea probable, tampoco es imposible.

Si pudiera hablar con la versión de mí misma de hace diez años, le diría que guardara más cosas. No objetos, sino momentos. Conversaciones. El nombre de personas que parecían de paso y que resultaron importantes. Los detalles pequeños de días que creyó que no olvidaría pero que ya se han ido.

Por si acaso.`,
    languageFeatures: {
      grammar: [
        'subjunctive_present_intro',
        'conditional_simple',
        'impersonal_se',
        'relative_clauses_que',
        'present_perfect_es',
        'imperfect_subjunctive',
      ],
      vocabulary: {
        keywords: ['cajones', 'botones', 'conserva', 'posibilidades', 'probable', 'versión', 'descartar', 'excesivo'],
        requiredVocabSize: 105,
      },
      structures: [
        'Quizás/tal vez + subjunctive: quizás algún día necesite, que tal vez tenga razón',
        'Si pudiera + conditional: si pudiera hablar / le diría que guardara (imperfect subj. in si-clause)',
        'Relative clauses with subjunctive: personas que parecían de paso, días que creyó que no olvidaría',
        'Present perfect: no había considerado, se han ido',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que no se dice',
    difficultyLevel: '5.8',
    durationSeconds: 160,
    topic: 'Familia, silencio y comunicación',
    textContent: `Hay familias en las que se habla de todo. En la mía, no.

No es que haya secretos graves. Es que se ha aprendido, de generación en generación, que hay cosas que es mejor no nombrar. Que si no se dice, quizás no exista del todo. Que el silencio puede ser una forma de protección.

Sé que mi madre tiene miedos que nunca ha expresado en voz alta. Mi padre tiene tristezas que solo se notan en el espacio entre sus palabras. Mi hermano tiene preguntas que no hace porque no quiere que se noten.

Yo también tengo mis silencios.

No sé si es posible cambiar ese patrón de un día para otro. Tal vez no sea necesario cambiarlo todo. Hay familias que hablan constantemente y que no se dicen nada que importe. Y hay familias que apenas hablan y que se entienden perfectamente.

Supongo que lo importante no es cuánto se dice, sino cuánto se escucha. Y tal vez también cuánto se permite al otro guardar.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'present_perfect_es',
        'subjunctive_present_intro',
        'relative_clauses_que',
        'subjunctive_noun_clause',
      ],
      vocabulary: {
        keywords: ['generación', 'nombrar', 'protección', 'patrón', 'constantemente', 'permite', 'expresado'],
        requiredVocabSize: 105,
      },
      structures: [
        'Impersonal se as family/social pattern: se habla, se ha aprendido, se dice, se notan, se escucha',
        'Es + adjective + que + subjunctive: es mejor no nombrar, es posible cambiar',
        'Relative clauses: familias que hablan, cosas que importe (subjunctive — uncertain)',
        'Present perfect of learning/experience: se ha aprendido, nunca ha expresado',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La decisión más difícil',
    difficultyLevel: '6.0',
    durationSeconds: 170,
    topic: 'Salud, incertidumbre y autonomía',
    textContent: `El médico me dijo que tenía que tomar una decisión antes de fin de mes.

No era una decisión de vida o muerte. Era más complicado que eso: era el tipo de decisión que, una vez tomada, cambia la dirección de muchas otras cosas. Una de esas decisiones que no tiene respuesta correcta, solo consecuencias diferentes.

Me alegró que el médico me diera tiempo para pensarlo. Me sorprendió que no intentara influir en mi elección. Me dio miedo que yo no supiera qué quería realmente.

Llamé a tres personas en quienes confío. Las tres me dieron consejos distintos y contradictorios. Lamento que ninguna me dijera simplemente: "Haz lo que creas mejor." Porque eso era exactamente lo que necesitaba escuchar.

Al final, tomé la decisión sola, tarde en la noche. No sé si fue la correcta. Nadie puede saberlo todavía. Habrá que esperar.

Pero fue mía. Completamente mía. Y eso, de momento, tiene que ser suficiente.`,
    languageFeatures: {
      grammar: [
        'subjunctive_doubt_emotion',
        'subjunctive_noun_clause',
        'relative_clauses_que',
        'conditional_simple',
        'preterite_imperfect_contrast',
        'impersonal_se',
      ],
      vocabulary: {
        keywords: ['decisión', 'consecuencias', 'influir', 'elección', 'contradictorios', 'lamento', 'autonomía'],
        requiredVocabSize: 110,
      },
      structures: [
        'Emotion + que + subjunctive: me alegró que me diera, me sorprendió que no intentara, me dio miedo que no supiera',
        'Lament + subjunctive: lamento que ninguna me dijera',
        'Relative with subjunctive: lo que creas mejor (uncertain referent)',
        'Impersonal habrá: habrá que esperar',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Antes de que sea tarde',
    difficultyLevel: '6.0',
    durationSeconds: 165,
    topic: 'Tiempo, presencia y las cosas pequeñas',
    textContent: `Hay cosas que uno debería hacer antes de que sea tarde. No las grandes cosas — esas uno ya las sabe y las pospone igualmente. Me refiero a las pequeñas.

Llamar a esa persona antes de que se vaya o antes de que la conversación se enfríe para siempre. Decir lo que uno piensa antes de que el momento cambie de tema solo. Quedarse un poco más antes de que termine algo que no volverá exactamente igual.

Tengo un amigo que vive con esa urgencia. Hace todo antes de que sea demasiado tarde: llama, aparece, escribe cartas a mano. A veces me cansa. Pero a veces lo envidio profundamente.

Para que algo importante ocurra, hay que estar presente en el momento en que ocurre. No antes. No después. Suena obvio. Pero la mayoría de las veces estamos pensando en lo que viene después, en lo que quedó pendiente, en lo que podría haber sido de otra manera.

No sé cuándo es "tarde". Supongo que eso es parte del problema, y también parte de lo que lo hace urgente.`,
    languageFeatures: {
      grammar: [
        'subjunctive_adverbial',
        'conditional_simple',
        'relative_clauses_que',
        'present_perfect_es',
        'subjunctive_present_intro',
        'impersonal_se',
      ],
      vocabulary: {
        keywords: ['pospone', 'enfríe', 'urgencia', 'profundamente', 'pendiente', 'urgente', 'presente'],
        requiredVocabSize: 110,
      },
      structures: [
        'Antes de que + subjunctive (repeated): antes de que sea tarde, antes de que se vaya, antes de que se enfríe, antes de que termine',
        'Para que + subjunctive: para que algo importante ocurra',
        'Relative: el momento en que ocurre, algo que no volverá igual',
        'Conditional: podría haber sido de otra manera (conditional perfect in indirect discourse)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedB1Content() {
  console.log('🌱 Seeding B1 content set (difficulty 5.0–6.0)...');
  console.log('   10 authentic-style text passages for intermediate learners');
  console.log('   Registers: personal essay, reflective vignette, epistolary, narrative');
  console.log('   Features: present_perfect_es, impersonal_se, relative_clauses_que,');
  console.log('             conditional_simple, subjunctive_present_intro,');
  console.log('             subjunctive_noun_clause, subjunctive_adverbial');
  console.log(`   ${b1Content.length} total items at difficulty 5.0–6.0\n`);

  try {
    const inserted = await db.insert(contentItems).values(b1Content).returning();
    console.log(`✅ Seeded ${inserted.length} B1 content items.`);
    console.log('\n   These appear in Deep Fog for users at A2–B1 level.');
  } catch (error) {
    console.error('❌ Failed to seed B1 content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedB1Content();
