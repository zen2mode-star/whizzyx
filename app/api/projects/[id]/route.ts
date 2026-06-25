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
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const admin = await prisma.adminUser.findFirst();
    if (!token || token !== admin?.password) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    console.log('PROJECT_PATCH_RECEIVED:', { id, body });

    // The frontend sends individual fields (demoUrl, pdfUrl, thumbnailUrl, displayTitle).
    // We must reconstruct the 'links' string from them, otherwise uploaded PDFs are lost.
    // Format: |||demoUrl|||pdfUrl|||thumbnailUrl|||displayTitle
    let linksToSave = body.links;
    if (body.demoUrl !== undefined || body.pdfUrl !== undefined || body.thumbnailUrl !== undefined || body.displayTitle !== undefined) {
      linksToSave = `|||${body.demoUrl || ''}|||${body.pdfUrl || ''}|||${body.thumbnailUrl || ''}|||${body.displayTitle || ''}`;
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        links: linksToSave,
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
