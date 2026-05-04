// scripts/seed-stress-minimal-pairs-es.ts
// ChaosLengua — Phase 1A phonology content: Spanish stress-contrast minimal pairs.
//
// Each row is one stress variant of a base letter sequence. The `word` column
// is the unaccented lookup key — multiple rows share a `word` when the only
// difference between them is stress placement (and the written accent that
// marks it). The Pronunciation Practice UI groups by `word` and shows users
// the variants side-by-side.
//
// Selection rationale (Phase 1A — A1/A2):
//   - 17 written-accent contrasts on monosyllables/short function words
//     (sí/si, tú/tu, qué/que, cómo/como…) — the highest-frequency stress
//     traps in everyday Spanish.
//   - 5 three-way verb/noun/preterite contrasts (término/termino/terminó,
//     público/publico/publicó…) — show all three Spanish accent positions on
//     a single letter sequence; pedagogically distinctive.
//   - 4 verb 1sg-present vs 3sg-preterite pairs (hablo/habló, trabajo/trabajó…)
//     — the most productive stress-contrast pattern in Spanish.
//
// Total: 57 rows across 26 base words. 8 marked `isSuggested: true` to surface
// on the Pronunciation Practice page (one per representative base word).
//
// Usage: npx tsx scripts/seed-stress-minimal-pairs-es.ts

import { db } from '@/lib/db';
import { stressMinimalPairs } from '@/lib/db/schema';
import type { NewStressMinimalPair } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const pairs: NewStressMinimalPair[] = [
  // ═══════════════════════════════════════
  // Monosyllable & function-word accent contrasts
  // ═══════════════════════════════════════

  // si / sí
  { word: 'si', stress: 'si', meaning: 'if (conjunction)', example: 'Si llueve, no salimos.', isSuggested: false },
  { word: 'si', stress: 'SÍ', meaning: 'yes / oneself (reflexive)', example: 'Sí, quiero ir contigo.', isSuggested: true },

  // se / sé
  { word: 'se', stress: 'se', meaning: 'reflexive / impersonal pronoun', example: 'Se lava las manos.', isSuggested: false },
  { word: 'se', stress: 'SÉ', meaning: 'I know (saber, 1sg)', example: 'Sé hablar español.', isSuggested: false },

  // te / té
  { word: 'te', stress: 'te', meaning: 'you (object pronoun)', example: 'Te llamo mañana.', isSuggested: false },
  { word: 'te', stress: 'TÉ', meaning: 'tea (noun)', example: 'Quiero un té con limón.', isSuggested: false },

  // mi / mí
  { word: 'mi', stress: 'mi', meaning: 'my (possessive)', example: 'Mi casa es grande.', isSuggested: false },
  { word: 'mi', stress: 'MÍ', meaning: 'me (after preposition)', example: 'Este regalo es para mí.', isSuggested: false },

  // tu / tú
  { word: 'tu', stress: 'tu', meaning: 'your (possessive)', example: 'Tu hermano es muy alto.', isSuggested: false },
  { word: 'tu', stress: 'TÚ', meaning: 'you (subject pronoun)', example: '¿Tú vienes a la fiesta?', isSuggested: true },

  // el / él
  { word: 'el', stress: 'el', meaning: 'the (masculine article)', example: 'El libro está sobre la mesa.', isSuggested: false },
  { word: 'el', stress: 'ÉL', meaning: 'he (subject pronoun)', example: 'Él trabaja en Madrid.', isSuggested: false },

  // de / dé
  { word: 'de', stress: 'de', meaning: 'of / from (preposition)', example: 'Soy de Argentina.', isSuggested: false },
  { word: 'de', stress: 'DÉ', meaning: 'give (dar, present subjunctive 3sg)', example: 'Espero que me dé una respuesta.', isSuggested: false },

  // mas / más
  { word: 'mas', stress: 'mas', meaning: 'but (literary, archaic)', example: 'Quería ir, mas no pude.', isSuggested: false },
  { word: 'mas', stress: 'MÁS', meaning: 'more', example: 'Quiero más café, por favor.', isSuggested: false },

  // que / qué
  { word: 'que', stress: 'que', meaning: 'that / which (relative)', example: 'El libro que leí era interesante.', isSuggested: false },
  { word: 'que', stress: 'QUÉ', meaning: 'what (interrogative/exclamative)', example: '¿Qué quieres comer?', isSuggested: false },

  // como / cómo
  { word: 'como', stress: 'CO-mo', meaning: 'like / as (also: I eat)', example: 'Como mi madre, me gusta cocinar.', isSuggested: false },
  { word: 'como', stress: 'CÓ-mo', meaning: 'how (interrogative/exclamative)', example: '¿Cómo se dice "thank you" en español?', isSuggested: false },

  // donde / dónde
  { word: 'donde', stress: 'DON-de', meaning: 'where (relative)', example: 'Esa es la casa donde vivo.', isSuggested: false },
  { word: 'donde', stress: 'DÓN-de', meaning: 'where (interrogative)', example: '¿Dónde está la estación?', isSuggested: false },

  // cuando / cuándo
  { word: 'cuando', stress: 'CUAN-do', meaning: 'when (relative)', example: 'Te aviso cuando llegue.', isSuggested: false },
  { word: 'cuando', stress: 'CUÁN-do', meaning: 'when (interrogative)', example: '¿Cuándo empieza la clase?', isSuggested: false },

  // quien / quién
  { word: 'quien', stress: 'quien', meaning: 'who (relative)', example: 'La persona quien me llamó es mi tía.', isSuggested: false },
  { word: 'quien', stress: 'QUIÉN', meaning: 'who (interrogative)', example: '¿Quién es ese señor?', isSuggested: false },

  // cual / cuál
  { word: 'cual', stress: 'cual', meaning: 'which (relative, formal)', example: 'La razón por la cual vine es importante.', isSuggested: false },
  { word: 'cual', stress: 'CUÁL', meaning: 'which (interrogative)', example: '¿Cuál prefieres, té o café?', isSuggested: false },

  // cuanto / cuánto
  { word: 'cuanto', stress: 'CUAN-to', meaning: 'as much as (relative)', example: 'Te ayudaré en cuanto pueda.', isSuggested: false },
  { word: 'cuanto', stress: 'CUÁN-to', meaning: 'how much (interrogative)', example: '¿Cuánto cuesta el boleto?', isSuggested: false },

  // ═══════════════════════════════════════
  // Disyllable noun vs disyllable noun (written accent)
  // ═══════════════════════════════════════

  // papa / papá
  { word: 'papa', stress: 'PA-pa', meaning: 'potato (or: pope)', example: 'Me gusta la papa con queso.', isSuggested: true },
  { word: 'papa', stress: 'pa-PÁ', meaning: 'dad (informal)', example: 'Mi papá es ingeniero.', isSuggested: false },

  // mama / mamá
  { word: 'mama', stress: 'MA-ma', meaning: 'breast / mammary (anatomical)', example: 'El cáncer de mama es prevenible.', isSuggested: false },
  { word: 'mama', stress: 'ma-MÁ', meaning: 'mom (informal)', example: 'Mi mamá cocina muy bien.', isSuggested: false },

  // ═══════════════════════════════════════
  // Three-way verb / noun / preterite contrasts
  // (esdrújula / llana / aguda — all three Spanish stress positions)
  // ═══════════════════════════════════════

  // término / termino / terminó
  { word: 'termino', stress: 'TÉR-mi-no', meaning: 'term / end (noun)', example: 'No entiendo ese término técnico.', isSuggested: true },
  { word: 'termino', stress: 'ter-MI-no', meaning: 'I finish (terminar, present 1sg)', example: 'Termino el trabajo a las cinco.', isSuggested: false },
  { word: 'termino', stress: 'ter-mi-NÓ', meaning: 'he/she finished (terminar, preterite 3sg)', example: 'Ella terminó la tarea anoche.', isSuggested: false },

  // público / publico / publicó
  { word: 'publico', stress: 'PÚ-bli-co', meaning: 'public / audience (noun/adj)', example: 'El público aplaudió mucho.', isSuggested: true },
  { word: 'publico', stress: 'pu-BLI-co', meaning: 'I publish (publicar, present 1sg)', example: 'Publico un libro cada año.', isSuggested: false },
  { word: 'publico', stress: 'pu-bli-CÓ', meaning: 'he/she published (publicar, preterite 3sg)', example: 'El periódico publicó la noticia ayer.', isSuggested: false },

  // médico / medico / medicó
  { word: 'medico', stress: 'MÉ-di-co', meaning: 'doctor / physician (noun)', example: 'Mi médico me recomendó descansar.', isSuggested: true },
  { word: 'medico', stress: 'me-DI-co', meaning: 'I medicate (medicar, present 1sg)', example: 'Medico al paciente cada seis horas.', isSuggested: false },
  { word: 'medico', stress: 'me-di-CÓ', meaning: 'he/she medicated (medicar, preterite 3sg)', example: 'La enfermera medicó al niño con cuidado.', isSuggested: false },

  // cálculo / calculo / calculó
  { word: 'calculo', stress: 'CÁL-cu-lo', meaning: 'calculation / calculus (noun)', example: 'El cálculo del impuesto es complicado.', isSuggested: false },
  { word: 'calculo', stress: 'cal-CU-lo', meaning: 'I calculate (calcular, present 1sg)', example: 'Calculo el precio total.', isSuggested: false },
  { word: 'calculo', stress: 'cal-cu-LÓ', meaning: 'he/she calculated (calcular, preterite 3sg)', example: 'El ingeniero calculó la distancia exacta.', isSuggested: false },

  // depósito / deposito / depositó
  { word: 'deposito', stress: 'de-PÓ-si-to', meaning: 'deposit / warehouse (noun)', example: 'El depósito está lleno de cajas.', isSuggested: false },
  { word: 'deposito', stress: 'de-po-SI-to', meaning: 'I deposit (depositar, present 1sg)', example: 'Deposito mi cheque en el banco.', isSuggested: false },
  { word: 'deposito', stress: 'de-po-si-TÓ', meaning: 'he/she deposited (depositar, preterite 3sg)', example: 'Mi padre depositó el dinero ayer.', isSuggested: false },

  // ═══════════════════════════════════════
  // Verb 1sg-present vs 3sg-preterite (most productive pattern)
  // ═══════════════════════════════════════

  // hablo / habló
  { word: 'hablo', stress: 'HA-blo', meaning: 'I speak (hablar, present 1sg)', example: 'Hablo dos idiomas.', isSuggested: true },
  { word: 'hablo', stress: 'ha-BLÓ', meaning: 'he/she spoke (hablar, preterite 3sg)', example: 'Mi abuela habló con el médico.', isSuggested: false },

  // trabajo / trabajó
  { word: 'trabajo', stress: 'tra-BA-jo', meaning: 'work (noun) / I work (present 1sg)', example: 'Trabajo en una oficina.', isSuggested: true },
  { word: 'trabajo', stress: 'tra-ba-JÓ', meaning: 'he/she worked (trabajar, preterite 3sg)', example: 'Mi hermano trabajó en París el año pasado.', isSuggested: false },

  // canto / cantó
  { word: 'canto', stress: 'CAN-to', meaning: 'I sing (cantar, present 1sg) / song (noun)', example: 'Canto en el coro de la iglesia.', isSuggested: false },
  { word: 'canto', stress: 'can-TÓ', meaning: 'he/she sang (cantar, preterite 3sg)', example: 'La cantante cantó tres canciones.', isSuggested: false },

  // miro / miró
  { word: 'miro', stress: 'MI-ro', meaning: 'I look (mirar, present 1sg)', example: 'Miro la televisión por la noche.', isSuggested: false },
  { word: 'miro', stress: 'mi-RÓ', meaning: 'he/she looked (mirar, preterite 3sg)', example: 'El niño miró al perro con miedo.', isSuggested: false },
];

async function seedStressMinimalPairs() {
  console.log('🔊 Seeding Spanish stress-contrast minimal pairs...');
  const baseWords = new Set(pairs.map(p => p.word));
  const suggestedCount = pairs.filter(p => p.isSuggested).length;
  console.log(`   ${pairs.length} variants across ${baseWords.size} base words`);
  console.log(`   ${suggestedCount} flagged as suggested (will appear on Pronunciation Practice page)\n`);

  try {
    // Idempotency: clear existing rows before re-seeding. Stress pairs are
    // catalog data (not user-generated), so a fresh insert is the cleanest
    // semantics — if the curated set changes, we want the table to match.
    // SAFE because chaoslengua and chaoslimba use separate Neon databases;
    // do not consolidate them without first adding a language column to
    // stress_minimal_pairs and filtering this delete by language.
    await db.delete(stressMinimalPairs);
    await db.insert(stressMinimalPairs).values(pairs);

    console.log('✅ Spanish stress minimal pairs seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed stress minimal pairs:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedStressMinimalPairs();
