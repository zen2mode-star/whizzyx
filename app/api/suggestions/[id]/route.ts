import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const admin = await prisma.adminUser.findFirst();
    if (!token || token !== admin?.password) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const suggestionId = parseInt(id, 10);

    // Delete related contributions first to avoid foreign key constraint issues
    await prisma.contribution.deleteMany({
      where: { suggestionId },
    });

    await prisma.suggestion.delete({
      where: { id: suggestionId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 });
  }
}
