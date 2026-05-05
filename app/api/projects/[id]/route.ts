import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('PROJECT_PATCH_RECEIVED:', { id, body });
    
    // Using standard prisma update to handle fields properly
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        links: body.links,
        currentMilestone: body.currentMilestone,
        finalDestination: body.finalDestination,
        statusTag: body.statusTag,
        isHidden: body.isHidden !== undefined ? body.isHidden : undefined
      }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('PATCH ERROR:', error);
    return NextResponse.json({ error: 'Failed to update', details: (error as any).message }, { status: 500 });
  }
}
