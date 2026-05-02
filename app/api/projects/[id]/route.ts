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
    // Using raw query to bypass client-sync issues where 'finalDestination' is seen as unknown
    if (body.finalDestination !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Project" SET "finalDestination" = $1 WHERE id = $2`,
        body.finalDestination,
        parseInt(id)
      );
    }
    
    // Fetch updated project using raw query to ensure all fields (even unrecognized ones) are returned
    const projects = await prisma.$queryRawUnsafe(`SELECT * FROM "Project" WHERE id = $1`, parseInt(id));
    const project = Array.isArray(projects) ? projects[0] : null;
    return NextResponse.json(project);
  } catch (error) {
    console.error('PATCH ERROR:', error);
    return NextResponse.json({ error: 'Failed to update', details: (error as any).message }, { status: 500 });
  }
}
