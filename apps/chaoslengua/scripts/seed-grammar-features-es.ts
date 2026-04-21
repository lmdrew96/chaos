// scripts/seed-grammar-features-es.ts
// ChaosLengua — Spanish grammar feature map seeder
//
// Targets A2→B1 plateau-breakers. Heavy weighting on the four Stage 1
// fossilization-prone error patterns:
//   1. Ser vs Estar
//   2. Preterite vs Imperfect
//   3. Por vs Para
//   4. Direct/Indirect Object Pronouns
//
// A1 features are included as a refresher layer — plateau-breakers often
// have A1 gaps even when their A2 scaffolding is partially built.

import { db } from '@/lib/db';
import { grammarFeatureMap } from '@/lib/db/schema';
import type { NewGrammarFeature } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local.local') });

const features: NewGrammarFeature[] = [
  // ═══════════════════════════════════════
  // A1 GRAMMAR — REFRESHER LAYER
  // ═══════════════════════════════════════
  {
    featureKey: 'present_tense_ser',
    featureName: 'Present Tense: ser (to be — identity)',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Conjugation of "ser" (to be, for identity/characteristics): soy, eres, es, somos, sois, son. Used for identity, profession, origin, time, inherent characteristics, definitions. Example: "Soy estudiante" (I am a student).',
    sortOrder: 1,
  },
  {
    featureKey: 'present_tense_estar',
    featureName: 'Present Tense: estar (to be — state/location)',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Conjugation of "estar" (to be, for states/location): estoy, estás, está, estamos, estáis, están. Used for location, temporary states, progressive actions, results of change. Example: "Estoy cansado" (I am tired).',
    sortOrder: 2,
  },
  {
    featureKey: 'present_tense_tener',
    featureName: 'Present Tense: tener (to have)',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Conjugation of irregular "tener": tengo, tienes, tiene, tenemos, tenéis, tienen. Used for possession AND in idioms where English uses "to be": tener hambre (to be hungry), tener sueño (to be sleepy), tener X años (to be X years old). This is a common English L1 error — learners say "soy hambre" instead of "tengo hambre".',
    sortOrder: 3,
  },
  {
    featureKey: 'present_tense_regular_ar',
    featureName: 'Present Tense: Regular -ar Verbs',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Regular -ar verbs: hablar, trabajar, estudiar, caminar, preparar, mirar, escuchar, comprar. Pattern: -o, -as, -a, -amos, -áis, -an. NOTE: "dar" is irregular (doy, not *daro) and "estar" is irregular (estoy, not *esto) — do not treat these as regular -ar verbs.',
    sortOrder: 4,
  },
  {
    featureKey: 'present_tense_regular_er_ir',
    featureName: 'Present Tense: Regular -er and -ir Verbs',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Regular -er verbs (comer, beber, aprender, leer): -o, -es, -e, -emos, -éis, -en. Regular -ir verbs (vivir, escribir, recibir, decidir): -o, -es, -e, -imos, -ís, -en. The -er and -ir patterns are identical except in the nosotros/vosotros forms.',
    sortOrder: 5,
  },
  {
    featureKey: 'definite_articles',
    featureName: 'Definite Articles (el/la/los/las)',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Definite articles agree with noun gender and number: el (masc sg), la (fem sg), los (masc pl), las (fem pl). Spanish uses definite articles with abstract nouns where English does not: "La libertad es importante" (Liberty is important, NOT *Libertad es importante).',
    sortOrder: 6,
  },
  {
    featureKey: 'indefinite_articles',
    featureName: 'Indefinite Articles (un/una/unos/unas)',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Indefinite articles: un (masc sg), una (fem sg), unos (masc pl, "some"), unas (fem pl, "some"). Omitted before unmodified professions: "Soy profesora" NOT "Soy una profesora" (unless modified: "Soy una profesora excelente").',
    sortOrder: 7,
  },
  {
    featureKey: 'gender_agreement',
    featureName: 'Noun Gender & Adjective Agreement',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Spanish nouns are masculine or feminine. Most nouns ending in -o are masculine, most ending in -a are feminine, but exceptions exist: la mano, el día, el problema, el tema, la moto. Adjectives agree in gender AND number: "la casa blanca", "los libros rojos", "las flores bonitas".',
    sortOrder: 8,
  },
  {
    featureKey: 'basic_negation',
    featureName: 'Basic Negation with "no"',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Negation by placing "no" before the conjugated verb: "No soy", "No tengo", "No hablo español bien". Double negation is grammatical in Spanish: "No tengo nada" (I don\'t have anything / I have nothing).',
    sortOrder: 9,
  },
  {
    featureKey: 'gustar_construction',
    featureName: 'The "gustar" Construction',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Gustar agrees with the THING LIKED, not the person: "Me gusta el libro" (singular thing) vs "Me gustan los libros" (plural things). The person is expressed with an indirect object pronoun: me, te, le, nos, os, les. Common pattern: "(A mí) me gusta...", "(A ti) te gusta...". Same pattern applies to encantar, importar, interesar, doler.',
    sortOrder: 10,
  },
  {
    featureKey: 'basic_questions',
    featureName: 'Question Words: qué, quién, dónde, cómo, cuándo, por qué',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'Question words all carry written accents: qué (what), quién(es) (who), dónde (where), cómo (how), cuándo (when), por qué (why), cuál(es) (which), cuánto/a/os/as (how much/many). Spanish questions use inverted punctuation: ¿Cómo te llamas?',
    sortOrder: 11,
  },
  {
    featureKey: 'basic_prepositions',
    featureName: 'Basic Prepositions: en, de, a, con',
    cefrLevel: 'A1',
    category: 'grammar',
    description: 'High-frequency prepositions: en (in/on/at), de (of/from), a (to/at + personal "a"), con (with). Contractions: "a + el" → "al" ("Voy al mercado"), "de + el" → "del" ("el libro del profesor"). NEVER contract "a la" or "de la".',
    sortOrder: 12,
  },

  // ═══════════════════════════════════════
  // A1 VOCABULARY DOMAINS
  // ═══════════════════════════════════════
  {
    featureKey: 'vocab_greetings_es',
    featureName: 'Greetings & Politeness',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'Hola, Buenos días, Buenas tardes, Buenas noches, Adiós, Hasta luego, Hasta mañana, Por favor, Gracias, De nada, Perdón, Lo siento, Mucho gusto, Encantado/a.',
    sortOrder: 20,
  },
  {
    featureKey: 'vocab_family_es',
    featureName: 'Family Members',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'madre/mamá, padre/papá, hermano, hermana, hijo, hija, abuelo, abuela, tío, tía, primo, prima, esposo/marido, esposa/mujer, familia, pariente.',
    sortOrder: 21,
  },
  {
    featureKey: 'vocab_food_es',
    featureName: 'Food & Drinks',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'pan, agua, café, leche, carne, pollo, pescado, verduras, frutas, sopa, arroz, queso, huevos, comer, beber, desayunar, almorzar, cenar, tener hambre, tener sed.',
    sortOrder: 22,
  },
  {
    featureKey: 'vocab_colors_es',
    featureName: 'Colors',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'rojo, azul, verde, amarillo, blanco, negro, naranja, rosa, marrón/café, gris, morado/violeta. Remember: colors agree with noun gender and number: "casa roja", "libros rojos".',
    sortOrder: 23,
  },
  {
    featureKey: 'vocab_numbers_es',
    featureName: 'Numbers 1-100',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'uno/una, dos, tres, cuatro, cinco...diez, once, doce, trece, catorce, quince, dieciséis, diecisiete...veinte, treinta, cuarenta, cincuenta...cien. Note: 16-19 and 21-29 contract into single words (dieciséis, veintidós). "Uno" drops to "un" before masculine nouns ("un libro"), and becomes "una" before feminine ("una mesa").',
    sortOrder: 24,
  },
  {
    featureKey: 'vocab_time_basic_es',
    featureName: 'Basic Time Expressions',
    cefrLevel: 'A1',
    category: 'vocabulary_domain',
    description: 'hoy, mañana, ayer, ahora, después, antes, la mañana, la tarde, la noche, hora, minuto, día, semana, mes, año. Telling time: "¿Qué hora es?" — "Son las tres" / "Es la una".',
    sortOrder: 25,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — STAGE 1 TARGET PATTERNS
  // (These are the four fossilization-prone features
  //  that ChaosLengua's MVP is specifically designed to break.)
  // ═══════════════════════════════════════
  {
    featureKey: 'ser_vs_estar_core',
    featureName: 'Ser vs Estar — Core Contrast',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Core ser/estar distinction by semantic category. SER for: identity ("Soy María"), profession ("Es médico"), origin ("Somos de México"), time ("Son las tres"), inherent characteristics ("El cielo es azul"), definitions, possession. ESTAR for: location ("Está en casa"), temporary states ("Estoy cansado"), progressive actions ("Estoy leyendo"), results of change ("La ventana está rota"). This is the single most common fossilization point for English L1 learners because English "to be" collapses the distinction.',
    sortOrder: 30,
  },
  {
    featureKey: 'ser_vs_estar_meaning_shift',
    featureName: 'Ser vs Estar — Meaning-Shifting Adjectives',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Adjectives that change meaning depending on ser/estar. ABURRIDO: "es aburrido" (is boring, trait) vs "está aburrido" (is bored, state). LISTO: "es listo" (is clever) vs "está listo" (is ready). RICO: "es rico" (is wealthy) vs "está rico" (is delicious/tasty). VIVO: "es vivo" (is lively/sharp) vs "está vivo" (is alive). VERDE: "es verde" (is green) vs "está verde" (is unripe). MALO: "es malo" (is bad, as a person) vs "está malo" (is sick or in bad condition). These pairs make the ser/estar distinction meaning-carrying, not arbitrary.',
    sortOrder: 31,
  },
  {
    featureKey: 'preterite_formation',
    featureName: 'Preterite Tense Formation',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Preterite (past tense for completed events). Regular -ar: hablé, hablaste, habló, hablamos, hablasteis, hablaron. Regular -er/-ir: comí, comiste, comió, comimos, comisteis, comieron. Irregular stems to memorize: ser/ir → fui, fuiste, fue, fuimos, fuisteis, fueron (same for both!). Tener → tuv-. Hacer → hic- (hizo in 3rd sg). Estar → estuv-. Poder → pud-. Querer → quis-. Venir → vin-.',
    sortOrder: 32,
  },
  {
    featureKey: 'imperfect_formation',
    featureName: 'Imperfect Tense Formation',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Imperfect (past tense for ongoing, habitual, or descriptive events). Regular -ar: hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban. Regular -er/-ir: comía, comías, comía, comíamos, comíais, comían. Only THREE irregular verbs in the imperfect: ser (era, eras, era, éramos, erais, eran), ir (iba, ibas, iba, íbamos, ibais, iban), ver (veía, veías, veía, veíamos, veíais, veían). Much simpler than preterite — the imperfect has very few irregulars.',
    sortOrder: 33,
  },
  {
    featureKey: 'preterite_vs_imperfect_aspect',
    featureName: 'Preterite vs Imperfect — Aspectual Selection',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Choosing between preterite and imperfect is about ASPECT, not time — both refer to the past. PRETERITE for: completed/bounded events ("Ayer fui al cine"), foregrounded actions that advance a narrative ("Llegué, vi a María, salimos juntos"), events with a clear start or end ("Viví en España por dos años"). IMPERFECT for: ongoing/habitual past ("Todos los sábados iba al mercado"), backgrounded states/descriptions ("Era 2015, vivía en Buenos Aires, estaba contenta"), actions in progress interrupted by a preterite event ("Caminaba cuando sonó el teléfono"). English L1 learners default to preterite under pressure — that\'s the fossilization point.',
    sortOrder: 34,
  },
  {
    featureKey: 'preterite_imperfect_meaning_shift',
    featureName: 'Verbs That Shift Meaning by Aspect',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Some verbs take different lexical meanings in preterite vs imperfect. SABER: imperfect "sabía" (knew, had knowledge) vs preterite "supe" (found out, learned for the first time). CONOCER: imperfect "conocía" (knew, was acquainted with) vs preterite "conocí" (met for the first time). QUERER: imperfect "quería" (wanted) vs preterite "quise" (tried to) / "no quise" (refused). PODER: imperfect "podía" (could, was able) vs preterite "pude" (managed to) / "no pude" (failed to). TENER: imperfect "tenía" (had) vs preterite "tuve" (got, received). These are high-leverage teaching moments.',
    sortOrder: 35,
  },
  {
    featureKey: 'direct_object_pronouns',
    featureName: 'Direct Object Pronouns (me, te, lo, la, nos, os, los, las)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Direct object pronouns replace direct objects: me, te, lo/la, nos, os, los/las. Placement with finite verbs: BEFORE the conjugated verb. "Veo a María" → "La veo." "Compro los libros" → "Los compro." "Te llamo mañana." Personal "a" with human direct objects: "Veo a mi hermana" (not *Veo mi hermana). The "lo" can also be a neuter pronoun referring to an idea: "Lo sé" (I know it/that).',
    sortOrder: 36,
  },
  {
    featureKey: 'indirect_object_pronouns',
    featureName: 'Indirect Object Pronouns (me, te, le, nos, os, les)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Indirect object pronouns: me, te, le, nos, os, les. These mark the recipient/beneficiary. "Le doy el libro a María" (I give the book TO María). Note that indirect pronouns ARE used even when the full noun is stated — this is called "clitic doubling" and is obligatory with "le/les" + proper noun or specific human. The "me gustar" construction uses indirect pronouns because the thing liked is the subject and the person is the indirect object.',
    sortOrder: 37,
  },
  {
    featureKey: 'combined_object_pronouns',
    featureName: 'Combined Object Pronouns — "se lo" Rule',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'When both indirect and direct object pronouns appear together, the ORDER is: indirect before direct. "Me lo dijo" (He told it to me), "Te lo compro" (I buy it for you). CRITICAL SUBSTITUTION RULE: when both pronouns start with L (le/les + lo/la/los/las), the indirect "le/les" becomes "se": "Le doy el libro" + pronoun-shift = "Se lo doy" (NOT *le lo doy). This rule exists because "le lo" is euphonically awkward in Spanish. Example: "Les regalé flores a mis padres" → "Se las regalé."',
    sortOrder: 38,
  },
  {
    featureKey: 'por_vs_para_intro',
    featureName: 'Por vs Para — Introduction',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Both translate to English "for" but encode different meanings. PARA (narrower field): purpose/destination ("Salgo para México"), recipient ("Es para ti"), deadline ("Lo necesito para mañana"), opinion ("Para mí, es obvio"). POR (broader field): cause/reason ("Gracias por la ayuda"), exchange ("Pagué veinte dólares por el libro"), duration ("Trabajé por tres horas"), means ("Hablamos por teléfono"), path/through ("Caminé por el parque"), agent in passive ("Escrito por Cervantes"). English L1 learners default to "por" for all "for" meanings — this is a classic fossilization point.',
    sortOrder: 39,
  },

  // ═══════════════════════════════════════
  // A2 GRAMMAR — SUPPORTING FEATURES
  // ═══════════════════════════════════════
  {
    featureKey: 'stem_changing_e_ie',
    featureName: 'Stem-Changing Verbs (e → ie)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Some verbs change stem vowel e → ie in stressed positions (not nosotros/vosotros). Common: pensar (pienso, piensas, piensa, pensamos, pensáis, piensan), querer, entender, cerrar, empezar, perder, sentir. Pattern appears only in persons where the stem vowel is stressed.',
    sortOrder: 40,
  },
  {
    featureKey: 'stem_changing_o_ue',
    featureName: 'Stem-Changing Verbs (o → ue)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Some verbs change stem vowel o → ue in stressed positions (not nosotros/vosotros). Common: poder (puedo, puedes, puede, podemos, podéis, pueden), volver, encontrar, dormir, recordar, contar. Same stress-based pattern as e→ie verbs.',
    sortOrder: 41,
  },
  {
    featureKey: 'reflexive_verbs_es',
    featureName: 'Reflexive Verbs',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Reflexive verbs use pronouns me/te/se/nos/os/se. Common: levantarse (to get up), acostarse (to go to bed), ducharse (to shower), llamarse (to be named), sentirse (to feel). Placement: BEFORE finite verbs ("Me levanto temprano") or attached to infinitives/gerunds/imperatives ("Voy a levantarme" or "Me voy a levantar"; "¡Levántate!").',
    sortOrder: 42,
  },
  {
    featureKey: 'informal_commands_tu',
    featureName: 'Informal Commands (tú)',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Affirmative tú commands use the 3rd person singular present indicative form: Habla! Come! Vive! Irregulars: di (decir), haz (hacer), ve (ir), pon (poner), sal (salir), sé (ser), ten (tener), ven (venir). Negative tú commands use the present subjunctive: ¡No hables! ¡No comas! ¡No vivas! Pronouns attach to affirmative commands: "¡Dímelo!" but precede negative: "¡No me lo digas!"',
    sortOrder: 43,
  },
  {
    featureKey: 'comparisons',
    featureName: 'Comparisons: más/menos...que, tan...como',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Comparative structures: "más + adj/adv + que" (more...than), "menos + adj/adv + que" (less...than), "tan + adj/adv + como" (as...as), "tanto/a/os/as + noun + como" (as much/many...as). Irregular: más bueno → mejor, más malo → peor, más grande → mayor (age), más pequeño → menor (age). "Es mayor que yo" (He is older than I).',
    sortOrder: 44,
  },
  {
    featureKey: 'future_informal_ir_a',
    featureName: 'Informal Future: ir + a + infinitive',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Near/informal future: "voy a", "vas a", "va a", "vamos a", "vais a", "van a" + infinitive. "Voy a estudiar" (I\'m going to study). This is by far the most common way to express future in spoken Spanish, much more frequent than the morphological future tense.',
    sortOrder: 45,
  },
  {
    featureKey: 'possessives',
    featureName: 'Possessive Adjectives',
    cefrLevel: 'A2',
    category: 'grammar',
    description: 'Possessive adjectives agree with the THING POSSESSED, not the possessor: mi/mis, tu/tus, su/sus, nuestro/a/os/as, vuestro/a/os/as, su/sus. "Mi casa" (one possessor, one house), "mis casas" (one possessor, multiple houses), "nuestras casas" (multiple possessors, multiple houses). "Su" is ambiguous (his/her/their/your-formal) — often clarified: "la casa de él", "la casa de ustedes".',
    sortOrder: 46,
  },

  // ═══════════════════════════════════════
  // A2 VOCABULARY DOMAINS
  // ═══════════════════════════════════════
  {
    featureKey: 'vocab_shopping_es',
    featureName: 'Shopping & Money',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'comprar, vender, tienda, mercado, supermercado, precio, caro, barato, dinero, dólares, pesos, euros, ¿Cuánto cuesta?, ¿Cuánto es?, recibo, descuento, oferta, pagar, tarjeta de crédito, efectivo.',
    sortOrder: 50,
  },
  {
    featureKey: 'vocab_health_es',
    featureName: 'Health & Body',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'cabeza, mano, pie, ojo, boca, estómago, brazo, pierna, corazón, espalda, me duele (it hurts me — gustar-type verb!), médico, enfermera, sano, enfermo, medicina, farmacia, dolor, resfriado, fiebre.',
    sortOrder: 51,
  },
  {
    featureKey: 'vocab_travel_es',
    featureName: 'Travel & Directions',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'tren, autobús, avión, coche/auto, boleto/billete, estación, aeropuerto, izquierda, derecha, todo recto/derecho, mapa, hotel, cruzar, doblar, seguir. Note regional lexical variation: "coche" (Spain) vs "auto" (Argentina, Chile) vs "carro" (Mexico, Colombia).',
    sortOrder: 52,
  },
  {
    featureKey: 'vocab_weather_es',
    featureName: 'Weather',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'sol, lluvia, nieve, viento, nube, tormenta, calor, frío, temperatura, pronóstico. Key constructions: "Hace calor/frío/sol/viento" (with HACER, not SER or ESTAR!), "Está lloviendo/nevando" (progressive with ESTAR), "Hay niebla/tormenta" (with HAY). A classic English L1 error is "Es calor" instead of "Hace calor".',
    sortOrder: 53,
  },
  {
    featureKey: 'vocab_work_es',
    featureName: 'Work & Occupations',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'trabajar, oficina, profesor/profesora, médico/médica, ingeniero/ingeniera, estudiante, trabajo, empleo, colega, jefe/jefa, programador/programadora, empresa, reunión, horario, sueldo, jubilarse.',
    sortOrder: 54,
  },
  {
    featureKey: 'vocab_false_cognates',
    featureName: 'False Cognates (Falsos Amigos)',
    cefrLevel: 'A2',
    category: 'vocabulary_domain',
    description: 'Common false cognates that mislead English L1 learners: embarazada (pregnant, NOT embarrassed — "avergonzado/a"), realizar (to carry out/accomplish, NOT to realize — "darse cuenta de"), asistir (to attend, NOT to assist — "ayudar"), pretender (to intend/aspire, NOT to pretend — "fingir"), molestar (to bother, NOT to molest — "abusar de"), éxito (success, NOT exit — "salida"), actual (current/present-day, NOT actual — "verdadero/real"), eventualmente (potentially/possibly, NOT eventually — "finalmente/con el tiempo"), sensible (sensitive, NOT sensible — "sensato"), soportar (to tolerate, NOT to support — "apoyar").',
    sortOrder: 55,
  },
];

async function seedGrammarFeatures() {
  console.log('🧠 Seeding Spanish grammar feature map...');
  console.log(`   ${features.filter(f => f.cefrLevel === 'A1' && f.category === 'grammar').length} A1 grammar features`);
  console.log(`   ${features.filter(f => f.cefrLevel === 'A1' && f.category === 'vocabulary_domain').length} A1 vocab domains`);
  console.log(`   ${features.filter(f => f.cefrLevel === 'A2' && f.category === 'grammar').length} A2 grammar features`);
  console.log(`   ${features.filter(f => f.cefrLevel === 'A2' && f.category === 'vocabulary_domain').length} A2 vocab domains`);
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
