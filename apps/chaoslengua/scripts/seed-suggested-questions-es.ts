// scripts/seed-suggested-questions-es.ts
// ChaosLengua — suggested questions for the Ask Tutor page
//
// Weighted toward the four Stage 1 target patterns (ser/estar,
// preterite/imperfect, por/para, object pronouns) since those are
// ChaosLengua's pedagogical priorities. A1 questions cover gaps
// plateau-breakers often have; B1+ extends beyond Stage 1.
//
// Usage: npx tsx scripts/seed-suggested-questions-es.ts

import { db } from '@/lib/db';
import { suggestedQuestions } from '@/lib/db/schema';
import type { NewSuggestedQuestion } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const questions: NewSuggestedQuestion[] = [
  // ═══════════════════════════════════════
  // A1 — Refresher gaps plateau-breakers often still have
  // ═══════════════════════════════════════
  {
    question: 'What are the most common Spanish greetings?',
    category: 'vocabulary',
    cefrLevel: 'A1',
    isActive: true,
    sortOrder: 1,
  },
  {
    question: 'How do I conjugate regular -ar, -er, and -ir verbs in the present tense?',
    category: 'grammar',
    cefrLevel: 'A1',
    isActive: true,
    sortOrder: 2,
  },
  {
    question: 'Why do I say "tengo hambre" and not "soy hambre"?',
    category: 'grammar',
    cefrLevel: 'A1',
    isActive: true,
    sortOrder: 3,
  },
  {
    question: 'How does the "gustar" construction work? Why do I say "me gustan los libros"?',
    category: 'grammar',
    cefrLevel: 'A1',
    isActive: true,
    sortOrder: 4,
  },

  // ═══════════════════════════════════════
  // A2 — Stage 1 target patterns (heavy focus)
  // ═══════════════════════════════════════
  {
    question: "What's the difference between ser and estar?",
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 10,
  },
  {
    question: 'Why does "es aburrido" mean something different from "está aburrido"?',
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 11,
  },
  {
    question: "When do I use the preterite vs the imperfect? They both mean 'past' in English!",
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 12,
  },
  {
    question: "What's the difference between por and para? They both mean 'for'!",
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 13,
  },
  {
    question: 'Where do object pronouns go in Spanish sentences?',
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 14,
  },
  {
    question: 'Why does "le" sometimes become "se" when I use two object pronouns together?',
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 15,
  },
  {
    question: 'How do I know the gender of Spanish nouns?',
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 16,
  },
  {
    question: 'What are common false cognates between English and Spanish?',
    category: 'vocabulary',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 17,
  },
  {
    question: 'How do I talk about the weather in Spanish? Why is it "hace frío" and not "es frío"?',
    category: 'grammar',
    cefrLevel: 'A2',
    isActive: true,
    sortOrder: 18,
  },

  // ═══════════════════════════════════════
  // B1 — Subjunctive introduction, regional variation
  // ═══════════════════════════════════════
  {
    question: 'When do I use the subjunctive mood? What triggers it?',
    category: 'grammar',
    cefrLevel: 'B1',
    isActive: true,
    sortOrder: 20,
  },
  {
    question: "What's the difference between 'sabía' and 'supe'? They're both 'knew', right?",
    category: 'grammar',
    cefrLevel: 'B1',
    isActive: true,
    sortOrder: 21,
  },
  {
    question: 'How is Spanish different in Spain vs Mexico vs Argentina?',
    category: 'culture',
    cefrLevel: 'B1',
    isActive: true,
    sortOrder: 22,
  },
  {
    question: "What is voseo? Why do Argentines say 'vos tenés' instead of 'tú tienes'?",
    category: 'culture',
    cefrLevel: 'B1',
    isActive: true,
    sortOrder: 23,
  },
  {
    question: 'How do I express hypothetical situations? (What would you do if...)',
    category: 'grammar',
    cefrLevel: 'B1',
    isActive: true,
    sortOrder: 24,
  },

  // ═══════════════════════════════════════
  // B2 — Upper intermediate
  // ═══════════════════════════════════════
  {
    question: 'When do I use the subjunctive in adverbial clauses with cuando, aunque, para que?',
    category: 'grammar',
    cefrLevel: 'B2',
    isActive: true,
    sortOrder: 30,
  },
  {
    question: 'What is the imperfect subjunctive and when do I use it?',
    category: 'grammar',
    cefrLevel: 'B2',
    isActive: true,
    sortOrder: 31,
  },
  {
    question: 'What are some common Spanish idioms I should know?',
    category: 'culture',
    cefrLevel: 'B2',
    isActive: true,
    sortOrder: 32,
  },
  {
    question: "What's the difference between 'se' for passive, impersonal, and reflexive uses?",
    category: 'grammar',
    cefrLevel: 'B2',
    isActive: true,
    sortOrder: 33,
  },

  // ═══════════════════════════════════════
  // C1 — Advanced
  // ═══════════════════════════════════════
  {
    question: 'How do I shift between formal and informal registers in Spanish?',
    category: 'culture',
    cefrLevel: 'C1',
    isActive: true,
    sortOrder: 40,
  },
  {
    question: "What's the subtle difference between 'deber' and 'tener que' and 'hay que'?",
    category: 'grammar',
    cefrLevel: 'C1',
    isActive: true,
    sortOrder: 41,
  },
  {
    question: 'How do aspect and tense interact in complex narrative writing?',
    category: 'grammar',
    cefrLevel: 'C1',
    isActive: true,
    sortOrder: 42,
  },

  // ═══════════════════════════════════════
  // C2 — Mastery
  // ═══════════════════════════════════════
  {
    question: 'How has the Real Academia Española approached anglicisms in recent years?',
    category: 'culture',
    cefrLevel: 'C2',
    isActive: true,
    sortOrder: 50,
  },
  {
    question: 'What literary tenses appear in classical Spanish literature that I should recognize?',
    category: 'grammar',
    cefrLevel: 'C2',
    isActive: true,
    sortOrder: 51,
  },
];

async function seedSuggestedQuestions() {
  console.log('❓ Seeding Spanish suggested questions...');
  const byLevel: Record<string, number> = {};
  for (const q of questions) {
    const lvl = q.cefrLevel || 'null';
    byLevel[lvl] = (byLevel[lvl] || 0) + 1;
  }
  for (const [level, count] of Object.entries(byLevel).sort()) {
    console.log(`   ${level}: ${count} questions`);
  }
  console.log(`   ${questions.length} total\n`);

  try {
    await db.insert(suggestedQuestions).values(questions);
    console.log('✅ Suggested questions seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed suggested questions:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedSuggestedQuestions();
