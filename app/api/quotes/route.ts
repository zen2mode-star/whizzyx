import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({ 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text, designation, order } = await request.json();
    const quote = await prisma.quote.create({ 
      data: { text, designation, order: order || 0 } 
    });
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { quotes } = await request.json(); // Array of { id, order }
    await Promise.all(
      quotes.map((q: any) => 
        prisma.quote.update({
          where: { id: q.id },
          data: { order: q.order }
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder quotes' }, { status: 500 });
  }
}
