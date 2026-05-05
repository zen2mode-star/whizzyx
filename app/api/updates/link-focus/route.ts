import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

    // Update all updates that have NO projectId (orphans from the current focus)
    // to belong to the new project
    await prisma.buildUpdate.updateMany({
      where: { projectId: null },
      data: { projectId: parseInt(projectId) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LINK FOCUS ERROR:', error);
    return NextResponse.json({ error: 'Failed to link updates' }, { status: 500 });
  }
}
