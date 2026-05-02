import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.$queryRawUnsafe(`SELECT * FROM "Project" ORDER BY "createdAt" DESC`);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, links, currentMilestone, finalDestination } = body;
    
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Project" (title, description, "videoUrl", links, "currentMilestone", "finalDestination") VALUES ($1, $2, $3, $4, $5, $6)`,
      title, description, videoUrl, links, currentMilestone, finalDestination
    );
    
    const projects = await prisma.$queryRawUnsafe(`SELECT * FROM "Project" ORDER BY id DESC LIMIT 1`);
    const project = Array.isArray(projects) ? projects[0] : null;
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
