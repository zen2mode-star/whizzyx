import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const updates = await prisma.buildUpdate.findMany({
      orderBy: { date: 'asc' },
      include: { project: true }
    });
    return NextResponse.json(updates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, projectId } = body;

    const update = await prisma.buildUpdate.create({
      data: {
        title,
        content,
        excerpt,
        category: category || 'Update',
        projectId: projectId ? parseInt(projectId) : null,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Update POST error:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}
