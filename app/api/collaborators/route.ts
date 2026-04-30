import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collaborators = await prisma.collaborator.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(collaborators);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, skills, why, portfolio } = await request.json();
    const collab = await prisma.collaborator.create({ data: { name, email, skills, why, portfolio } });
    return NextResponse.json(collab);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
