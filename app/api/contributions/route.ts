import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const suggestionId = parseInt(searchParams.get('suggestionId') || '0');
    const contributions = await prisma.contribution.findMany({
      where: { suggestionId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(contributions);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { suggestionId, text, contributorName } = await request.json();
    const contribution = await prisma.contribution.create({
      data: { suggestionId: parseInt(suggestionId), text, contributorName },
    });
    return NextResponse.json(contribution);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
