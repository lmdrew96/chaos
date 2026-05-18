import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getWeakStressWords } from '@/lib/db/queries';

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const weakWords = await getWeakStressWords(userId);
    return NextResponse.json({ weakWords });
  } catch (error) {
    console.error('Failed to fetch weak stress words:', error);
    return NextResponse.json({ error: 'Failed to fetch weak words' }, { status: 500 });
  }
}
