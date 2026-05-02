import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.currentFocus.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: 'Mission deleted' });
  } catch (error) {
    console.error('DELETE FOCUS ERROR:', error);
    return NextResponse.json({ error: 'Failed to delete mission' }, { status: 500 });
  }
}
