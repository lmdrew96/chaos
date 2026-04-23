import { db } from '@/lib/db';
import { grammarFeatureMap } from '@/lib/db/schema';
import type { NewGrammarFeature } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const features: NewGrammarFeature[] = [
  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1B: SER family
  // ═══════════════════════════════════════
  {
    featureKey: 'ser_identity',
    featureName: 'Ser for Identity',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" to express identity and essential characteristics: Soy Nae. Eres estudiante. Es mi hermana. Answers "who/what is this fundamentally?"',
    prerequisites: [],
    sortOrder: 1,
  },
  {
    featureKey: 'ser_classification',
    featureName: 'Ser for Classification',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" to classify or categorize: Es un perro. Son libros. Es una profesora. Groups things into kinds/types.',
    prerequisites: ['ser_identity'],
    sortOrder: 2,
  },
  {
    featureKey: 'ser_origin',
    featureName: 'Ser for Origin (ser de)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser de" to express origin/nationality: Soy de Estados Unidos. Es de Madrid. Son de México. Note the preposition "de" is obligatory.',
    prerequisites: ['ser_identity'],
    sortOrder: 3,
  },
  {
    featureKey: 'ser_profession',
    featureName: 'Ser for Profession',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" for profession/occupation, with NO indefinite article: Soy profesora (NOT "soy una profesora" unless modified). Es médico. A common L1 English interference error.',
    prerequisites: ['ser_identity'],
    sortOrder: 4,
  },
  {
    featureKey: 'ser_material',
    featureName: 'Ser for Material',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser de" to express material composition: Es de madera. La mesa es de cristal. Los zapatos son de cuero.',
    prerequisites: ['ser_origin'],
    sortOrder: 5,
  },
  {
    featureKey: 'ser_time',
    featureName: 'Ser for Time and Date',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "ser" for telling time and dates: Son las tres. Es lunes. Es el cinco de mayo. Note: always third-person singular or plural based on the number of hours.',
    prerequisites: ['ser_identity'],
    sortOrder: 6,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1B: ESTAR family
  // ═══════════════════════════════════════
  {
    featureKey: 'estar_location',
    featureName: 'Estar for Location',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" to express physical location: Estoy en casa. Madrid está en España. Estamos aquí. Location is always estar, regardless of permanence — Madrid has been there for centuries but still uses estar.',
    prerequisites: [],
    sortOrder: 7,
  },
  {
    featureKey: 'estar_physical_state',
    featureName: 'Estar for Physical States',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" for physical conditions/states: Estoy cansada. Está enfermo. Están sentados. Temporary physical states that can change.',
    prerequisites: ['estar_location'],
    sortOrder: 8,
  },
  {
    featureKey: 'estar_emotional_state',
    featureName: 'Estar for Emotional States',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" for emotional/mood states: Estoy feliz. Está triste. Estamos nerviosos. How someone feels at a given moment, not their essential character.',
    prerequisites: ['estar_location'],
    sortOrder: 9,
  },
  {
    featureKey: 'estar_progressive',
    featureName: 'Estar for Progressive (estar + gerundio)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" with gerund (-ando/-iendo) to express ongoing action: Estoy comiendo. Está estudiando. Están trabajando. Only with estar — never with ser.',
    prerequisites: ['estar_location'],
    sortOrder: 10,
  },
  {
    featureKey: 'estar_result_of_change',
    featureName: 'Estar for Result of Change',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Using "estar" with participles to express the resulting state of an action: La puerta está cerrada. El trabajo está terminado. Contrasts with passive ser + participle.',
    prerequisites: ['estar_physical_state'],
    sortOrder: 11,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1B: SER/ESTAR contrast
  // ═══════════════════════════════════════
  {
    featureKey: 'ser_estar_contrast',
    featureName: 'Ser vs Estar: Semantic Minimal Pairs',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Same adjective with ser vs estar produces different meanings: es aburrido (boring) vs está aburrido (bored); es listo (clever) vs está listo (ready); es rico (wealthy) vs está rico (tastes good); es verde (green / inexperienced) vs está verde (unripe). The most challenging Spanish L2 fossilization point.',
    prerequisites: ['ser_identity', 'estar_emotional_state'],
    sortOrder: 12,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Preterite
  // ═══════════════════════════════════════
  {
    featureKey: 'preterite_perfective',
    featureName: 'Preterite for Completed Actions',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Preterite tense for discrete, completed past events: Comí paella ayer. Hablaste con María. Fuimos a Madrid. Marks the event as finished and bounded. Spanish aspect distinction absent in English.',
    prerequisites: [],
    sortOrder: 13,
  },
  {
    featureKey: 'preterite_narrative_foreground',
    featureName: 'Preterite as Narrative Foreground',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Preterite carrying the main event-chain of a story: Entró, miró alrededor, saludó a su amigo, se sentó. These are the "what happened" events that drive the narrative forward.',
    prerequisites: ['preterite_perfective'],
    sortOrder: 14,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Imperfect
  // ═══════════════════════════════════════
  {
    featureKey: 'imperfect_habitual',
    featureName: 'Imperfect for Habitual Past',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect tense for repeated/habitual past actions: Jugaba al fútbol todos los días. Comíamos juntos los domingos. "Used to / would" in English.',
    prerequisites: [],
    sortOrder: 15,
  },
  {
    featureKey: 'imperfect_descriptive',
    featureName: 'Imperfect for Description',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect for ongoing past descriptions without clear start/end: Era alto y tenía el pelo castaño. La casa estaba en la colina. Hacía frío. States rather than events.',
    prerequisites: [],
    sortOrder: 16,
  },
  {
    featureKey: 'imperfect_narrative_background',
    featureName: 'Imperfect as Narrative Background',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect setting the scene around preterite events in narrative: Eran las tres, hacía sol, María caminaba por el parque cuando vio a Juan. The background is imperfect; the interrupting event is preterite.',
    prerequisites: ['imperfect_descriptive'],
    sortOrder: 17,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1C: Preterite/Imperfect contrast
  // ═══════════════════════════════════════
  {
    featureKey: 'preterite_imperfect_contrast',
    featureName: 'Preterite vs Imperfect: Aspectual Distinction',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'Same verb in both tenses produces different meanings: conocí (I met) vs conocía (I knew); supe (I found out) vs sabía (I knew); quise (I tried) vs quería (I wanted); pude (I managed to) vs podía (I was able to). Major Spanish L2 fossilization point — no English L1 model.',
    prerequisites: ['preterite_perfective', 'imperfect_habitual'],
    sortOrder: 18,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — PHASE 1C: Object pronouns
  // ═══════════════════════════════════════
  {
    featureKey: 'direct_object_pronoun_preverbal',
    featureName: 'Direct Object Pronouns (Preverbal)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Direct object pronouns me/te/lo/la/nos/os/los/las placed before finite verbs: Lo veo. La compré. Nos llamaron. Replace the direct object. Preverbal position only at Stage 1; attached forms (quiero verlo) are Stage 2.',
    prerequisites: [],
    sortOrder: 19,
  },
  {
    featureKey: 'indirect_object_pronoun_preverbal',
    featureName: 'Indirect Object Pronouns (Preverbal)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Indirect object pronouns me/te/le/nos/os/les placed before finite verbs: Le di el libro. Me escribió una carta. Nos explicó todo. Marks the recipient. Redundant "a + noun" common (Le di el libro a María).',
    prerequisites: [],
    sortOrder: 20,
  },

  // ═══════════════════════════════════════
  // B1 GRAMMAR — PHASE 1C stretch: Combined object pronouns
  // ═══════════════════════════════════════
  {
    featureKey: 'combined_object_pronoun_preverbal',
    featureName: 'Combined Object Pronouns (le → se)',
    cefrLevel: 'B1',
    category: 'grammar',
    description: 'When both direct and indirect object pronouns appear with third person DO, indirect "le/les" becomes "se": Se lo di (not "le lo di"). Se las mostré. Order is always indirect before direct. Stretch content for late Stage 1 / early Stage 2.',
    prerequisites: ['direct_object_pronoun_preverbal', 'indirect_object_pronoun_preverbal'],
    sortOrder: 21,
  },
];

async function seedGrammarFeatures() {
  console.log('🧠 Seeding Spanish grammar feature map...');
  console.log(`   ${features.filter(f => f.cefrLevel === 'A2' && f.category === 'grammar').length} A2 grammar features`);
  console.log(`   ${features.filter(f => f.cefrLevel === 'B1' && f.category === 'grammar').length} B1 grammar features`);
  console.log(`   ${features.length} total features\n`);

  try {
    // Upsert: insert or update description if feature_key already exists
    for (const feature of features) {
      await db
        .insert(grammarFeatureMap)
        .values(feature)
        .onConflictDoUpdate({
          target: grammarFeatureMap.featureKey,
          set: { description: feature.description },
        });
    }

    console.log('✅ Spanish grammar feature map seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed grammar features:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedGrammarFeatures();
