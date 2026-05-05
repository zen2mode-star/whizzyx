import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { focus: true }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('PROJECTS_GET_ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('PROJECT_POST_RECEIVED:', body);
    const { title, description, videoUrl, links, demoUrl, pdfUrl, currentMilestone, finalDestination, statusTag, isHidden } = body;
    
    // Strategy: Combine Architecture, Demo, PDF into the single existing 'links' field if provided separately
    let finalLinks = links;
    if (!links && (demoUrl || pdfUrl)) {
      finalLinks = `|||${demoUrl || ''}|||${pdfUrl || ''}|||${body.thumbnailUrl || ''}|||${body.displayTitle || ''}`;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        videoUrl,
        links: finalLinks,
        currentMilestone,
        finalDestination,
        statusTag: statusTag || "Just Idea",
        isHidden: !!isHidden
      }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('POST ERROR:', error);
    return NextResponse.json({ error: 'Failed to create project', details: (error as any).message }, { status: 500 });
  }
}
