import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Find the current latest non-hibernated focus
    const activeFocusList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE status != 'Hibernated' ORDER BY id DESC LIMIT 1`);
    const focus = Array.isArray(activeFocusList) && activeFocusList.length > 0 ? activeFocusList[0] : null;

    if (focus) {
      // Hibernate all missions with this same problem title to prevent duplicates from resurfacing
      await prisma.$executeRawUnsafe(
        `UPDATE "CurrentFocus" SET status = 'Hibernated' WHERE problem = $1`,
        focus.problem
      );
      return NextResponse.json({ success: true, message: 'Mission hibernated' });
    }

    return NextResponse.json({ success: false, message: 'No active mission found' }, { status: 404 });
  } catch (error) {
    console.error('HIBERNATE ERROR:', error);
    return NextResponse.json({ error: 'Failed to hibernate mission' }, { status: 500 });
  }
}
