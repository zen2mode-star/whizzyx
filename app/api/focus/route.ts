import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const focus = await prisma.currentFocus.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(focus || { problem: 'No problem set yet.', status: 'Idle' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem, status } = body;
    
    // We'll just update the first one or create if none exists
    const existing = await prisma.currentFocus.findFirst();
    let focus;
    if (existing) {
      focus = await prisma.currentFocus.update({
        where: { id: existing.id },
        data: { problem, status }
      });
    } else {
      focus = await prisma.currentFocus.create({
        data: { problem, status }
      });
    }
    
    return NextResponse.json(focus);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update focus' }, { status: 500 });
  }
}
