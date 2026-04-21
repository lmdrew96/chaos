// scripts/seed-reading-questions-es.ts
// ChaosLengua — Spanish reading comprehension questions for onboarding diagnostic
//
// Used by the initial proficiency assessment to place learners in the correct
// curriculum stage. Questions span A1 → C1 so learners across the range can
// demonstrate their level.
//
// Focus: A2 and B1 passages (our plateau-breaker target audience).
// A2 passages use present tense + basic past; B1 introduces subjunctive
// triggers, richer vocabulary, and more complex discourse.
//
// Usage: npx tsx scripts/seed-reading-questions-es.ts

import { db } from '@/lib/db';
import { readingQuestions } from '@/lib/db/schema';
import type { NewReadingQuestion } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const questions: NewReadingQuestion[] = [
  // ═══════════════════════════════════════
  // A1 — Safety floor (3 passages)
  // ═══════════════════════════════════════
  {
    level: 'A1',
    passage: 'Hola, me llamo Lucía. Soy de Argentina, pero ahora vivo en México. Tengo veinticinco años y trabajo en una oficina. Me gusta mucho leer y escuchar música.',
    question: '¿Dónde vive Lucía ahora?',
    options: ['En Argentina', 'En México', 'En España', 'En una oficina'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    level: 'A1',
    passage: 'Mi familia es pequeña. Tengo un hermano que se llama Daniel. Mis padres viven en Madrid. Los fines de semana comemos juntos en casa de mis abuelos.',
    question: '¿Dónde comen los fines de semana?',
    options: ['En un restaurante', 'En casa de los padres', 'En casa de los abuelos', 'En la escuela'],
    correctIndex: 2,
    isActive: true,
    sortOrder: 2,
  },
  {
    level: 'A1',
    passage: 'Por la mañana tomo café con leche y pan con mantequilla. No como mucho en el desayuno. Al mediodía como arroz, pollo y verduras. La cena siempre es ligera: una sopa o una ensalada.',
    question: '¿Qué come la persona en el almuerzo?',
    options: ['Café y pan', 'Arroz, pollo y verduras', 'Una sopa ligera', 'Una ensalada'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 3,
  },

  // ═══════════════════════════════════════
  // A2 — Primary target level (5 passages)
  // ═══════════════════════════════════════
  {
    level: 'A2',
    passage: 'El verano pasado fui a Perú con mis amigos. Estuvimos diez días visitando Cusco y Machu Picchu. Fue un viaje increíble. Todos los días caminábamos mucho y comíamos comida local. Una noche nos perdimos buscando el hotel, pero un señor muy amable nos ayudó. Volveré el próximo año.',
    question: '¿Por qué dice la persona que fue un viaje increíble?',
    options: ['Porque se perdieron una noche', 'Porque conoció Cusco y Machu Picchu y comió comida local', 'Porque el hotel era muy bueno', 'Porque fue solo'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 10,
  },
  {
    level: 'A2',
    passage: 'Mi hermana está muy cansada esta semana. Trabaja mucho en la oficina y por la noche estudia para un examen importante. Ayer se durmió en el sofá a las ocho. Creo que necesita unas vacaciones.',
    question: '¿Por qué se durmió la hermana en el sofá?',
    options: ['Porque es aburrida', 'Porque está cansada por trabajar y estudiar', 'Porque no le gusta su cama', 'Porque estaba de vacaciones'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 11,
  },
  {
    level: 'A2',
    passage: 'Carlos siempre llega tarde a las reuniones. Sus colegas ya no se sorprenden, pero su jefe está empezando a perder la paciencia. Ayer la reunión era a las nueve y Carlos llegó a las nueve y media. Su jefe no dijo nada, pero todos notaron su cara de frustración.',
    question: '¿Cómo reaccionó el jefe cuando Carlos llegó tarde?',
    options: ['Le gritó mucho', 'No dijo nada pero estaba frustrado', 'Lo felicitó', 'Se fue de la reunión'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 12,
  },
  {
    level: 'A2',
    passage: 'Aprender un nuevo idioma no es fácil, pero es muy útil. Cuando era niña, mis padres me llevaron a vivir a otro país durante dos años. Al principio no entendía nada y me sentía muy sola. Después de unos meses empecé a entender a mis compañeros y hacer amigos. Ahora, veinte años después, todavía hablo ese idioma.',
    question: '¿Cómo se sentía la persona al principio en el nuevo país?',
    options: ['Contenta y emocionada', 'Sola y sin entender nada', 'Orgullosa de sus amigos', 'Cansada de los idiomas'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 13,
  },
  {
    level: 'A2',
    passage: 'Para Marta, la cocina es un lugar especial. Cada domingo prepara comida para toda la semana: guisos, sopas, ensaladas. Dice que cocinar la relaja después de una semana difícil. Sus amigos piensan que es una exageración, pero Marta no escucha. Para ella, los domingos sin cocinar no son domingos.',
    question: 'Según el texto, ¿qué piensa Marta sobre cocinar?',
    options: ['Es una obligación aburrida', 'Es una actividad que la relaja', 'Es solo para los amigos', 'Es mejor hacerlo entre semana'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 14,
  },

  // ═══════════════════════════════════════
  // B1 — Stretch level (5 passages)
  // ═══════════════════════════════════════
  {
    level: 'B1',
    passage: 'Cuando era adolescente, quería ser médica. Estudié biología en la universidad y, aunque me gustaban las clases, pronto me di cuenta de que no quería pasar mi vida en un hospital. Decidí cambiar de carrera y estudié periodismo. Ahora escribo sobre ciencia para un periódico importante. Es curioso: aunque no soy médica, mi formación científica me ayuda cada día en mi trabajo. A veces los caminos indirectos llevan al mejor lugar.',
    question: '¿Qué mensaje transmite el texto sobre la trayectoria profesional de la persona?',
    options: ['Que es mejor nunca cambiar de carrera', 'Que la formación previa puede ser útil aunque cambies de dirección', 'Que el periodismo es mejor que la medicina', 'Que siempre supo que quería ser periodista'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 20,
  },
  {
    level: 'B1',
    passage: 'El tráfico en las grandes ciudades latinoamericanas se ha convertido en un problema crítico. Aunque los gobiernos invierten en nuevas líneas de metro y sistemas de autobuses, el número de coches particulares sigue creciendo. Los expertos dicen que no podremos resolver el problema hasta que la gente deje de depender tanto del coche privado. Pero cambiar esa costumbre es difícil. En muchas ciudades, el transporte público todavía no es suficientemente eficiente, y la gente prefiere la comodidad del coche propio, aunque pase horas en atascos.',
    question: 'Según el texto, ¿cuál es el principal obstáculo para resolver el problema del tráfico?',
    options: ['La falta de inversión de los gobiernos', 'La dependencia cultural del coche privado combinada con un transporte público insuficiente', 'La mala calidad de los autobuses', 'La velocidad a la que crecen las ciudades'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 21,
  },
  {
    level: 'B1',
    passage: 'No creo que haya una sola manera correcta de aprender un idioma. Durante años pensé que la única forma era estudiar gramática, memorizar listas de vocabulario y hacer ejercicios. Cuando empecé a ver series en español sin subtítulos, al principio me frustré porque no entendía casi nada. Pero poco a poco, mi cerebro empezó a captar patrones, ritmos, expresiones. Hoy sigo estudiando gramática, pero también veo mucha televisión. Los dos caminos son necesarios.',
    question: '¿Qué opinión expresa el autor sobre aprender idiomas?',
    options: ['Solo importa estudiar gramática', 'Es mejor solo ver televisión', 'Tanto el estudio formal como la exposición natural son necesarios', 'Es imposible aprender un idioma sin un profesor'],
    correctIndex: 2,
    isActive: true,
    sortOrder: 22,
  },
  {
    level: 'B1',
    passage: 'Cuando mi abuela era joven, en su pueblo no había electricidad después de las diez de la noche. La gente se acostaba temprano y se despertaba con el sol. Ella me cuenta que, aunque la vida era más dura en muchos aspectos, también era más tranquila. Hoy, con nuestros teléfonos y pantallas, nunca estamos realmente desconectados. A veces envidio ese ritmo antiguo, aunque sé que no querría vivir sin todas las comodidades modernas.',
    question: '¿Qué sentimiento predomina en el texto?',
    options: ['Rechazo total a la tecnología moderna', 'Nostalgia por un ritmo de vida más lento, con reconocimiento de las comodidades actuales', 'Alegría por los avances modernos', 'Indiferencia hacia el pasado'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 23,
  },
  {
    level: 'B1',
    passage: 'La semana pasada, un amigo me pidió que le recomendara un libro. No sabía qué decirle. Hay tantos libros que me gustan por razones diferentes que elegir uno solo me pareció imposible. Finalmente le dije que lo mejor era que explorara él mismo, que leyera las primeras páginas de varios libros en una librería y confiara en su intuición. Me miró como si le hubiera dado la peor respuesta del mundo. Quizás tenía razón y debería haber elegido uno. Pero para mí, las mejores lecturas siempre son las que uno descubre por su cuenta.',
    question: '¿Por qué el autor no le recomendó un libro específico a su amigo?',
    options: ['Porque no lee mucho', 'Porque considera que cada persona debe descubrir sus propios libros', 'Porque no confiaba en su amigo', 'Porque su amigo ya había leído muchos libros'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 24,
  },

  // ═══════════════════════════════════════
  // B2 — Upper intermediate (3 passages)
  // ═══════════════════════════════════════
  {
    level: 'B2',
    passage: 'El auge de las redes sociales ha transformado el periodismo de maneras que pocos previeron hace veinte años. Por un lado, la información circula a una velocidad sin precedentes: un evento en cualquier rincón del mundo puede ser conocido globalmente en minutos. Por otro lado, la calidad del periodismo se ha visto comprometida por la presión de la inmediatez y por los modelos de negocio que priorizan los clics sobre el análisis profundo. Lo más preocupante no es la pérdida de rigor en sí misma, sino que muchos lectores ya no distinguen entre un artículo meticulosamente investigado y un contenido superficial diseñado para generar tráfico.',
    question: 'Según el autor, ¿cuál es el efecto más preocupante de las redes sociales sobre el periodismo?',
    options: ['Que la información circula demasiado rápido', 'Que los lectores han perdido la capacidad de distinguir el periodismo riguroso del contenido superficial', 'Que los periódicos ganan menos dinero', 'Que ya no existen periodistas profesionales'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 30,
  },
  {
    level: 'B2',
    passage: 'Cuando era estudiante universitaria, pasé un semestre en Salamanca. Lo que más me impactó no fueron los monumentos ni la vida nocturna, sino la manera en que los españoles hablaban entre sí: rápido, con interrupciones constantes, con una familiaridad que a mí, viniendo de una cultura más formal, me desconcertaba al principio. Me costó meses entender que esas interrupciones no eran una falta de respeto, sino una forma de participar activamente en la conversación. Años después, cuando he vuelto a visitar España, he notado que esa manera de hablar me resulta natural. Uno no se da cuenta de cuánto nos transforman los lugares hasta que los deja.',
    question: '¿Qué reflexión principal propone el texto?',
    options: ['Que Salamanca es la ciudad más interesante de España', 'Que las diferencias culturales son insuperables', 'Que los lugares nos transforman de maneras que solo reconocemos cuando nos alejamos de ellos', 'Que los españoles son maleducados al interrumpir'],
    correctIndex: 2,
    isActive: true,
    sortOrder: 31,
  },
  {
    level: 'B2',
    passage: 'La Real Academia Española aceptó recientemente términos que hace una década habrían sido considerados anglicismos inaceptables. Esta decisión ha generado un debate intenso entre lingüistas, escritores y hablantes comunes. Algunos argumentan que la lengua debe evolucionar con sus hablantes y que rechazar préstamos útiles es un purismo inútil. Otros sostienen que aceptar términos extranjeros cuando ya existen equivalentes en español empobrece el idioma y refleja una rendición cultural ante el inglés. Lo interesante es que ambos bandos coinciden en un punto: la vitalidad del español no se mide por cuántos extranjerismos incorpora, sino por la creatividad con que sus hablantes los integran o los rechazan.',
    question: 'Según el texto, ¿en qué están de acuerdo los dos bandos del debate?',
    options: ['En que la RAE nunca debe aceptar anglicismos', 'En que la vitalidad del español se mide por la creatividad de sus hablantes, no por cuántos términos extranjeros adopta', 'En que el español debe convertirse en inglés', 'En que los lingüistas son inútiles'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 32,
  },

  // ═══════════════════════════════════════
  // C1 — Advanced (2 passages)
  // ═══════════════════════════════════════
  {
    level: 'C1',
    passage: 'La memoria colectiva, como ha señalado repetidamente la historiadora Elizabeth Jelin, no es un repositorio neutral de hechos pasados, sino una construcción activa que se negocia constantemente entre actores con intereses contrapuestos. Cada generación rescribe su relación con la historia a partir de las urgencias de su presente, lo que explica por qué un mismo acontecimiento puede ser venerado en una época y cuestionado en la siguiente. Esta plasticidad no debería entenderse como una debilidad del conocimiento histórico, sino como una condición de su vitalidad. Una memoria que no se interroga a sí misma se osifica; una que se interroga en exceso corre el riesgo de perder todo anclaje. El equilibrio, como suele ocurrir en estas cuestiones, es tan esencial como inestable.',
    question: '¿Cuál es la idea central del texto?',
    options: ['Que la memoria colectiva es objetiva y no debe cambiar', 'Que la memoria colectiva se construye y reconstruye activamente, y este proceso es tanto inevitable como valioso, aunque requiere un equilibrio delicado', 'Que los historiadores manipulan el pasado', 'Que cada generación inventa una historia completamente nueva'],
    correctIndex: 1,
    isActive: true,
    sortOrder: 40,
  },
  {
    level: 'C1',
    passage: 'Hay un fenómeno curioso en la literatura contemporánea hispanoamericana: aunque la generación de los escritores nacidos después de 1980 ha rechazado explícitamente los rasgos más reconocibles del boom —el realismo mágico, la ambición totalizante, el narrador omnisciente—, ha heredado de aquellos autores una obsesión que se creía superada: la convicción de que la literatura puede y debe ocuparse de la política, entendida no como panfleto, sino como indagación en las estructuras de poder que vertebran la vida cotidiana. La diferencia es de método, no de vocación. Donde Vargas Llosa construía frescos colectivos, los autores actuales prefieren el retrato íntimo; donde García Márquez mitificaba, ellos desmontan; donde Fuentes sintetizaba, ellos fragmentan. Pero el impulso de fondo —el de que leer sirve para entender cómo vivimos y, eventualmente, cómo podríamos vivir de otra manera— persiste con una tenacidad que sorprendería a quienes pensaron que la desconfianza postmoderna había enterrado para siempre la literatura comprometida.',
    question: '¿Qué tesis defiende el autor sobre la literatura hispanoamericana contemporánea?',
    options: ['Que ha abandonado por completo las preocupaciones de la generación del boom', 'Que es exactamente igual a la literatura del boom', 'Que rechaza los métodos del boom pero mantiene su vocación política, aunque ejercida de maneras diferentes', 'Que es apolítica en comparación con la del boom'],
    correctIndex: 2,
    isActive: true,
    sortOrder: 41,
  },
];

async function seedReadingQuestions() {
  console.log('📖 Seeding Spanish reading comprehension questions...');
  const byLevel: Record<string, number> = {};
  for (const q of questions) {
    byLevel[q.level] = (byLevel[q.level] || 0) + 1;
  }
  for (const [level, count] of Object.entries(byLevel).sort()) {
    console.log(`   ${level}: ${count} passages`);
  }
  console.log(`   ${questions.length} total\n`);

  try {
    await db.insert(readingQuestions).values(questions);
    console.log('✅ Reading questions seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed reading questions:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedReadingQuestions();
