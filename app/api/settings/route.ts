import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULTS: Record<string, string> = {
  heroTitle: 'Self-Initiated Startup Idea & Creative Systems',
  heroSubtitle: 'Identifying and solving real-world inefficiencies through technical innovation and non-linear thinking. Building impactful tools with a "build-first" mindset.',
  heroTagline: '— Welcome to my workshop! 🛠️',
  sectionProjectsTitle: 'Featured Projects',
  sectionCommunityTitle: 'Community Wall',
  sectionSuggestTitle: 'Got a Problem to Solve?',
};

export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(DEFAULTS);
  }
}

export async function POST(request: Request) {
  try {
    const updates: Record<string, string> = await request.json();
    for (const [key, value] of Object.entries(updates)) {
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
