import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const adminExists = await prisma.adminUser.findFirst();
    if (!token || token !== adminExists?.password) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, newPassword } = await request.json();
    
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.adminUser.update({
      where: { username },
      data: { password: newPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
