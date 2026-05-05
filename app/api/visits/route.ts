import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await prisma.visitLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Last 100 visits
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || 'unknown';
    const userAgent = headerList.get('user-agent');

    const log = await prisma.visitLog.create({
      data: { ip, userAgent }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('VISIT_LOG_ERROR:', error);
    return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
  }
}
