// scripts/seed-grammar-features-b1-b2-es.ts
// ChaosLengua — B1/B2/C1 grammar feature keys for Spanish
//
// Extends grammar_feature_map with Stage 2/3 features referenced by
// the B1 and B2/C1 content seed scripts. These keys provide adaptation
// bridges for higher-level error patterns as learners progress past the
// A2→B1 plateau-breaker phenomena.
//
// B1 features (6): present_perfect_es, impersonal_se, relative_clauses_que,
//   conditional_simple, formal_commands_usted, subjunctive_present_intro
// B2 features (7): subjunctive_noun_clause, subjunctive_adverbial,
//   subjunctive_doubt_emotion, pluperfect_es, conditional_perfect_es,
//   passive_voice_es, reported_speech_es
// C1 features (2): imperfect_subjunctive, idiomatic_register
//
// Upsert-safe: re-running skips existing keys.

import { db } from '@/lib/db';
import { grammarFeatureMap, type NewGrammarFeature } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const b1b2Features: NewGrammarFeature[] = [
  // ── B1 ──────────────────────────────────────────────────────────
  {
    featureKey: 'present_perfect_es',
    featureName: 'Present Perfect (Pretérito Perfecto)',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Compound past with haber + participio: he comido, has vivido, han llegado. Used for past actions with present relevance or within a time frame including now.',
    sortOrder: 1,
  },
  {
    featureKey: 'impersonal_se',
    featureName: 'Impersonal and Passive Se',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Se dice, se puede, se venden, se habla. Removes agent — equivalent to English passive or "one/you/people" constructions.',
    sortOrder: 2,
  },
  {
    featureKey: 'relative_clauses_que',
    featureName: 'Relative Clauses with "que"',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Noun + que + clause: la persona que vino, el libro que leí, las calles que no conocía. Que is the all-purpose relative pronoun for both persons and things.',
    sortOrder: 3,
  },
  {
    featureKey: 'conditional_simple',
    featureName: 'Simple Conditional (Condicional Simple)',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Hypothetical or polite statements: hablaría, comería, viviría. Used for "would" in hypotheticals, polite requests, and speculation about the past.',
    sortOrder: 4,
  },
  {
    featureKey: 'formal_commands_usted',
    featureName: 'Formal Commands (Usted/Ustedes)',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Formal imperative using present subjunctive: hable, coma, viva, venga. Ustedes: hablen, coman. Used in professional, medical, service contexts.',
    sortOrder: 5,
  },
  {
    featureKey: 'subjunctive_present_intro',
    featureName: 'Present Subjunctive — First Exposure',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Introduction to present subjunctive in fixed/formulaic contexts: ojalá, quizás, tal vez, espero que, quiero que. Full conjugation paradigm not yet required.',
    sortOrder: 6,
  },

  // ── B2 ──────────────────────────────────────────────────────────
  {
    featureKey: 'subjunctive_noun_clause',
    featureName: 'Subjunctive in Noun Clauses',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'Verb of will/desire/preference/recommendation + que + subjunctive: quiero que vengas, me alegra que estés, es importante que sepas. Triggers: querer, pedir, recomendar, alegrarse, importar, etc.',
    sortOrder: 7,
  },
  {
    featureKey: 'subjunctive_adverbial',
    featureName: 'Subjunctive in Adverbial Clauses',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'Temporal/purpose/concessive clauses + subjunctive: para que, antes de que, cuando + future event, aunque + unknown. Contrast: cuando + past = indicative.',
    sortOrder: 8,
  },
  {
    featureKey: 'subjunctive_doubt_emotion',
    featureName: 'Subjunctive with Doubt and Emotion',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'Doubt verbs (dudar, no creer, no estar seguro) + subjunctive. Emotion verbs (sorprender, molestar, dar miedo) + que + subjunctive.',
    sortOrder: 9,
  },
  {
    featureKey: 'pluperfect_es',
    featureName: 'Pluperfect (Pretérito Pluscuamperfecto)',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'había + participio: había comido, habías llegado. Past-before-past — sequences events in a narrative where preterite is already anchoring the story.',
    sortOrder: 10,
  },
  {
    featureKey: 'conditional_perfect_es',
    featureName: 'Conditional Perfect (Condicional Compuesto)',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'habría + participio: habría hablado, habrías podido. Used for speculation about the past ("would have") and the result clause of past hypotheticals.',
    sortOrder: 11,
  },
  {
    featureKey: 'passive_voice_es',
    featureName: 'Passive Voice (Voz Pasiva)',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'ser + participio + por: el libro fue escrito por García Márquez. Agreement of participio with subject. Less common than se-passive in speech; more common in formal/written registers.',
    sortOrder: 12,
  },
  {
    featureKey: 'reported_speech_es',
    featureName: 'Reported Speech (Estilo Indirecto)',
    cefrLevel: 'B2',
    category: 'grammar',
    description: 'Backshift in reported speech: dijo que vendría (not vendrá), preguntó si había comido. Pronoun and tense shifts when embedding direct speech.',
    sortOrder: 13,
  },

  // ── C1 ──────────────────────────────────────────────────────────
  {
    featureKey: 'imperfect_subjunctive',
    featureName: 'Imperfect Subjunctive (Pretérito Imperfecto de Subjuntivo)',
    cefrLevel: 'C1',
    category: 'grammar',
    description: 'Past/hypothetical subjunctive: si tuviera dinero, quisiera pedirte algo, ojalá pudiera. The -ra and -se forms. Si-clause hypotheticals (si + imperfect subjunctive + conditional).',
    sortOrder: 14,
  },
  {
    featureKey: 'idiomatic_register',
    featureName: 'Idiomatic Expressions and Register Variation',
    cefrLevel: 'C1',
    category: 'vocabulary_domain',
    description: 'Fixed expressions, collocations, register shifts (formal/informal/literary). Idioms with no compositional meaning: dar en el clavo, no hay mal que por bien no venga, a fin de cuentas.',
    sortOrder: 15,
  },
];

async function seedB1B2Features() {
  console.log('🌱 Seeding B1/B2/C1 grammar feature keys...');
  console.log('   6 B1 features: present_perfect_es, impersonal_se, relative_clauses_que, conditional_simple, formal_commands_usted, subjunctive_present_intro');
  console.log('   7 B2 features: subjunctive_noun_clause, subjunctive_adverbial, subjunctive_doubt_emotion, pluperfect_es, conditional_perfect_es, passive_voice_es, reported_speech_es');
  console.log('   2 C1 features: imperfect_subjunctive, idiomatic_register');
  console.log(`   ${b1b2Features.length} total\n`);

  try {
    for (const feature of b1b2Features) {
      await db
        .insert(grammarFeatureMap)
        .values(feature)
        .onConflictDoUpdate({
          target: grammarFeatureMap.featureKey,
          set: {
            featureName: feature.featureName,
            cefrLevel: feature.cefrLevel,
            category: feature.category,
            description: feature.description,
            sortOrder: feature.sortOrder ?? 0,
          },
        });
    }
    console.log(`✅ Seeded ${b1b2Features.length} B1/B2/C1 grammar feature keys.`);
  } catch (error) {
    console.error('❌ Failed to seed B1/B2/C1 features:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedB1B2Features();
