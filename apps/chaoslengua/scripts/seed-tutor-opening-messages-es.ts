// scripts/seed-tutor-opening-messages-es.ts
// ChaosLengua — onboarding tutor greetings keyed by learner self-assessment
//
// When a new user completes onboarding, they indicate their existing Spanish
// level. The tutor then greets them with the message matching their key.
// Messages are bilingual (Spanish + English) since the user hasn't yet had
// their CEFR level assessed — meeting them where they are.
//
// Each key must be UNIQUE in the database. The schema has an
// onConflictDoUpdate-friendly unique constraint on self_assessment_key.
//
// Usage: npx tsx scripts/seed-tutor-opening-messages-es.ts

import { db } from '@/lib/db';
import { tutorOpeningMessages } from '@/lib/db/schema';
import type { NewTutorOpeningMessage } from '@/lib/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const messages: NewTutorOpeningMessage[] = [
  {
    selfAssessmentKey: 'absolute_beginner',
    message: `¡Hola! Soy tu tutor de español. Me alegra mucho que estés aquí. (Hi! I'm your Spanish tutor, and I'm really glad you're here.)

Empezar un idioma desde cero es emocionante y puede ser difícil al mismo tiempo — eso es completamente normal. No te preocupes: vamos a ir paso a paso, y yo estaré aquí cuando tengas preguntas. (Starting a language from scratch is exciting and can also feel hard — that's completely normal. We'll go step by step, and I'll be here whenever you have questions.)

Un secreto: la mayoría de las personas que aprenden español se estancan en A2 o B1 porque ciertos temas son especialmente confusos para hablantes de inglés. ChaosLengua está diseñado para ayudarte a superar esos momentos difíciles. (A secret: most people who learn Spanish plateau at A2 or B1 because certain topics are especially confusing for English speakers. ChaosLengua is designed to help you get past those tough moments.)

¿Empezamos? (Shall we begin?)`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'some_basics',
    message: `¡Hola! Me alegra tenerte aquí. (Hi! Glad to have you here.)

Si ya conoces lo básico — saludos, presentaciones, algunos verbos en presente — estás en un buen punto de partida. Muchos estudiantes se quedan atrapados aquí porque los siguientes pasos son los más difíciles: ser vs estar, el pretérito vs el imperfecto, los pronombres de objeto. (If you already know the basics — greetings, introductions, some present-tense verbs — you're at a good starting point. Many learners get stuck right here because the next steps are the hardest ones: ser vs estar, preterite vs imperfect, object pronouns.)

No te preocupes si te sientes perdida con esos temas. Precisamente por eso existe ChaosLengua: para ayudarte a atravesar esa meseta que detiene a tanta gente. (Don't worry if those topics feel overwhelming. That's exactly why ChaosLengua exists: to help you get through the plateau that stops so many learners.)

Si tienes alguna duda, pregúntame. (If you have any questions, just ask.)`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'intermediate_plateau',
    message: `¡Bienvenida! Estoy contenta de que estés aquí. (Welcome! I'm glad you're here.)

Si has llegado hasta aquí, probablemente ya sabes una verdad incómoda: el español intermedio es *donde el verdadero trabajo comienza*. Has aprendido lo suficiente para leer un menú, mantener una conversación simple, entender la idea general de un podcast. Pero cuando intentas expresar algo más complejo, sientes que las palabras no salen bien. (If you've made it this far, you probably already know an uncomfortable truth: intermediate Spanish is *where the real work begins*. You've learned enough to read a menu, have a simple conversation, get the gist of a podcast. But when you try to express something more complex, the words don't come out right.)

Eso no significa que no hayas progresado. Significa que estás lista para el trabajo que muchas aplicaciones de idiomas ignoran: romper los patrones fosilizados, atacar los temas que siempre te confunden (ser/estar, por/para, el subjuntivo), y pasar de "sobrevivir en español" a "pensar en español". (This doesn't mean you haven't progressed. It means you're ready for the work most language apps ignore: breaking fossilized patterns, tackling the topics that always confuse you (ser/estar, por/para, the subjunctive), and moving from "surviving in Spanish" to "thinking in Spanish".)

ChaosLengua está construido exactamente para este momento. Cuéntame qué te cuesta más. (ChaosLengua was built exactly for this moment. Tell me what trips you up the most.)`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'confident_intermediate',
    message: `¡Hola! Encantada de conocerte. (Hi! Great to meet you.)

Si ya te sientes cómoda en español para la mayoría de situaciones diarias, estás en un territorio interesante. Puedes mantener conversaciones extensas, leer textos complejos, seguir películas sin subtítulos (la mayor parte del tiempo). Pero es probable que todavía haya patrones que se resisten: el subjuntivo en contextos nuevos, la diferencia entre *conocía* y *conocí*, ciertos usos de *se* que nunca terminan de cuajar. (If you feel comfortable in Spanish for most everyday situations, you're in an interesting place. You can hold extended conversations, read complex texts, follow films without subtitles (most of the time). But there are probably still patterns that resist you: subjunctive in new contexts, the difference between *conocía* and *conocí*, certain uses of *se* that never quite click.)

El objetivo a este nivel es automatización y refinamiento. Vamos a identificar los patrones exactos donde todavía titubeas bajo presión, y a trabajarlos hasta que salgan solos. (The goal at this level is automatization and refinement. We'll identify the exact patterns where you still hesitate under pressure, and work on them until they come out automatically.)

¿Hay algo específico que sientes que siempre se te resiste? (Is there anything specific you feel always trips you up?)`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'returning_learner',
    message: `¡Bienvenida de vuelta al español! (Welcome back to Spanish!)

Volver a un idioma que estudiaste hace tiempo tiene sus ventajas y sus frustraciones. Por un lado, hay cosas que todavía recuerdas: vocabulario, estructuras, ciertos patrones. Por otro lado, hay un desajuste molesto entre lo que *sabes que podías hacer antes* y lo que puedes hacer ahora. Eso es normal, y vuelve rápido. (Coming back to a language you studied long ago has both advantages and frustrations. On one hand, things you still remember: vocabulary, structures, certain patterns. On the other hand, there's an annoying gap between what *you know you used to be able to do* and what you can do now. That's normal, and it comes back fast.)

Mi recomendación: no asumas que estás en el mismo nivel que antes — podrías estar más arriba o más abajo de lo que crees, y quiero evaluarte donde realmente estás ahora, no donde estabas hace años. (My recommendation: don't assume you're at the same level as before — you might be higher or lower than you think, and I want to assess where you actually are now, not where you were years ago.)

Empecemos con eso. (Let's start there.)`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'advanced',
    message: `¡Hola! Qué bueno tenerte aquí. (Hi! So glad to have you here.)

A un nivel avanzado, el trabajo cambia de naturaleza. Ya no se trata de aprender reglas nuevas, sino de pulir lo que ya sabes: eliminar errores fosilizados que han sobrevivido años de práctica, afinar tu registro según el contexto, desarrollar una sensibilidad hacia las variaciones regionales. (At an advanced level, the work changes in nature. It's no longer about learning new rules, but about polishing what you already know: eliminating fossilized errors that have survived years of practice, fine-tuning your register based on context, developing sensitivity to regional variation.)

El avanzado es el terreno donde la destabilización controlada — el método principal de ChaosLengua — brilla más. Vamos a identificar patrones que todavía no son completamente automáticos, y a romperlos sistemáticamente. (Advanced level is where controlled destabilization — ChaosLengua's core method — shines brightest. We'll identify patterns that aren't fully automatic yet, and break them systematically.)

Dime: ¿qué es lo que últimamente sientes que todavía te cuesta más? (Tell me: what's the thing you still feel is hardest for you lately?)`,
    isActive: true,
  },
];

async function seedTutorOpeningMessages() {
  console.log('💬 Seeding Spanish tutor opening messages...');
  console.log(`   ${messages.length} total self-assessment keys:`);
  for (const m of messages) {
    console.log(`   - ${m.selfAssessmentKey}`);
  }
  console.log('');

  try {
    for (const message of messages) {
      await db
        .insert(tutorOpeningMessages)
        .values(message)
        .onConflictDoUpdate({
          target: tutorOpeningMessages.selfAssessmentKey,
          set: {
            message: message.message,
            isActive: message.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log('✅ Tutor opening messages seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed tutor opening messages:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedTutorOpeningMessages();
