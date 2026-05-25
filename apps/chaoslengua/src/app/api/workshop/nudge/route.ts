import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getWorkshopFeatureTarget } from '@/lib/db/queries';
import type { CEFRLevelEnum } from '@/lib/db/schema';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prefs = await db
      .select({ languageLevel: userPreferences.languageLevel })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const userLevel = (prefs[0]?.languageLevel || 'A1') as CEFRLevelEnum;
    const target = await getWorkshopFeatureTarget(userId, userLevel);

    return NextResponse.json({
      phonologyRecommended: target?.phonologyRecommended ?? false,
      phonologyFeatureKey: target?.phonologyFeatureKey ?? null,
    });
  } catch (error) {
    console.error('[Workshop Nudge API] Error:', error);
    return NextResponse.json({ phonologyRecommended: false, phonologyFeatureKey: null });
  }
}
