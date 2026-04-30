import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { isFeatured } = await request.json();
    const { id } = await params;
    const suggestionId = parseInt(id, 10);
    const suggestion = await prisma.suggestion.update({
      where: { id: suggestionId },
      data: { isFeatured },
    });
    return NextResponse.json(suggestion);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}
