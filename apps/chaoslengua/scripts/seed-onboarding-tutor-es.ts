/**
 * Seed Spanish onboarding + Ask Tutor infrastructure.
 *
 * Tables: tutor_opening_messages, suggested_questions, reading_questions
 *
 * Idempotent: wipes and reseeds. Safe to re-run.
 *
 * Per chaoslengua tutor language model:
 * - Onboarding tutor speaks L1 (English) 95%+ with L2 (Spanish) sprinkles
 * - Production surfaces (Ask Tutor) use questions that reference L2 concepts inline
 * - NEVER L2 sentence + L1 translation in parens
 *
 * Usage: npx tsx scripts/seed-onboarding-tutor-es.ts
 */
import { db } from '@/lib/db';
import {
  tutorOpeningMessages,
  suggestedQuestions,
  readingQuestions,
} from '@/lib/db/schema';
import type {
  NewTutorOpeningMessage,
  NewSuggestedQuestion,
  NewReadingQuestion,
} from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// ─── Tutor opening messages (4 — one per self-assessment key) ───

const TUTOR_OPENINGS: NewTutorOpeningMessage[] = [
  {
    selfAssessmentKey: 'complete_beginner',
    message:
      "¡Hola! I'm so glad you're here. Spanish is going to be a wild adventure, and you're starting at the perfect time — no pressure, no streaks, just exploration. We'll begin with the foundations and let your brain build patterns naturally. Ready to dip in?",
  },
  {
    selfAssessmentKey: 'some_basics',
    message:
      "¡Hola! You've got some Spanish in your back pocket already — that's a great place to be. Let's find where the gaps live and turn your weak spots into your curriculum. Spanish has some beautiful patterns waiting for you.",
  },
  {
    selfAssessmentKey: 'intermediate',
    message:
      "¡Hola! Intermediate is where the fun grammar lives — ser vs estar, preterite vs imperfect, all the stuff that makes Spanish feel real. Let's poke at the corners of your Spanish and see what's been quietly fossilizing.",
  },
  {
    selfAssessmentKey: 'advanced',
    message:
      "¡Hola! Welcome to the chaos. At your level, the gains come from precision and nuance — the subtle differences that even advanced learners miss. Let's hunt for those edges together.",
  },
];

// ─── Suggested questions for Ask Tutor (~36, distributed A1-C2) ───

const SUGGESTED: NewSuggestedQuestion[] = [
  // A1 — Beginner basics
  { question: 'How do I introduce myself in Spanish?', category: 'grammar', cefrLevel: 'A1', sortOrder: 1 },
  { question: 'What are the most common Spanish greetings?', category: 'vocabulary', cefrLevel: 'A1', sortOrder: 2 },
  { question: 'How does grammatical gender work in Spanish?', category: 'grammar', cefrLevel: 'A1', sortOrder: 3 },
  { question: 'How do I count from 1 to 100 in Spanish?', category: 'vocabulary', cefrLevel: 'A1', sortOrder: 4 },
  { question: "What's the difference between un/una and el/la?", category: 'grammar', cefrLevel: 'A1', sortOrder: 5 },
  { question: 'How do I conjugate the verb ser in the present tense?', category: 'grammar', cefrLevel: 'A1', sortOrder: 6 },

  // A2 — Elementary
  { question: 'When do I use ser vs estar?', category: 'grammar', cefrLevel: 'A2', sortOrder: 7 },
  { question: 'How does the present tense work for regular -ar, -er, -ir verbs?', category: 'grammar', cefrLevel: 'A2', sortOrder: 8 },
  { question: 'How do I order food in a Spanish-speaking restaurant?', category: 'vocabulary', cefrLevel: 'A2', sortOrder: 9 },
  { question: 'How do I tell time in Spanish?', category: 'grammar', cefrLevel: 'A2', sortOrder: 10 },
  { question: "Why do I say soy de Madrid instead of just I'm from Madrid?", category: 'grammar', cefrLevel: 'A2', sortOrder: 11 },
  { question: 'How do I form the gerund (-ando/-iendo) and use estar + gerund?', category: 'grammar', cefrLevel: 'A2', sortOrder: 12 },
  { question: 'What are the days of the week and months in Spanish?', category: 'vocabulary', cefrLevel: 'A2', sortOrder: 13 },

  // B1 — Intermediate
  { question: "What's the difference between es aburrido and está aburrido?", category: 'grammar', cefrLevel: 'B1', sortOrder: 14 },
  { question: 'When do I use the preterite vs the imperfect?', category: 'grammar', cefrLevel: 'B1', sortOrder: 15 },
  { question: 'How do direct object pronouns (lo, la, los, las) work in Spanish?', category: 'grammar', cefrLevel: 'B1', sortOrder: 16 },
  { question: "What's the difference between conocí and conocía?", category: 'grammar', cefrLevel: 'B1', sortOrder: 17 },
  { question: 'When does le/les become se before a direct object pronoun?', category: 'grammar', cefrLevel: 'B1', sortOrder: 18 },
  { question: 'What are some common Spanish idioms about food?', category: 'vocabulary', cefrLevel: 'B1', sortOrder: 19 },
  { question: 'How do greetings differ between Spain and Latin America?', category: 'culture', cefrLevel: 'B1', sortOrder: 20 },

  // B2 — Upper Intermediate
  { question: 'When do I use the subjunctive in Spanish?', category: 'grammar', cefrLevel: 'B2', sortOrder: 21 },
  { question: 'How does the conditional tense work?', category: 'grammar', cefrLevel: 'B2', sortOrder: 22 },
  { question: "What's the difference between por and para?", category: 'grammar', cefrLevel: 'B2', sortOrder: 23 },
  { question: 'How does the present perfect (he comido) differ from the preterite (comí)?', category: 'grammar', cefrLevel: 'B2', sortOrder: 24 },
  { question: 'How does the imperative (commands) work, including negative commands?', category: 'grammar', cefrLevel: 'B2', sortOrder: 25 },
  { question: "Why do Spaniards use vosotros but Latin Americans don't?", category: 'culture', cefrLevel: 'B2', sortOrder: 26 },

  // C1 — Advanced
  { question: 'What are the subtle aspect differences between Spanish and English past tenses?', category: 'grammar', cefrLevel: 'C1', sortOrder: 27 },
  { question: 'When is the future subjunctive used in modern Spanish?', category: 'grammar', cefrLevel: 'C1', sortOrder: 28 },
  { question: 'How do formal and informal registers differ in Spanish writing?', category: 'culture', cefrLevel: 'C1', sortOrder: 29 },
  { question: "What's the difference between iría and fuera in conditional clauses?", category: 'grammar', cefrLevel: 'C1', sortOrder: 30 },
  { question: 'How does voseo work in Argentine and Uruguayan Spanish?', category: 'culture', cefrLevel: 'C1', sortOrder: 31 },

  // C2 — Mastery
  { question: 'What literary tenses appear in classical Spanish literature?', category: 'grammar', cefrLevel: 'C2', sortOrder: 32 },
  { question: 'How has Spanish evolved from Vulgar Latin compared to other Romance languages?', category: 'culture', cefrLevel: 'C2', sortOrder: 33 },
  { question: 'What are some advanced uses of the subjunctive in subordinate clauses?', category: 'grammar', cefrLevel: 'C2', sortOrder: 34 },
  { question: 'How do dialectal differences affect Spanish news media and journalism?', category: 'culture', cefrLevel: 'C2', sortOrder: 35 },
  { question: "What's the role of clitic doubling (a María le di el libro) in formal Spanish?", category: 'grammar', cefrLevel: 'C2', sortOrder: 36 },
];

// ─── Reading questions for onboarding placement (24, A1-C1) ───
// Passages in Spanish; questions/options in English so an A1 learner can
// engage with placement before the system knows their level.

const READINGS: NewReadingQuestion[] = [
  // A1 — short, simple comprehension
  {
    level: 'A1',
    passage: 'María es estudiante. Tiene veinte años. Vive en Madrid con su familia.',
    question: 'Where does María live?',
    options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'],
    correctIndex: 1,
    sortOrder: 1,
  },
  {
    level: 'A1',
    passage: 'Hola, me llamo Juan. Soy de México. Hablo español e inglés.',
    question: "What is Juan's nationality?",
    options: ['Spanish', 'Mexican', 'American', 'Argentine'],
    correctIndex: 1,
    sortOrder: 2,
  },
  {
    level: 'A1',
    passage: 'El gato está en la cocina. Tiene hambre. Quiere comer pescado.',
    question: 'Where is the cat?',
    options: ['The bedroom', 'The garden', 'The kitchen', 'The bathroom'],
    correctIndex: 2,
    sortOrder: 3,
  },
  {
    level: 'A1',
    passage: 'Mi madre es doctora. Trabaja en el hospital. Es muy amable.',
    question: "What is the mother's profession?",
    options: ['Teacher', 'Doctor', 'Nurse', 'Engineer'],
    correctIndex: 1,
    sortOrder: 4,
  },
  {
    level: 'A1',
    passage: 'Hoy es lunes. Mañana es martes. El fin de semana es sábado y domingo.',
    question: 'What day is it today?',
    options: ['Sunday', 'Monday', 'Tuesday', 'Saturday'],
    correctIndex: 1,
    sortOrder: 5,
  },
  {
    level: 'A1',
    passage: 'En la mesa hay un libro, dos manzanas y una taza de café.',
    question: 'How many apples are on the table?',
    options: ['One', 'Two', 'Three', 'Four'],
    correctIndex: 1,
    sortOrder: 6,
  },

  // A2 — slightly longer, basic past tense + descriptions
  {
    level: 'A2',
    passage:
      'Cuando era niña, jugaba con mis amigos en el parque todos los días. Nos divertíamos mucho. Ahora soy adulta y echo de menos esos tiempos.',
    question: 'How does the narrator feel about her childhood now?',
    options: [
      'She still plays in the park every day',
      'She has forgotten her childhood',
      'She misses those times',
      'She lives in a different country',
    ],
    correctIndex: 2,
    sortOrder: 7,
  },
  {
    level: 'A2',
    passage:
      'Ayer fui al supermercado. Compré pan, leche y frutas. Después, preparé la cena para mi familia.',
    question: 'What did the narrator do yesterday after shopping?',
    options: [
      'Went to the gym',
      'Prepared dinner for the family',
      'Watched TV',
      'Called a friend',
    ],
    correctIndex: 1,
    sortOrder: 8,
  },
  {
    level: 'A2',
    passage:
      'Madrid es una ciudad muy grande. Está en el centro de España. Tiene museos famosos, parques bonitos y mucha vida nocturna.',
    question: 'Which of these is mentioned about Madrid?',
    options: [
      "It's by the ocean",
      'It has famous museums',
      "It's the smallest city in Spain",
      'It has no parks',
    ],
    correctIndex: 1,
    sortOrder: 9,
  },
  {
    level: 'A2',
    passage:
      'Mi hermano está enfermo hoy. Tiene fiebre y le duele la cabeza. Va a ir al médico esta tarde.',
    question: 'What is wrong with the brother?',
    options: ['He is hungry', 'He is tired', 'He has a fever and headache', 'He is bored'],
    correctIndex: 2,
    sortOrder: 10,
  },
  {
    level: 'A2',
    passage:
      'Los domingos voy al café con mi mejor amiga. Hablamos durante horas y tomamos chocolate caliente.',
    question: 'What do they drink at the café?',
    options: ['Coffee', 'Tea', 'Hot chocolate', 'Juice'],
    correctIndex: 2,
    sortOrder: 11,
  },
  {
    level: 'A2',
    passage:
      'El invierno en Madrid es frío y a veces nieva. La gente lleva abrigos y bufandas para no tener frío.',
    question: 'What do people wear in winter in Madrid?',
    options: ['Shorts and t-shirts', 'Coats and scarves', 'Swimsuits', 'Sandals'],
    correctIndex: 1,
    sortOrder: 12,
  },

  // B1 — preterite/imperfect contrast, inference
  {
    level: 'B1',
    passage:
      'Cuando llegué a Barcelona por primera vez, no entendía nada. La gente hablaba muy rápido y usaba palabras que no había aprendido en clase. Pero después de unos meses, empecé a sentirme más cómodo.',
    question: 'What did the narrator experience when first arriving in Barcelona?',
    options: [
      'He immediately understood everyone',
      'He felt confused at first but adapted',
      'He never adjusted to the city',
      'He spoke Catalan fluently',
    ],
    correctIndex: 1,
    sortOrder: 13,
  },
  {
    level: 'B1',
    passage:
      'El restaurante estaba lleno cuando llegamos. La camarera nos dijo que tendríamos que esperar treinta minutos. Decidimos ir a un café cercano mientras tanto.',
    question: 'Why did they go to a nearby café?',
    options: [
      'The food was bad at the restaurant',
      'They had to wait 30 minutes for a table',
      "They didn't have a reservation",
      'They wanted dessert first',
    ],
    correctIndex: 1,
    sortOrder: 14,
  },
  {
    level: 'B1',
    passage:
      'María estudió toda la noche para el examen. Cuando entró al aula a la mañana siguiente, estaba cansada pero confiada. Sabía que había trabajado duro.',
    question: 'How did María feel when she entered the classroom?',
    options: ['Tired and worried', 'Tired but confident', 'Excited and energetic', 'Bored'],
    correctIndex: 1,
    sortOrder: 15,
  },
  {
    level: 'B1',
    passage:
      'El problema con vivir en una ciudad grande es el ruido. Por la noche, los coches y la música te impiden dormir. Por eso muchas personas prefieren mudarse al campo cuando tienen niños.',
    question: 'Why do many people move to the countryside when they have children?',
    options: [
      'The schools are better',
      'The food is cheaper',
      'The noise in cities prevents sleep',
      "There's more entertainment",
    ],
    correctIndex: 2,
    sortOrder: 16,
  },
  {
    level: 'B1',
    passage:
      'Cuando era pequeño, mis abuelos me contaban historias antes de dormir. Ahora que ellos ya no están, recuerdo esas historias con cariño y se las cuento a mis propios hijos.',
    question: 'What does the narrator now do with the stories his grandparents told him?',
    options: ['Forgets them', 'Writes them in a book', 'Tells them to his own children', 'Translates them to English'],
    correctIndex: 2,
    sortOrder: 17,
  },
  {
    level: 'B1',
    passage:
      'Aprender un idioma nuevo es difícil al principio. Cometes errores constantemente y sientes que nunca vas a hablar bien. Pero los errores son la única forma de mejorar — sin ellos, no hay aprendizaje.',
    question: 'What is the main message about errors when learning a language?',
    options: [
      'Errors should be avoided at all costs',
      'Errors are necessary for improvement',
      'Only beginners make errors',
      'Errors mean you should give up',
    ],
    correctIndex: 1,
    sortOrder: 18,
  },

  // B2 — subjunctive, conditional, complex inference
  {
    level: 'B2',
    passage:
      'Si hubiera sabido que el viaje era tan largo, habría traído un libro para leer. Ahora estoy aburrido y no tengo nada que hacer durante las próximas cuatro horas.',
    question: 'What does the narrator regret?',
    options: [
      'Coming on the trip at all',
      'Not bringing a book to read',
      'Forgetting his phone',
      'Eating too much before leaving',
    ],
    correctIndex: 1,
    sortOrder: 19,
  },
  {
    level: 'B2',
    passage:
      'Aunque el gobierno ha prometido reformas durante años, los cambios reales han sido mínimos. Los ciudadanos están cada vez más frustrados y muchos están considerando emigrar a otros países en busca de mejores oportunidades.',
    question: 'Why are citizens considering emigration?',
    options: [
      'The weather has worsened',
      "Promised reforms haven't materialized",
      'They want to learn other languages',
      'Their families live abroad',
    ],
    correctIndex: 1,
    sortOrder: 20,
  },
  {
    level: 'B2',
    passage:
      "El concepto de 'sobremesa' es muy español. Después de comer, la familia o los amigos se quedan en la mesa hablando durante horas, incluso cuando ya han terminado. No es solo una comida, es una experiencia social profunda.",
    question: "What does 'sobremesa' refer to?",
    options: [
      'A specific dish from Spain',
      'The conversation that continues after eating',
      'Eating dessert at the table',
      'Having a long lunch break',
    ],
    correctIndex: 1,
    sortOrder: 21,
  },
  {
    level: 'B2',
    passage:
      'Si yo fuera el director de la empresa, cambiaría muchas cosas. Trataría mejor a los empleados, ofrecería más flexibilidad y crearía un ambiente de trabajo más positivo. Lamentablemente, no soy el director.',
    question: 'What does the narrator imply about the current director?',
    options: [
      'The director is doing a great job',
      'The director treats employees well',
      "The director isn't making changes the narrator would make",
      'The director is also unhappy',
    ],
    correctIndex: 2,
    sortOrder: 22,
  },

  // C1 — register, regional variation, complex argument
  {
    level: 'C1',
    passage:
      'La generación actual de jóvenes hispanohablantes se enfrenta a un dilema lingüístico curioso: por un lado, el inglés domina en internet, en la música popular y en los negocios internacionales; por otro, hay un creciente movimiento que busca preservar y revalorizar las particularidades regionales del español, desde el voseo argentino hasta el seseo andaluz.',
    question: 'What dilemma does the passage describe?',
    options: [
      'Whether to learn English or Spanish first',
      'Tension between English dominance and preserving regional Spanish varieties',
      'Argentine vs Spanish music preferences',
      'Internet usage among young people',
    ],
    correctIndex: 1,
    sortOrder: 23,
  },
  {
    level: 'C1',
    passage:
      'Lo que más me sorprendió no fue tanto el contenido del libro, sino la forma en que la autora consigue tejer recuerdos personales con reflexiones filosóficas, sin que ninguno de los dos hilos parezca interrumpir al otro. Es una narrativa que demanda paciencia del lector, pero recompensa esa paciencia con creces.',
    question: 'What does the narrator most admire about the book?',
    options: [
      'The amount of philosophy',
      'The clarity of the personal memories',
      'The seamless interweaving of memoir and philosophy',
      'Its short length',
    ],
    correctIndex: 2,
    sortOrder: 24,
  },
];

async function seed() {
  console.log('🌱 Seeding Spanish onboarding + tutor infrastructure...\n');

  // ─── Tutor opening messages: upsert by selfAssessmentKey ───
  console.log(`📩 Tutor opening messages: ${TUTOR_OPENINGS.length} rows`);
  for (const m of TUTOR_OPENINGS) {
    await db
      .insert(tutorOpeningMessages)
      .values(m)
      .onConflictDoUpdate({
        target: tutorOpeningMessages.selfAssessmentKey,
        set: {
          message: m.message,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    console.log(`   ✓ ${m.selfAssessmentKey}`);
  }

  // ─── Suggested questions: wipe + reseed (no unique constraint) ───
  console.log(`\n💬 Suggested questions: wiping existing rows + inserting ${SUGGESTED.length}`);
  await db.delete(suggestedQuestions);
  await db.insert(suggestedQuestions).values(SUGGESTED);
  const byCefr = SUGGESTED.reduce<Record<string, number>>((acc, q) => {
    const k = q.cefrLevel ?? 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  console.log(`   By CEFR: ${JSON.stringify(byCefr)}`);

  // ─── Reading questions: wipe + reseed ───
  console.log(`\n📖 Reading questions: wiping existing rows + inserting ${READINGS.length}`);
  await db.delete(readingQuestions);
  await db.insert(readingQuestions).values(READINGS);
  const byLevel = READINGS.reduce<Record<string, number>>((acc, r) => {
    acc[r.level] = (acc[r.level] || 0) + 1;
    return acc;
  }, {});
  console.log(`   By level: ${JSON.stringify(byLevel)}`);

  console.log('\n✅ Onboarding + tutor seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
