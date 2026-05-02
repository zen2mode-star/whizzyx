import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Find the current latest non-hibernated focus
    const focus = await prisma.currentFocus.findFirst({
      where: {
        status: { not: 'Hibernated' }
      },
      orderBy: { id: 'desc' }
    });

    if (focus) {
      // Hibernate all missions with this same problem title to prevent duplicates from resurfacing
      await prisma.currentFocus.updateMany({
        where: { problem: focus.problem },
        data: { status: 'Hibernated' }
      });
      return NextResponse.json({ success: true, message: 'Mission hibernated' });
    }

    return NextResponse.json({ success: false, message: 'No active mission found' }, { status: 404 });
  } catch (error) {
    console.error('HIBERNATE ERROR:', error);
    return NextResponse.json({ error: 'Failed to hibernate mission' }, { status: 500 });
  }
}
