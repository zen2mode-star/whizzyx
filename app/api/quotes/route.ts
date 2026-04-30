import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text, designation } = await request.json();
    const quote = await prisma.quote.create({ data: { text, designation } });
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
