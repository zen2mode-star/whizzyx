import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem, solution, userEmail, userName } = body;
    const suggestion = await prisma.suggestion.create({
      data: { problem, solution, userEmail, userName },
    });
    return NextResponse.json(suggestion);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
