// scripts/seed-tutor-opening-messages-es.ts
// ChaosLengua — onboarding tutor greetings keyed by learner self-assessment
//
// When a new user completes onboarding, they indicate their existing Spanish
// level. The tutor then greets them with the message matching their key.
//
// LANGUAGE MODEL: Messages are 95%+ English with strategic Spanish sprinkles
// (greetings, quoted concept names) since the user hasn't yet been level-
// assessed. This mirrors ChaosLimbă's pedagogy — Tutor speaks the learner's
// L1 by default and graduates to more L2 only as proficiency is established.
// Wall-of-Spanish-with-English-in-parens is intentionally avoided: it's
// overwhelming for true beginners and patronizing for advanced users.
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
    message: `¡Hola! I'm your Spanish tutor — really glad you're here.

Starting a language from scratch is exciting and can feel overwhelming at the same time. That's normal. We'll go step by step, and I'll be here whenever you have questions.

A secret most beginner apps don't tell you: most learners plateau at A2 or B1, because certain Spanish topics are especially tough for English speakers — *ser* vs *estar*, the past-tense aspect distinction, the subjunctive mood. ChaosLengua exists to help you get past those tough moments when you reach them.

For now, let's just chat. Tell me a bit about what's bringing you to Spanish — is there a place, person, or reason that pulled you in?`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'some_basics',
    message: `¡Hola! Glad to have you here.

If you already know greetings, introductions, and some present-tense verbs, you're at a solid starting point. Heads up: a lot of learners get stuck right around where you are — the next steps include the toughest parts of Spanish for English speakers (*ser* vs *estar*, the preterite/imperfect aspect distinction, object pronouns).

Don't worry if those feel overwhelming when we get to them. ChaosLengua exists exactly to help learners cross that plateau.

For now, just chat with me however feels comfortable — English, Spanish, or a mix. Tell me a bit about your Spanish learning so far.`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'intermediate_plateau',
    message: `¡Bienvenida! Glad you're here.

If you've made it this far, you probably already know an uncomfortable truth: intermediate Spanish is *where the real work begins*. You've learned enough to read a menu, hold a simple conversation, get the gist of a podcast — but when you try to express something more complex, the words don't come out the way you want.

That doesn't mean you haven't progressed. It means you're ready for the work most language apps avoid: breaking fossilized patterns, tackling the topics that always trip you up (*ser/estar*, *por/para*, the subjunctive), and moving from "surviving in Spanish" to "thinking in Spanish."

ChaosLengua was built exactly for this moment. Tell me what trips you up the most lately.`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'confident_intermediate',
    message: `¡Hola! Great to meet you.

If you feel comfortable in Spanish for most everyday situations, you're in interesting territory. You can hold extended conversations, read complex texts, follow films without subtitles (most of the time). But there are probably still patterns that resist you: subjunctive in unfamiliar contexts, the difference between *conocía* and *conocí*, certain uses of *se* that never quite click.

The work at this level is about automatization and refinement — identifying the exact patterns where you still hesitate under pressure, and working on them until they come out naturally.

Anything specific you feel always trips you up?`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'returning_learner',
    message: `¡Bienvenida de vuelta! Welcome back to Spanish.

Coming back to a language you studied a while ago has its own dynamic. Some things you still remember — vocabulary, structures, certain patterns. Other things have an annoying gap between *what you used to be able to do* and *what you can do now*. That's normal, and it comes back faster than you'd think.

My recommendation: don't assume you're at the same level as before. You might be higher or lower than you remember, and I'd rather assess where you actually are right now than where you were years ago.

Let's start there. Tell me a bit about your Spanish history — when you studied, how far you got, what feels rusty.`,
    isActive: true,
  },
  {
    selfAssessmentKey: 'advanced',
    message: `¡Hola! So glad to have you here.

At an advanced level, the work changes shape. It's no longer about learning new rules — it's about polishing what you already know: eliminating fossilized errors that have survived years of practice, fine-tuning your register depending on context, developing sensitivity to regional variation.

Advanced is where ChaosLengua's main method — controlled destabilization — does its best work. We identify patterns that aren't fully automatic yet, and break them until they reorganize cleanly.

Tell me: what's the thing you still feel is hardest for you lately?`,
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
