import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const focus = await prisma.currentFocus.findFirst({
      orderBy: { updatedAt: 'desc' },
      include: { project: true }
    });
    return NextResponse.json(focus || { problem: 'No problem set yet.', status: 'Idle' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem, status, projectId } = body;
    
    const existing = await prisma.currentFocus.findFirst();
    let focus;
    const data = { 
      problem, 
      status, 
      projectId: projectId ? parseInt(projectId) : null 
    };

    if (existing) {
      focus = await prisma.currentFocus.update({
        where: { id: existing.id },
        data
      });
    } else {
      focus = await prisma.currentFocus.create({
        data
      });
    }
    
    return NextResponse.json(focus);
  } catch (error) {
    console.error('Focus update error:', error);
    return NextResponse.json({ error: 'Failed to update focus' }, { status: 500 });
  }
}
