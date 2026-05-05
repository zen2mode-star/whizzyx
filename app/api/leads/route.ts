import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await prisma.visitorLead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, interest } = body;
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const lead = await prisma.visitorLead.create({
      data: { name, email, interest }
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('LEAD_POST_ERROR:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
