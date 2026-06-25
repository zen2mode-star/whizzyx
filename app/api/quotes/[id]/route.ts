import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const admin = await prisma.adminUser.findFirst();
    if (!token || token !== admin?.password) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.quote.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
