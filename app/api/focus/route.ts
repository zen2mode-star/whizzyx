import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Active';
    
    if (status === 'all') {
      const allFocus = await prisma.currentFocus.findMany({
        orderBy: { id: 'desc' }
      });
      return NextResponse.json(allFocus);
    }

    // Find the LATEST mission that IS NOT hibernated as the "active" one
    const focus = await prisma.currentFocus.findFirst({
      where: {
        status: { not: 'Hibernated' }
      },
      orderBy: { id: 'desc' }
    });
    
    return NextResponse.json(focus);
  } catch (error) {
    console.error('FOCUS GET ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch focus' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, problem, description, blurb, status, projectId, milestone, finalDestination } = body;
    
    const parsedProjectId = (projectId && !isNaN(parseInt(projectId.toString()))) ? parseInt(projectId.toString()) : null;

    // If an ID is provided, it's a targeted update
    if (id) {
      const updated = await prisma.currentFocus.update({
        where: { id: parseInt(id.toString()) },
        data: {
          problem,
          description,
          blurb,
          status: status || 'Active',
          projectId: parsedProjectId,
          milestone,
          finalDestination
        }
      });
      return NextResponse.json(updated);
    }

    // Otherwise, find the LATEST active mission and update it
    const existing = await prisma.currentFocus.findFirst({
      where: {
        status: { not: 'Hibernated' }
      },
      orderBy: { id: 'desc' }
    });
    
    if (existing) {
      const updated = await prisma.currentFocus.update({
        where: { id: existing.id },
        data: {
          problem,
          description,
          blurb,
          status: status || 'Active',
          projectId: parsedProjectId,
          milestone,
          finalDestination
        }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.currentFocus.create({
        data: {
          problem,
          description,
          blurb,
          status: status || 'Active',
          projectId: parsedProjectId,
          milestone,
          finalDestination
        }
      });
      return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error('FOCUS POST ERROR:', error);
    // Provide a more descriptive error message if it's a unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Conflict: This project module is already assigned to another mission.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update focus' }, { status: 500 });
  }
}
