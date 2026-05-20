// scripts/seed-stem-change-commands-es.ts
// ChaosLengua — stem-changing verbs + informal commands exercise set (A2 grammar)
//
// 9 content items covering three interconnected A2 grammar phenomena:
//
// Distribution:
// - 3 items tagged stem_changing_e_ie: querer/entender/pensar, preferir/perder/
//   empezar/sentir, sentir/venir/mentir
// - 3 items tagged stem_changing_o_ue: poder/volver/dormir, recordar/encontrar/
//   mostrar/contar, soñar/contar/devolver
// - 3 items tagged informal_commands_tu: regular affirmative (3sg present rule),
//   irregular affirmative (sé/pon/ten/sal/haz/di/ve/ven), negative commands
//   (present subjunctive — no hables/no comas/no salgas)
//
// The imperfect_habitual feature key appears as secondary tagging in narrative
// items where habitual past naturally co-occurs with stem-changing verbs.
// Key insight flagged in passages: stem change is present-tense only — imperfect
// is regular (quería, not quiería; soñaba, not soñueba).
//
// Difficulty: 2.5–3.5.
// Dialectal baseline: LatAm-neutral.
//
// PREREQUISITE: seed-grammar-features-es.ts must run first.

import { db } from '@/lib/db';
import { contentItems, type NewContentItem } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const stemChangeCommandsContent: NewContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // STEM_CHANGING_E→IE (3 items)
  // BOOT pattern: stem changes in all persons EXCEPT nosotros/vosotros
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: '¿Qué quieres comer?',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Preferencias y comida familiar',
    textContent: `Mi familia no siempre quiere comer lo mismo. Mi hermana quiere pizza. Yo quiero tacos. Mi madre quiere ensalada. Mi padre quiere sopa. Nadie entiende a nadie.

"No entiendo por qué no pueden decidir", dice mi madre. Pienso que el problema es que todos tenemos gustos diferentes. Mi hermana piensa lo mismo.

Al final, pedimos comida para todos. Pienso que esta es la mejor solución. Mi padre también lo piensa.

Nota gramatical: "querer" cambia en el presente — quiero, quieres, quiere, queremos, quieren. El cambio e→ie ocurre en todas las personas menos "nosotros": queremos (sin cambio). Lo mismo con pensar: pienso/piensas/piensa/pensamos/piensan. Y entender: entiendo/entiendes/entiende/entendemos/entienden.`,
    languageFeatures: {
      grammar: [
        'stem_changing_e_ie',
        'present_tense_regular_ar',
        'gender_agreement',
        'direct_object_pronoun_preverbal',
      ],
      vocabulary: {
        keywords: ['querer', 'entender', 'pensar', 'pizza', 'tacos', 'ensalada', 'sopa', 'gustos', 'decisión'],
        requiredVocabSize: 60,
      },
      structures: [
        'E→IE: querer → quiero/quieres/quiere/queremos/quieren',
        'E→IE: pensar → pienso/piensas/piensa/pensamos/piensan',
        'E→IE: entender → entiendo/entiendes/entiende/entendemos/entienden',
        'BOOT pattern: nosotros form has NO stem change (queremos, pensamos, entendemos)',
        'Explicit meta-commentary at end of passage',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El torneo de ajedrez',
    difficultyLevel: '3.0',
    durationSeconds: 115,
    topic: 'Competencias y preferencias',
    textContent: `Mi amigo Lorenzo prefiere el ajedrez a todos los otros juegos. El torneo empieza el próximo sábado. Él ya empieza a prepararse.

Cuando pierde una partida, no se desespera. Entiende que perder forma parte del proceso. "Pierdo, pero aprendo", dice siempre. Yo pienso que tiene razón.

Su rival Amara también prefiere el ajedrez. Ella siente que este torneo es especial. Cuando el torneo empieza, todos sentimos la tensión. Lorenzo prefiere pensar mucho antes de mover una pieza. Amara prefiere actuar rápido.

¿Quién ganará? El torneo empieza en tres días. Ya empiezo a ponerme nervioso.`,
    languageFeatures: {
      grammar: [
        'stem_changing_e_ie',
        'reflexive_verbs_es',
        'future_informal_ir_a',
        'preterite_perfective',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['preferir', 'perder', 'empezar', 'sentir', 'ajedrez', 'torneo', 'partida', 'rival', 'tensión', 'pieza'],
        requiredVocabSize: 75,
      },
      structures: [
        'E→IE: preferir → prefiero/prefieres/prefiere/preferimos/prefieren',
        'E→IE: perder → pierdo/pierdes/pierde/perdemos/pierden',
        'E→IE: empezar → empiezo/empiezas/empieza/empezamos/empiezan',
        'E→IE: sentir → siento/sientes/siente/sentimos/sienten',
        'Multiple e→ie verbs in same passage — pattern recognition through density',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que siento de verdad',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Emociones, honestidad y relaciones',
    textContent: `A veces no digo lo que siento. Prefiero guardar silencio. Mi amiga Andrea viene a verme cuando está triste. Siempre viene con sus problemas. Yo la escucho.

Ella entiende cuando no hablo mucho. "Sientes cosas que no dices", me dijo una vez. Tiene razón. Siento muchas cosas. Pienso mucho. Pero no siempre encuentro las palabras.

Antes, cuando éramos jóvenes, no entendía mis emociones. No entendía por qué me sentía así. Ahora lo entiendo mejor. Andrea también ha cambiado — antes mentía sobre cómo se sentía. Ahora dice la verdad. "Miento menos", me dijo ayer.

Cuando uno siente algo importante, conviene decirlo. Vengo aprendiendo eso poco a poco.`,
    languageFeatures: {
      grammar: [
        'stem_changing_e_ie',
        'imperfect_habitual',
        'preterite_perfective',
        'reflexive_verbs_es',
        'indirect_object_pronoun_preverbal',
      ],
      vocabulary: {
        keywords: ['sentir', 'venir', 'mentir', 'entender', 'preferir', 'emociones', 'honesta', 'silencio', 'palabras'],
        requiredVocabSize: 85,
      },
      structures: [
        'E→IE present: siento/sientes/siente; vengo/vienes/viene (note: vengo — irregular yo)',
        'E→IE present: miento/mientes/miente; entiendo/entiendes/entiende',
        'Imperfect of stem-change verbs has NO stem change: entendía, mentía, sentía',
        'Key contrast: present siento vs imperfect sentía — stem changes only in present',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // STEM_CHANGING_O→UE (3 items)
  // BOOT pattern applies: no stem change in nosotros/vosotros
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'El domingo en casa',
    difficultyLevel: '2.5',
    durationSeconds: 100,
    topic: 'Rutina dominical y descanso',
    textContent: `Los domingos, no puedo levantarme temprano. Duermo hasta las diez o las once. Cuando vuelvo de casa de mis amigos el sábado, siempre vuelvo cansado. Por eso el domingo no puedo hacer mucho.

Mi hermano también duerme hasta tarde. No puede levantarse. "¿Puedes traerme agua?", le pregunto. "No puedo", dice. "Duermo."

Por la tarde, los dos volvemos a la vida. Comemos, hablamos, salimos un poco. Mi hermano siempre vuelve a casa antes de las nueve. Yo también vuelvo temprano. El lunes llega rápido.

¿Cuántas horas duermes tú los domingos?`,
    languageFeatures: {
      grammar: [
        'stem_changing_o_ue',
        'reflexive_verbs_es',
        'present_tense_regular_er_ir',
        'basic_questions',
      ],
      vocabulary: {
        keywords: ['poder', 'volver', 'dormir', 'levantarse', 'temprano', 'cansado', 'tarde', 'domingo'],
        requiredVocabSize: 55,
      },
      structures: [
        'O→UE: poder → puedo/puedes/puede/podemos/pueden',
        'O→UE: volver → vuelvo/vuelves/vuelve/volvemos/vuelven',
        'O→UE: dormir → duermo/duermes/duerme/dormimos/duermen',
        'BOOT pattern: nosotros dormimos / volvemos / podemos — no stem change',
        'Closing question invites learner to produce the stem-changed form',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Las fotos del pasado',
    difficultyLevel: '3.0',
    durationSeconds: 115,
    topic: 'Memorias, fotografías y familia',
    textContent: `Cuando encuentro fotos antiguas de mi familia, siempre recuerdo cosas del pasado. Mi abuela me muestra álbumes viejos. Encuentro fotos de mis padres cuando eran jóvenes.

"¿Recuerdas este día?", le pregunto a mi madre. Ella recuerda todo. Me cuenta historias de cuando era niña. Me muestra cosas que no cuento a nadie más.

Mi tío Jorge recuerda menos. "Encuentro la memoria difícil a mi edad", dice. Pero cuando encuentra una foto específica, todo le vuelve. Le cuento que eso me parece hermoso: cómo una imagen muestra lo que las palabras no encuentran.

Los recuerdos son así: dormidos hasta que algo los despierta. Y cuando los encuentras, te cuentan quién eres.`,
    languageFeatures: {
      grammar: [
        'stem_changing_o_ue',
        'imperfect_habitual',
        'preterite_perfective',
        'indirect_object_pronoun_preverbal',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['recordar', 'encontrar', 'mostrar', 'contar', 'fotos', 'álbumes', 'recuerdos', 'memoria', 'imagen'],
        requiredVocabSize: 75,
      },
      structures: [
        'O→UE: recordar → recuerdo/recuerdas/recuerda/recordamos/recuerdan',
        'O→UE: encontrar → encuentro/encuentras/encuentra/encontramos/encuentran',
        'O→UE: mostrar → muestro/muestras/muestra/mostramos/muestran',
        'O→UE: contar → cuento/cuentas/cuenta/contamos/cuentan',
        'Four o→ue verbs in one passage — high density for pattern recognition',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'El sueño de Mateo',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Sueños, realidad y responsabilidades',
    textContent: `Mi amigo Mateo sueña con ser músico. Cuenta que de niño siempre soñaba con tocar en conciertos grandes. Ahora puede hacerlo. Toca en pequeños bares del centro.

A veces vuelve a casa muy tarde. Su madre le recuerda: "No puedes volver a casa después de las dos." Él le devuelve una sonrisa. "Lo sé, mamá", dice. "Te lo prometo."

Cuando Mateo cuenta sus historias de escenario, todos lo escuchamos. Nos muestra videos de sus actuaciones. Cuenta que nunca duerme bien antes de un concierto. "Sueño que olvido las letras", dice. "Siempre el mismo sueño."

Pero cuando empieza a tocar, todo se olvida. Su sueño de ser músico devuelve algo que muchos perdemos: la sensación de hacer lo que uno quiere.`,
    languageFeatures: {
      grammar: [
        'stem_changing_o_ue',
        'imperfect_habitual',
        'combined_object_pronoun_preverbal',
        'reflexive_verbs_es',
        'indirect_object_pronoun_preverbal',
      ],
      vocabulary: {
        keywords: ['soñar', 'contar', 'devolver', 'volver', 'poder', 'dormir', 'músico', 'concierto', 'escenario', 'actuaciones', 'letras'],
        requiredVocabSize: 85,
      },
      structures: [
        'O→UE: soñar → sueño/sueñas/sueña/soñamos/sueñan',
        'O→UE: devolver → devuelvo/devuelves/devuelve/devolvemos/devuelven',
        'Imperfect of o→ue: soñaba (NO stem change in imperfect — soñaba not sueñaba)',
        'Dual meaning: sueño = I dream (verb 1sg) AND dream/wish (noun)',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  // ═══════════════════════════════════════════════════════════════
  // INFORMAL_COMMANDS_TÚ (3 items)
  // Regular affirmative → irregular affirmative → negative commands
  // ═══════════════════════════════════════════════════════════════

  {
    type: 'text',
    title: 'La abuela manda',
    difficultyLevel: '2.5',
    durationSeconds: 105,
    topic: 'Familia, cocina y autoridad afectuosa',
    textContent: `Mi abuela siempre da órdenes en la cocina. A mí me dice: "¡Lava los platos!" A mi hermano: "¡Corta las zanahorias!" A mi primo: "¡Abre la ventana!"

Los mandatos informales regulares son fáciles: usa la forma él/ella del presente. "Él habla" → "¡Habla!" "Él come" → "¡Come!" "Él abre" → "¡Abre!" "Él lava" → "¡Lava!"

Después de comer, mi abuela dice: "¡Espera un momento!" Me sirve postre. "¡Come todo!", dice. "¡Bebe el jugo!" Y yo obedezco, porque el postre de mi abuela es delicioso.

Antes de salir, me dice: "¡Llama cuando llegues! ¡Camina con cuidado! ¡Y vuelve pronto!" Con mi abuela, siempre hay muchos mandatos. Pero todos con mucho amor.`,
    languageFeatures: {
      grammar: [
        'informal_commands_tu',
        'present_tense_regular_ar',
        'present_tense_regular_er_ir',
        'indirect_object_pronoun_preverbal',
      ],
      vocabulary: {
        keywords: ['lavar', 'cortar', 'abrir', 'esperar', 'llamar', 'caminar', 'volver', 'mandatos', 'zanahorias', 'postre'],
        requiredVocabSize: 60,
      },
      structures: [
        'Regular affirmative tú commands = 3sg present: habla, come, abre, lava, corta, espera, bebe, llama, camina',
        'O→UE command: vuelve (from volver → vuelve, following 3sg present pattern)',
        'Explicit rule stated within passage: usa la forma él/ella del presente',
        'Commands natural in family/kitchen register — high authenticity',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Consejos del hermano mayor',
    difficultyLevel: '3.0',
    durationSeconds: 120,
    topic: 'Vida, consejos y relaciones fraternales',
    textContent: `Mi hermano mayor siempre me da consejos. Cuando empecé la universidad, me dijo muchas cosas.

"Sé puntual. Pon atención en clase. Ten paciencia con tus profesores. Sal con amigos, pero estudia primero. Haz tu tarea cada día. Di siempre la verdad. Ve a las clases aunque no quieras."

Estos verbos — ser, poner, tener, salir, hacer, decir, ir — tienen formas irregulares en el imperativo informal: sé, pon, ten, sal, haz, di, ve. Son siete verbos irregulares básicos. Mi hermano los usa mucho.

A veces me dice: "Ven a visitarme los fines de semana." "Ven" es el imperativo de "venir". También irregular.

¿Recuerdas todos? Sé, pon, ten, sal, haz, di, ve, ven. Ocho formas para memorizar.`,
    languageFeatures: {
      grammar: [
        'informal_commands_tu',
        'preterite_perfective',
        'imperfect_descriptive',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['consejos', 'puntual', 'paciencia', 'tarea', 'universidad', 'irregular', 'imperativo', 'memorizar'],
        requiredVocabSize: 70,
      },
      structures: [
        'Irregular affirmative tú commands: sé (ser), pon (poner), ten (tener), sal (salir), haz (hacer), di (decir), ve (ir), ven (venir)',
        'Explicit enumeration of the 8 classic irregular command forms',
        'Contrast implied: regular = 3sg present; irregular = memorize separately',
        'Closing list serves as a study reference built into the passage itself',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },

  {
    type: 'text',
    title: 'Lo que no debes hacer',
    difficultyLevel: '3.5',
    durationSeconds: 130,
    topic: 'Reglas, límites y consejos negativos',
    textContent: `Mi madre tiene muchas reglas. Me las dice con mandatos negativos.

"No hables con la boca llena. No comas tan rápido. No salgas sin abrigo cuando llueve. No llegues tarde a cenar."

Los mandatos negativos usan el subjuntivo: no hables (no "no habla"), no comas, no salgas, no llegues. Es diferente del mandato afirmativo: "habla" pero "no hables". "Come" pero "no comas". "Sal" pero "no salgas".

Para los irregulares también: no vayas (ir), no seas (ser), no tengas (tener), no hagas (hacer), no digas (decir), no pongas (poner).

Mi madre no sabe que esto se llama "subjuntivo". Solo sabe que funciona. "No te vayas sin despedirte. No seas descortés. Y no olvides llamarme."

Lo que sé es esto: la misma persona que me dice lo que no debo hacer también es la persona que más me quiere.`,
    languageFeatures: {
      grammar: [
        'informal_commands_tu',
        'stem_changing_e_ie',
        'stem_changing_o_ue',
        'reflexive_verbs_es',
        'gender_agreement',
      ],
      vocabulary: {
        keywords: ['mandato', 'negativo', 'subjuntivo', 'abrigo', 'descortés', 'despedirse', 'reglas', 'límites'],
        requiredVocabSize: 80,
      },
      structures: [
        'Negative tú commands = present subjunctive: no hables, no comas, no salgas, no llegues',
        'Affirmative vs negative contrast pairs: habla/no hables, come/no comas, sal/no salgas',
        'Irregular negative commands: no vayas, no seas, no tengas, no hagas, no digas, no pongas',
        'Reflexive negative command: no te vayas — pronoun precedes the verb in negatives',
      ],
    },
    sourceAttribution: { creator: 'ChaosLengua Team', license: 'Original' },
  },
];

async function seedStemChangeCommandsContent() {
  console.log('🌱 Seeding stem-changing verbs + informal commands exercise set (A2 grammar)...');
  console.log('   3 stem_changing_e_ie items (querer/entender/pensar → preferir/perder/empezar → sentir/venir/mentir)');
  console.log('   3 stem_changing_o_ue items (poder/volver/dormir → recordar/encontrar/mostrar/contar → soñar/devolver)');
  console.log('   3 informal_commands_tu items (regular affirmative → 8 irregular forms → negative commands)');
  console.log(`   ${stemChangeCommandsContent.length} total items at difficulty 2.5–3.5\n`);

  try {
    const inserted = await db.insert(contentItems).values(stemChangeCommandsContent).returning();
    console.log(`✅ Seeded ${inserted.length} stem-change + commands content items.`);
  } catch (error) {
    console.error('❌ Failed to seed stem-change content:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedStemChangeCommandsContent();
