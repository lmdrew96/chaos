// scripts/seed-stress-minimal-pairs-es.ts
// ChaosLengua — Spanish phonology minimal pairs.
//
// Covers two drill categories:
//
// 1. STRESS ACCENT (featureKey: 'phon_stress_accent')
//    Listen → identify which stress variant was spoken.
//    17 written-accent contrasts + 5 three-way verb/noun/preterite + 4 1sg-present vs 3sg-preterite.
//    57 variants across 26 base words.
//
// 2. R/RR CONTRAST (featureKey: 'phon_trill_rr')
//    Listen → identify which word was spoken (flap /ɾ/ vs trill /r/).
//    6 minimal pairs across 3 base sequences.
//
// 3. N/Ñ CONTRAST (featureKey: 'phon_palatal_n')
//    Listen → identify which word was spoken (/n/ vs palatal /ɲ/).
//    6 minimal pairs across 3 base sequences.
//
// Usage: npx tsx scripts/seed-stress-minimal-pairs-es.ts

import { db } from '@/lib/db';
import { stressMinimalPairs } from '@/lib/db/schema';
import type { NewStressMinimalPair } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// ─── Stress Accent Pairs ──────────────────────────────────────────────────────

const stressAccentPairs: NewStressMinimalPair[] = [
  // ═══════════════════════════════════════
  // Monosyllable & function-word accent contrasts
  // ═══════════════════════════════════════

  // si / sí
  { word: 'si', stress: 'si', meaning: 'if (conjunction)', example: 'Si llueve, no salimos.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'si', stress: 'SÍ', meaning: 'yes / oneself (reflexive)', example: 'Sí, quiero ir contigo.', isSuggested: true, featureKey: 'phon_stress_accent' },

  // se / sé
  { word: 'se', stress: 'se', meaning: 'reflexive / impersonal pronoun', example: 'Se lava las manos.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'se', stress: 'SÉ', meaning: 'I know (saber, 1sg)', example: 'Sé hablar español.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // te / té
  { word: 'te', stress: 'te', meaning: 'you (object pronoun)', example: 'Te llamo mañana.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'te', stress: 'TÉ', meaning: 'tea (noun)', example: 'Quiero un té con limón.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // mi / mí
  { word: 'mi', stress: 'mi', meaning: 'my (possessive)', example: 'Mi casa es grande.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'mi', stress: 'MÍ', meaning: 'me (after preposition)', example: 'Este regalo es para mí.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // tu / tú
  { word: 'tu', stress: 'tu', meaning: 'your (possessive)', example: 'Tu hermano es muy alto.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'tu', stress: 'TÚ', meaning: 'you (subject pronoun)', example: '¿Tú vienes a la fiesta?', isSuggested: true, featureKey: 'phon_stress_accent' },

  // el / él
  { word: 'el', stress: 'el', meaning: 'the (masculine article)', example: 'El libro está sobre la mesa.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'el', stress: 'ÉL', meaning: 'he (subject pronoun)', example: 'Él trabaja en Madrid.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // de / dé
  { word: 'de', stress: 'de', meaning: 'of / from (preposition)', example: 'Soy de Argentina.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'de', stress: 'DÉ', meaning: 'give (dar, present subjunctive 3sg)', example: 'Espero que me dé una respuesta.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // mas / más
  { word: 'mas', stress: 'mas', meaning: 'but (literary, archaic)', example: 'Quería ir, mas no pude.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'mas', stress: 'MÁS', meaning: 'more', example: 'Quiero más café, por favor.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // que / qué
  { word: 'que', stress: 'que', meaning: 'that / which (relative)', example: 'El libro que leí era interesante.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'que', stress: 'QUÉ', meaning: 'what (interrogative/exclamative)', example: '¿Qué quieres comer?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // como / cómo
  { word: 'como', stress: 'CO-mo', meaning: 'like / as (also: I eat)', example: 'Como mi madre, me gusta cocinar.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'como', stress: 'CÓ-mo', meaning: 'how (interrogative/exclamative)', example: '¿Cómo se dice "thank you" en español?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // donde / dónde
  { word: 'donde', stress: 'DON-de', meaning: 'where (relative)', example: 'Esa es la casa donde vivo.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'donde', stress: 'DÓN-de', meaning: 'where (interrogative)', example: '¿Dónde está la estación?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // cuando / cuándo
  { word: 'cuando', stress: 'CUAN-do', meaning: 'when (relative)', example: 'Te aviso cuando llegue.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'cuando', stress: 'CUÁN-do', meaning: 'when (interrogative)', example: '¿Cuándo empieza la clase?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // quien / quién
  { word: 'quien', stress: 'quien', meaning: 'who (relative)', example: 'La persona quien me llamó es mi tía.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'quien', stress: 'QUIÉN', meaning: 'who (interrogative)', example: '¿Quién es ese señor?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // cual / cuál
  { word: 'cual', stress: 'cual', meaning: 'which (relative, formal)', example: 'La razón por la cual vine es importante.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'cual', stress: 'CUÁL', meaning: 'which (interrogative)', example: '¿Cuál prefieres, té o café?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // cuanto / cuánto
  { word: 'cuanto', stress: 'CUAN-to', meaning: 'as much as (relative)', example: 'Te ayudaré en cuanto pueda.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'cuanto', stress: 'CUÁN-to', meaning: 'how much (interrogative)', example: '¿Cuánto cuesta el boleto?', isSuggested: false, featureKey: 'phon_stress_accent' },

  // ═══════════════════════════════════════
  // Disyllable noun vs disyllable noun (written accent)
  // ═══════════════════════════════════════

  // papa / papá
  { word: 'papa', stress: 'PA-pa', meaning: 'potato (or: pope)', example: 'Me gusta la papa con queso.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'papa', stress: 'pa-PÁ', meaning: 'dad (informal)', example: 'Mi papá es ingeniero.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // mama / mamá
  { word: 'mama', stress: 'MA-ma', meaning: 'breast / mammary (anatomical)', example: 'El cáncer de mama es prevenible.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'mama', stress: 'ma-MÁ', meaning: 'mom (informal)', example: 'Mi mamá cocina muy bien.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // ═══════════════════════════════════════
  // Three-way verb / noun / preterite contrasts
  // (esdrújula / llana / aguda — all three Spanish stress positions)
  // ═══════════════════════════════════════

  // término / termino / terminó
  { word: 'termino', stress: 'TÉR-mi-no', meaning: 'term / end (noun)', example: 'No entiendo ese término técnico.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'termino', stress: 'ter-MI-no', meaning: 'I finish (terminar, present 1sg)', example: 'Termino el trabajo a las cinco.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'termino', stress: 'ter-mi-NÓ', meaning: 'he/she finished (terminar, preterite 3sg)', example: 'Ella terminó la tarea anoche.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // público / publico / publicó
  { word: 'publico', stress: 'PÚ-bli-co', meaning: 'public / audience (noun/adj)', example: 'El público aplaudió mucho.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'publico', stress: 'pu-BLI-co', meaning: 'I publish (publicar, present 1sg)', example: 'Publico un libro cada año.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'publico', stress: 'pu-bli-CÓ', meaning: 'he/she published (publicar, preterite 3sg)', example: 'El periódico publicó la noticia ayer.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // médico / medico / medicó
  { word: 'medico', stress: 'MÉ-di-co', meaning: 'doctor / physician (noun)', example: 'Mi médico me recomendó descansar.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'medico', stress: 'me-DI-co', meaning: 'I medicate (medicar, present 1sg)', example: 'Medico al paciente cada seis horas.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'medico', stress: 'me-di-CÓ', meaning: 'he/she medicated (medicar, preterite 3sg)', example: 'La enfermera medicó al niño con cuidado.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // cálculo / calculo / calculó
  { word: 'calculo', stress: 'CÁL-cu-lo', meaning: 'calculation / calculus (noun)', example: 'El cálculo del impuesto es complicado.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'calculo', stress: 'cal-CU-lo', meaning: 'I calculate (calcular, present 1sg)', example: 'Calculo el precio total.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'calculo', stress: 'cal-cu-LÓ', meaning: 'he/she calculated (calcular, preterite 3sg)', example: 'El ingeniero calculó la distancia exacta.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // depósito / deposito / depositó
  { word: 'deposito', stress: 'de-PÓ-si-to', meaning: 'deposit / warehouse (noun)', example: 'El depósito está lleno de cajas.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'deposito', stress: 'de-po-SI-to', meaning: 'I deposit (depositar, present 1sg)', example: 'Deposito mi cheque en el banco.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'deposito', stress: 'de-po-si-TÓ', meaning: 'he/she deposited (depositar, preterite 3sg)', example: 'Mi padre depositó el dinero ayer.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // ═══════════════════════════════════════
  // Verb 1sg-present vs 3sg-preterite (most productive pattern)
  // ═══════════════════════════════════════

  // hablo / habló
  { word: 'hablo', stress: 'HA-blo', meaning: 'I speak (hablar, present 1sg)', example: 'Hablo dos idiomas.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'hablo', stress: 'ha-BLÓ', meaning: 'he/she spoke (hablar, preterite 3sg)', example: 'Mi abuela habló con el médico.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // trabajo / trabajó
  { word: 'trabajo', stress: 'tra-BA-jo', meaning: 'work (noun) / I work (present 1sg)', example: 'Trabajo en una oficina.', isSuggested: true, featureKey: 'phon_stress_accent' },
  { word: 'trabajo', stress: 'tra-ba-JÓ', meaning: 'he/she worked (trabajar, preterite 3sg)', example: 'Mi hermano trabajó en París el año pasado.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // canto / cantó
  { word: 'canto', stress: 'CAN-to', meaning: 'I sing (cantar, present 1sg) / song (noun)', example: 'Canto en el coro de la iglesia.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'canto', stress: 'can-TÓ', meaning: 'he/she sang (cantar, preterite 3sg)', example: 'La cantante cantó tres canciones.', isSuggested: false, featureKey: 'phon_stress_accent' },

  // miro / miró
  { word: 'miro', stress: 'MI-ro', meaning: 'I look (mirar, present 1sg)', example: 'Miro la televisión por la noche.', isSuggested: false, featureKey: 'phon_stress_accent' },
  { word: 'miro', stress: 'mi-RÓ', meaning: 'he/she looked (mirar, preterite 3sg)', example: 'El niño miró al perro con miedo.', isSuggested: false, featureKey: 'phon_stress_accent' },
];

// ─── R / RR Contrast Pairs ────────────────────────────────────────────────────
// Tests discrimination of flap /ɾ/ (single r) vs trill /r/ (rr).
// The only phonemic contrast is the consonant; same vowel frame.

const rrPairs: NewStressMinimalPair[] = [
  // pero / perro
  { word: 'pero', stress: 'pero', meaning: 'but (conjunction)', example: 'Quiero ir, pero estoy cansado.', isSuggested: true, featureKey: 'phon_trill_rr' },
  { word: 'pero', stress: 'perro', meaning: 'dog', example: 'Mi perro se llama Max.', isSuggested: false, featureKey: 'phon_trill_rr' },

  // caro / carro
  { word: 'caro', stress: 'caro', meaning: 'expensive / dear', example: 'Este abrigo es muy caro.', isSuggested: true, featureKey: 'phon_trill_rr' },
  { word: 'caro', stress: 'carro', meaning: 'car (Latin America) / cart', example: 'Voy a lavar el carro esta tarde.', isSuggested: false, featureKey: 'phon_trill_rr' },

  // para / parra
  { word: 'para', stress: 'para', meaning: 'for / in order to (preposition)', example: 'Este libro es para ti.', isSuggested: false, featureKey: 'phon_trill_rr' },
  { word: 'para', stress: 'parra', meaning: 'grapevine', example: 'La parra da uvas en otoño.', isSuggested: false, featureKey: 'phon_trill_rr' },
];

// ─── N / Ñ Contrast Pairs ─────────────────────────────────────────────────────
// Tests discrimination of alveolar /n/ vs palatal nasal /ɲ/ (written as ñ).

const palatalNPairs: NewStressMinimalPair[] = [
  // pena / peña
  { word: 'pena', stress: 'pena', meaning: 'sadness / shame', example: 'Me da mucha pena verte así.', isSuggested: true, featureKey: 'phon_palatal_n' },
  { word: 'pena', stress: 'peña', meaning: 'rock / cliff / folk music group', example: 'Escalamos la peña más alta del parque.', isSuggested: false, featureKey: 'phon_palatal_n' },

  // cana / caña
  { word: 'cana', stress: 'cana', meaning: 'gray hair', example: 'Mi abuelo tiene muchas canas.', isSuggested: false, featureKey: 'phon_palatal_n' },
  { word: 'cana', stress: 'caña', meaning: 'cane / reed / glass of beer (Spain)', example: 'Cortamos la caña para hacer una flauta.', isSuggested: false, featureKey: 'phon_palatal_n' },

  // una / uña
  { word: 'una', stress: 'una', meaning: 'one / a (feminine article)', example: 'Quiero una manzana, por favor.', isSuggested: false, featureKey: 'phon_palatal_n' },
  { word: 'una', stress: 'uña', meaning: 'fingernail / toenail', example: 'Se rompió la uña al abrir la lata.', isSuggested: false, featureKey: 'phon_palatal_n' },
];

// ─── Combined dataset ─────────────────────────────────────────────────────────

const pairs: NewStressMinimalPair[] = [
  ...stressAccentPairs,
  ...rrPairs,
  ...palatalNPairs,
];

async function seedStressMinimalPairs() {
  const byFeatureKey = pairs.reduce<Record<string, number>>((acc, p) => {
    const key = p.featureKey ?? 'null';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  console.log('🔊 Seeding Spanish pronunciation minimal pairs...');
  console.log(`   ${pairs.length} total variants`);
  for (const [key, count] of Object.entries(byFeatureKey)) {
    console.log(`   ${count} rows → featureKey: ${key}`);
  }
  console.log();

  try {
    // Idempotency: clear existing rows before re-seeding. Stress pairs are
    // catalog data (not user-generated), so a fresh insert is the cleanest
    // semantics — if the curated set changes, we want the table to match.
    // SAFE because chaoslengua and chaoslimba use separate Neon databases;
    // do not consolidate them without first adding a language column to
    // stress_minimal_pairs and filtering this delete by language.
    await db.delete(stressMinimalPairs);
    await db.insert(stressMinimalPairs).values(pairs);

    console.log('✅ Spanish pronunciation minimal pairs seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed minimal pairs:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedStressMinimalPairs();
