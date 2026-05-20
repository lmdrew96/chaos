// scripts/seed-b2-c1-content-es.ts
// ChaosLengua — B2/C1 content set (difficulty 6.5–8.0)
//
// 10 sophisticated text passages for upper-intermediate to advanced learners.
// These appear in Deep Fog for B1/B2 users (fog range min 5.0–6.5). This is
// the content range that serves your current B2 level.
//
// Register: opinion essays, cultural commentary, narrative journalism, literary
// prose. Authentic-feeling — these could plausibly appear in a Spanish-language
// magazine, newspaper column, or literary journal. No pedagogical scaffolding.
//
// Grammar features naturally present:
//   subjunctive_noun_clause / subjunctive_adverbial / subjunctive_doubt_emotion
//   pluperfect_es — había + participio
//   conditional_perfect_es — habría + participio
//   passive_voice_es — ser + participio + por (formal/written register)
//   imperfect_subjunctive — si tuviera, quisiera, ojalá pudiera
//   reported_speech_es — dijo que vendría, preguntó si había
//   idiomatic_register — fixed expressions, register variation
//   relative_clauses_que — including subjunctive in relative clauses
//
// Difficulty: 6.5–8.0. Vocabulary load: 120–150+. Sentences average 22–30
// words. Discourse complexity: subordination, argumentation, irony, implicature.
//
// PREREQUISITE: seed-grammar-features-b1-b2-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const b2c1Content: NewContentItem[] = [

  {
    type: 'text',
    title: 'El idioma que se aprende dos veces',
    difficultyLevel: '6.5',
    durationSeconds: 185,
    topic: 'Lengua, identidad y aprendizaje',
    textContent: `Hay personas que aprenden un idioma dos veces. La primera vez, de niños, sin darse cuenta — absorbiendo el acento, los giros, los silencios que forman parte de una lengua tanto como las palabras. La segunda vez, de adultos, con gramáticas y listas de vocabulario y la conciencia incómoda de que lo que un día fue natural ahora requiere esfuerzo.

Los hijos de familias migrantes conocen bien este proceso. Se crece hablando el idioma del país de origen en casa y el idioma del país de llegada en la calle, en la escuela, con los amigos. Con el tiempo, uno de los dos empieza a ganar terreno. El que se practica menos se vuelve frágil, lleno de huecos que se rellenan con palabras prestadas del otro.

Y entonces, a veces, en la adolescencia o en la adultez, algo empuja a recuperar lo que se había dejado de lado. Puede ser un viaje, una pérdida, el deseo de entender algo que los abuelos dijeron una vez y que nadie tradujo.

Esa segunda adquisición es diferente a la primera. Es más consciente, más trabajosa, más emocional. Se aprende no solo una lengua sino también todo lo que uno no sabía que había perdido.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'passive_voice_es',
        'relative_clauses_que',
        'subjunctive_adverbial',
        'pluperfect_es',
        'reported_speech_es',
      ],
      vocabulary: {
        keywords: ['absorbiendo', 'giros', 'conciencia', 'migrantes', 'adquisición', 'frágil', 'huecos', 'prestadas', 'adultez'],
        requiredVocabSize: 120,
      },
      structures: [
        'Impersonal se sustained: se crece, se practica, se vuelve, se rellenan, se había dejado, se aprende',
        'Relative clauses: silencios que forman parte, palabras que un día fue natural, algo que los abuelos dijeron',
        'Pluperfect: lo que se había dejado de lado, lo que uno no sabía que había perdido',
        'Reported speech: algo que los abuelos dijeron una vez y que nadie tradujo',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Ciudades que se vacían',
    difficultyLevel: '6.5',
    durationSeconds: 190,
    topic: 'Despoblación, territorio y memoria',
    textContent: `Cada año se abandonan en España decenas de pueblos. No de golpe — eso sería demasiado dramático, demasiado fácil de señalar. Se vacían lentamente, como vasos que pierden el agua por una grieta pequeña que nadie repara porque nadie queda para repararla.

Primero se van los jóvenes, que buscan trabajo en las ciudades. Luego cierran las escuelas, porque ya no hay niños suficientes para mantenerlas abiertas. Después cierran los bares, que eran el único lugar donde quedarse. Y entonces los mayores, que se habían quedado por inercia o por amor al lugar, se encuentran sin transporte, sin servicios, sin nadie con quien hablar.

Se han escrito muchos artículos sobre este fenómeno. Se han propuesto soluciones que nunca llegan a aplicarse del todo. Se habla de "España vaciada" como si nombrar el problema fuera suficiente para empezar a resolverlo.

Hay pueblos que han encontrado maneras de reinventarse: turismo rural, teletrabajadores que buscan silencio, artistas que quieren espacio. No muchos, pero algunos.

Lo que queda en los que no lo consiguen son las casas vacías, las iglesias cerradas, los cementerios que nadie visita ya. Y los nombres de calles que no llevan a ningún sitio que quiera ir alguien.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'passive_voice_es',
        'relative_clauses_que',
        'subjunctive_adverbial',
        'present_perfect_es',
        'subjunctive_doubt_emotion',
      ],
      vocabulary: {
        keywords: ['abandonan', 'grieta', 'inercia', 'despoblación', 'fenómeno', 'reinventarse', 'teletrabajadores', 'cementerios'],
        requiredVocabSize: 125,
      },
      structures: [
        'Passive/impersonal se: se abandonan, se vacían, se han escrito, se han propuesto, se habla',
        'Como si + subjunctive: como si nombrar el problema fuera suficiente',
        'Relative clauses with subjunctive: pueblos que no llevan a ningún sitio que quiera ir alguien',
        'Present perfect for ongoing relevance: se han escrito, se han propuesto',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La trampa de la claridad',
    difficultyLevel: '7.0',
    durationSeconds: 200,
    topic: 'Comunicación, lenguaje y poder',
    textContent: `Se nos pide constantemente que seamos claros. En los correos, en las reuniones, en los informes: claridad, concisión, ir al grano. Como si la complejidad fuera un defecto del pensamiento y no, a veces, una propiedad necesaria de las cosas que se intentan decir.

Hay ideas que no caben en una frase. Hay sentimientos que se deforman cuando se los simplifica demasiado. Hay situaciones que requieren matices que la claridad forzada borra. Y sin embargo, el que habla de forma compleja suele ser acusado de no saber explicarse, cuando quizás simplemente esté intentando ser honesto con la dificultad de lo que describe.

No propongo que se abandone la claridad. Propongo que se deje de tratarla como un valor absoluto. Que se reconozca que hay momentos en los que la ambigüedad no es un error sino una respuesta adecuada a la realidad. Que se permita a las ideas tener la forma que necesitan, aunque esa forma sea incómoda.

La obsesión con la claridad puede ser, también, una forma de control: la exigencia de que todo se pueda resumir, clasificar, comunicar en un mensaje de pocas palabras. Lo que no cabe en ese formato, se descarta. Y lo que se descarta, deja de existir para la conversación.

Eso tiene consecuencias. No siempre visibles. No siempre inmediatas. Pero reales.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'subjunctive_noun_clause',
        'passive_voice_es',
        'relative_clauses_que',
        'conditional_simple',
        'subjunctive_adverbial',
      ],
      vocabulary: {
        keywords: ['concisión', 'complejidad', 'matices', 'ambigüedad', 'exigencia', 'absurdo', 'consecuencias', 'deforman', 'descarta'],
        requiredVocabSize: 130,
      },
      structures: [
        'Se nos pide — impersonal se with IO pronoun',
        'Subjunctive: propongo que se abandone, que se reconozca, que se permita, que se deje',
        'Aunque + subjunctive: aunque esa forma sea incómoda',
        'Passive: suele ser acusado, lo que no cabe se descarta',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que heredamos sin pedirlo',
    difficultyLevel: '7.0',
    durationSeconds: 195,
    topic: 'Familia, herencia emocional y psicología',
    textContent: `Heredamos más de lo que creemos. No solo los ojos del abuelo o la forma de las manos de la madre. Heredamos miedos que no vivimos, traumas que ocurrieron antes de que naciéramos, maneras de interpretar el mundo que se transmiten sin palabras, a través de lo que se dice en la mesa y de lo que no se dice nunca.

La psicología lo llama "trauma transgeneracional". La idea es que las experiencias de una generación dejan huellas en la siguiente, incluso en aquellos que no estuvieron presentes. Estudios con descendientes de personas que habían vivido hambrunas o guerras mostraron que sus cuerpos respondían de manera diferente al estrés, como si algo en ellos recordara lo que sus abuelos habían sufrido.

Mis bisabuelos emigraron en circunstancias que nunca se explicaron del todo. Había silencios en la familia que nadie quería llenar, preguntas que no se hacían porque se sabía que no iban a tener respuesta. De adulta, me he dado cuenta de que cargo con algunas de esas ausencias sin haberlas elegido.

No sé si eso puede cambiarse completamente. Pero sí creo que nombrarlo es el primer paso. Que lo que se nombra se puede, al menos, mirar de frente.`,
    languageFeatures: {
      grammar: [
        'pluperfect_es',
        'passive_voice_es',
        'relative_clauses_que',
        'impersonal_se',
        'subjunctive_adverbial',
        'reported_speech_es',
        'present_perfect_es',
      ],
      vocabulary: {
        keywords: ['heredamos', 'trauma', 'transgeneracional', 'huellas', 'hambrunas', 'bisabuelos', 'emigraron', 'ausencias', 'descendientes'],
        requiredVocabSize: 130,
      },
      structures: [
        'Pluperfect: que habían vivido, lo que sus abuelos habían sufrido, que no habían elegido',
        'Passive: se transmiten, se llama, se explicaron, se hacían',
        'Relative with subjunctive: preguntas que no iban a tener respuesta (future in relative)',
        'Reported speech: como si algo en ellos recordara (imperfect subj. after como si)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Habría que preguntarse',
    difficultyLevel: '7.0',
    durationSeconds: 195,
    topic: 'Tecnología, distracción y atención',
    textContent: `Habría que preguntarse qué hemos perdido en el proceso de ganar tanto acceso. Antes de que los teléfonos nos dieran la posibilidad de estar permanentemente conectados, había huecos. Momentos de espera en los que no había nada que hacer más que mirar por la ventana, escuchar lo que ocurría a nuestro alrededor, pensar sin dirección precisa.

Esos huecos se han llenado. No con cosas que hayamos elegido necesariamente, sino con cualquier cosa que esté disponible en ese momento. El scroll infinito funciona precisamente porque no requiere intención: uno no decide ver el siguiente video, simplemente no decide no verlo.

Se habría podido diseñar la tecnología de otra manera. Se habrían podido tomar decisiones distintas en la arquitectura de estas plataformas. Pero las decisiones que se tomaron priorizaron el engagement por encima de cualquier otra consideración, y ahora vivimos con las consecuencias de esas elecciones.

No propongo el rechazo de la tecnología. Propongo el reconocimiento honesto de lo que ocurre cuando se la usa sin conciencia. Lo que se podría recuperar, si se quisiera, es la capacidad de estar aburrido. Y con el aburrimiento, la posibilidad de inventar algo nuevo.`,
    languageFeatures: {
      grammar: [
        'conditional_perfect_es',
        'subjunctive_noun_clause',
        'impersonal_se',
        'passive_voice_es',
        'pluperfect_es',
        'relative_clauses_que',
        'imperfect_subjunctive',
      ],
      vocabulary: {
        keywords: ['permanentemente', 'conectados', 'scroll', 'engagement', 'arquitectura', 'plataformas', 'conciencia', 'priorizaron'],
        requiredVocabSize: 135,
      },
      structures: [
        'Habría que + infinitive — conditional perfect of obligation',
        'Se habría podido / se habrían podido — conditional perfect passive',
        'Imperfect subjunctive: si se quisiera, lo que se podría recuperar',
        'Subjunctive: propongo que se la use, el reconocimiento de lo que ocurre',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El silencio como idioma',
    difficultyLevel: '7.5',
    durationSeconds: 210,
    topic: 'Música, escucha y lo no dicho',
    textContent: `El músico John Cage compuso, en 1952, una pieza titulada 4'33". El intérprete se sienta ante el piano, abre la tapa, y no toca nada durante cuatro minutos y treinta y tres segundos. Lo que se escucha es lo que ocurre en la sala: el murmullo del público, el crujido de una silla, la lluvia si la hay, el sonido del silencio que no es silencio sino la ausencia de lo que se esperaba.

La pieza fue recibida con escándalo y con fascinación. Algunos dijeron que era una broma. Otros, que era la obra más honesta del siglo. Cage defendió que toda la música que había compuesto antes de 4'33" no era sino preparación para escuchar lo que ya existía.

Hay algo en esa idea que resuena más allá de la música. En la conversación, los silencios tienen tanto peso como las palabras. Lo que no se dice en el momento preciso puede cambiar el sentido de todo lo que se dijo antes. Una pausa puede ser acuerdo, puede ser duda, puede ser el reconocimiento de que lo que viene a continuación es demasiado importante para apresurar.

Aprender a escuchar el silencio — en la música, en las conversaciones, en uno mismo — es una de esas habilidades que no se enseñan pero que, una vez desarrolladas, cambian la manera en que se percibe todo lo demás.`,
    languageFeatures: {
      grammar: [
        'passive_voice_es',
        'reported_speech_es',
        'relative_clauses_que',
        'impersonal_se',
        'subjunctive_doubt_emotion',
        'idiomatic_register',
      ],
      vocabulary: {
        keywords: ['intérprete', 'murmullo', 'crujido', 'escándalo', 'fascinación', 'resuena', 'apresurar', 'habilidades', 'percibe'],
        requiredVocabSize: 135,
      },
      structures: [
        'Passive: fue recibida, fue compuesto, titulada — ser + participio in narrative',
        'Reported speech: dijeron que era una broma, defendió que toda la música era preparación',
        'Relative clauses with subjunctive: lo que viene a continuación sea demasiado importante',
        'Idiomatic: no era sino (emphatic restriction), que no es silencio sino la ausencia',
      ],
    },
    culturalNotes: '4\'33" by John Cage is one of the most controversial works in 20th century music. Its premise — that ambient sound IS the composition — challenges the boundary between music and noise.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Una historia de migraciones',
    difficultyLevel: '7.5',
    durationSeconds: 215,
    topic: 'Migración, identidad y pertenencia',
    textContent: `Mi familia ha cruzado fronteras en cada generación. Mi bisabuelo llegó a Argentina desde el sur de España huyendo de una guerra que había destruido el mundo que conocía. Mi abuelo volvió a España décadas más tarde, cuando Argentina ya no era el lugar que su padre había imaginado. Mi madre salió de España siendo joven, antes de que terminara la dictadura, y no volvió hasta que ya era otra persona.

Yo nací en una ciudad y vivo en otra. He vivido en países cuyo idioma no era el mío cuando llegué. He aprendido a hacer mía una lengua que no me habían dado de niña.

Hay familias que se quedan. Las mías se han ido siempre. No por aventura — eso sería romantizarlo. Se fueron porque las circunstancias habían hecho imposible quedarse, o porque quedarse habría significado renunciar a algo demasiado grande.

Lo que me pregunto, a veces, es qué se habría perdido y qué se habría ganado si las cosas hubieran sido diferentes. Si el bisabuelo no hubiera tenido que huir. Si el abuelo no hubiera vuelto. Si mi madre se hubiera quedado.

No hay respuesta para eso. Pero la pregunta me parece importante. Porque de alguna manera, la respuesta sería yo.`,
    languageFeatures: {
      grammar: [
        'pluperfect_es',
        'conditional_perfect_es',
        'imperfect_subjunctive',
        'present_perfect_es',
        'passive_voice_es',
        'reported_speech_es',
      ],
      vocabulary: {
        keywords: ['bisabuelo', 'fronteras', 'dictadura', 'romantizarlo', 'renunciar', 'circunstancias', 'migración', 'pertenencia'],
        requiredVocabSize: 140,
      },
      structures: [
        'Conditional perfect speculation: qué se habría perdido, qué se habría ganado',
        'Imperfect subjunctive si-clauses: si hubiera sido, si no hubiera tenido que huir, si se hubiera quedado',
        'Pluperfect: había destruido, había imaginado, había hecho imposible',
        'Present perfect as personal history: ha cruzado, he vivido, he aprendido',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La paradoja del experto',
    difficultyLevel: '7.5',
    durationSeconds: 200,
    topic: 'Conocimiento, humildad y certeza',
    textContent: `Cuanto más se sabe de algo, más claramente se percibe la magnitud de lo que falta por saber. Es una paradoja que los que se dedican al conocimiento reconocen sin dificultad: el principiante siente que lo está entendiendo todo; el experto sabe exactamente dónde están los límites de su comprensión.

Esto tiene una consecuencia incómoda. Las personas que más saben sobre un tema suelen ser las más cautelosas a la hora de hacer afirmaciones categóricas. Dicen "probablemente", "en la mayoría de los casos", "bajo ciertas condiciones". Las personas que menos saben suelen hablar con más seguridad, porque no han llegado todavía al punto en que se ve lo que no se sabe.

El resultado es que, en muchas conversaciones públicas, los que más deberían ser escuchados son los que hablan con más dudas. Y los que hablan con más seguridad son, a menudo, los que menos habrían de serlo.

No sé si hay solución a eso. Tal vez sea suficiente con saber que existe el patrón. Que la certeza no es señal de conocimiento sino, muchas veces, de su ausencia. Y que la duda, bien aplicada, no es debilidad sino precisión.`,
    languageFeatures: {
      grammar: [
        'impersonal_se',
        'subjunctive_adverbial',
        'relative_clauses_que',
        'conditional_simple',
        'subjunctive_doubt_emotion',
        'idiomatic_register',
        'imperfect_subjunctive',
      ],
      vocabulary: {
        keywords: ['magnitud', 'paradoja', 'cautelosas', 'categóricas', 'afirmaciones', 'debilidad', 'precisión', 'comprensión'],
        requiredVocabSize: 140,
      },
      structures: [
        'Cuanto más… más: cuanto más se sabe, más claramente se percibe',
        'Imperfect subjunctive: los que menos habrían de serlo (conditional inversion)',
        'Relative with subjunctive: personas que más deberían ser escuchadas',
        'Idiomatic: a la hora de, bajo ciertas condiciones, bien aplicada (C1 collocations)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: '¿De quién es el español?',
    difficultyLevel: '8.0',
    durationSeconds: 225,
    topic: 'Lingüística, política y el español global',
    textContent: `El español es, según los datos, la segunda lengua del mundo por número de hablantes nativos. Más de cuatrocientos setenta millones de personas lo tienen como primera lengua, y otros quinientos millones lo hablan con distintos grados de competencia. Es el idioma oficial de veintiún países. Y sin embargo, o quizás por eso mismo, la pregunta de quién lo posee — de quién tiene autoridad para decir qué es correcto y qué no — sigue sin tener respuesta clara.

Durante siglos, la Real Academia Española actuó como árbitro de esa autoridad. Lo que la RAE aprobaba era español correcto; lo que rechazaba era error o barbarismo. Pero ese modelo, que ya era cuestionable cuando solo había que abarcar la Península, resultó directamente insostenible cuando se intentó aplicar a las variedades del español hablado por cientos de millones de personas en América, Africa y Asia.

Hoy la discusión ha cambiado de forma, pero no ha desaparecido. Se debate si el español neutro —ese castellano sin acento regional que se usa en los doblajes y en las instrucciones de los electrodomésticos— existe realmente o es una ficción útil. Se discute qué palabras del inglés deben adaptarse y cuáles deben rechazarse. Se pregunta si las lenguas indígenas que conviven con el español en muchos territorios merecen el mismo estatus o si son simplemente variedades que se toleran.

Detrás de todas estas preguntas hay una sola pregunta más grande: ¿puede una lengua tener dueño? Y si puede, ¿quién lo decide?`,
    languageFeatures: {
      grammar: [
        'passive_voice_es',
        'impersonal_se',
        'subjunctive_adverbial',
        'relative_clauses_que',
        'idiomatic_register',
        'subjunctive_noun_clause',
        'reported_speech_es',
      ],
      vocabulary: {
        keywords: ['hablantes', 'competencia', 'barbarismo', 'insostenible', 'variedades', 'electrodomésticos', 'lingüística', 'árbitro', 'indígenas'],
        requiredVocabSize: 150,
      },
      structures: [
        'Passive with historical narrative: actuó como árbitro, lo que la RAE aprobaba era correcto',
        'Cuestionable cuando solo había que abarcar — conditional/temporal complexity',
        'Impersonal se for ongoing debate: se debate, se discute, se pregunta',
        'Idiomatic: por eso mismo, sin tener respuesta clara, a fin de cuentas (register markers)',
      ],
    },
    culturalNotes: 'The Real Academia Española (RAE) was founded in 1713 and has historically claimed authority over "correct" Spanish. Its relationship with Latin American varieties of Spanish has been contentious since independence.',
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'La memoria del cuerpo',
    difficultyLevel: '8.0',
    durationSeconds: 220,
    topic: 'Psicología, trauma y la escritura',
    textContent: `Hay una teoría, respaldada por décadas de investigación clínica, que sostiene que el cuerpo recuerda lo que la mente prefiere olvidar. No de manera metafórica — literalmente. Las experiencias que se vivieron con una intensidad emocional suficiente dejan rastros en el sistema nervioso: en la manera en que los músculos responden a ciertos estímulos, en los umbrales de activación del sistema de alarma interno, en los patrones de respiración que se establecen sin que nadie los haya decidido conscientemente.

El psiquiatra Bessel van der Kolk lo formuló así: "El cuerpo lleva la cuenta." Lo que esto implica es que el tratamiento de ciertas experiencias difíciles no puede reducirse únicamente al lenguaje — a hablar de lo que ocurrió hasta que se entienda y se integre. Porque aquello que el cuerpo recuerda no siempre puede decirse con palabras; a veces solo puede moverse, respirarse, silenciarse.

Esto tiene consecuencias para la manera en que se escribe sobre el trauma. La escritura que más eficazmente lo representa no es la que lo explica sino la que lo encarna: la que produce en el lector algo parecido a lo que se produce en el cuerpo cuando se recuerda. No descripción sino resonancia.

Hay escritores que lo han conseguido sin haberlo teorizado jamás. Hay otros que lo teorizan y no lo consiguen. La distancia entre saber cómo funciona algo y poder hacerlo es una de las más interesantes que existen.`,
    languageFeatures: {
      grammar: [
        'passive_voice_es',
        'relative_clauses_que',
        'impersonal_se',
        'reported_speech_es',
        'subjunctive_noun_clause',
        'imperfect_subjunctive',
        'idiomatic_register',
      ],
      vocabulary: {
        keywords: ['respaldada', 'clínica', 'estímulos', 'umbrales', 'activación', 'conscientemente', 'encarna', 'resonancia', 'teorizado'],
        requiredVocabSize: 150,
      },
      structures: [
        'Passive: respaldada por décadas, lo formuló así, puede reducirse, puede moverse',
        'Reported speech: lo formuló así: "El cuerpo lleva la cuenta." + embedded what-clause',
        'Subjunctive: no puede reducirse a que se hable, lo que ocurrió hasta que se entienda',
        'Idiomatic register: llevar la cuenta, a fin de cuentas, sin haberlo teorizado jamás (C1 fixed expressions)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedB2C1Content() {
  console.log('🌱 Seeding B2/C1 content set (difficulty 6.5–8.0)...');
  console.log('   10 sophisticated text passages for upper-intermediate to advanced learners');
  console.log('   Registers: opinion essay, cultural commentary, narrative journalism, literary prose');
  console.log('   Features: subjunctive (noun/adverbial/doubt), pluperfect, conditional_perfect,');
  console.log('             passive_voice, reported_speech, imperfect_subjunctive, idiomatic_register');
  console.log(`   ${b2c1Content.length} total items at difficulty 6.5–8.0\n`);

  try {
    const inserted = await db.insert(contentItems).values(b2c1Content).returning();
    console.log(`✅ Seeded ${inserted.length} B2/C1 content items.`);
    console.log('\n   These appear in Deep Fog for users at B1–B2 level (including your current level).');
  } catch (error) {
    console.error('❌ Failed to seed B2/C1 content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedB2C1Content();
