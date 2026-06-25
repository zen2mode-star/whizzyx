import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const admin = await prisma.adminUser.findFirst();
    if (!token || token !== admin?.password) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

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
