import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Active';
    
    if (status === 'all') {
      const allFocus = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" ORDER BY id DESC`);
      return NextResponse.json(allFocus);
    }

    // Fix: Look for the LATEST mission that IS NOT hibernated as the "active" one
    const focusList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE status != 'Hibernated' ORDER BY id DESC LIMIT 1`);
    const focus = Array.isArray(focusList) && focusList.length > 0 ? focusList[0] : null;
    return NextResponse.json(focus);
  } catch (error) {
    console.error('FOCUS GET ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch focus' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, problem, description, status, projectId, milestone, finalDestination } = body;
    
    const parsedProjectId = (projectId && !isNaN(parseInt(projectId.toString()))) ? parseInt(projectId.toString()) : null;

    // If an ID is provided, it's a targeted update
    if (id) {
      await prisma.$executeRawUnsafe(
        `UPDATE "CurrentFocus" SET problem = $1, description = $2, status = $3, "projectId" = $4, milestone = $5, "finalDestination" = $6 WHERE id = $7`,
        problem, description, status, parsedProjectId, milestone, finalDestination, id
      );
      const updatedList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE id = $1`, id);
      return NextResponse.json(Array.isArray(updatedList) ? updatedList[0] : null);
    }

    // Otherwise, find the LATEST active mission and update it
    const existingList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE status != 'Hibernated' ORDER BY id DESC LIMIT 1`);
    const existing = Array.isArray(existingList) && existingList.length > 0 ? existingList[0] : null;
    
    let focus;
    if (existing) {
      await prisma.$executeRawUnsafe(
        `UPDATE "CurrentFocus" SET problem = $1, description = $2, status = $3, "projectId" = $4, milestone = $5, "finalDestination" = $6 WHERE id = $7`,
        problem, description, status, parsedProjectId, milestone, finalDestination, existing.id
      );
      const updatedList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE id = $1`, existing.id);
      focus = Array.isArray(updatedList) ? updatedList[0] : null;
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "CurrentFocus" (problem, description, status, "projectId", milestone, "finalDestination") VALUES ($1, $2, $3, $4, $5, $6)`,
        problem, description, status || 'Active', parsedProjectId, milestone, finalDestination
      );
      const updatedList = await prisma.$queryRawUnsafe(`SELECT * FROM "CurrentFocus" WHERE status != 'Hibernated' ORDER BY id DESC LIMIT 1`);
      focus = Array.isArray(updatedList) ? updatedList[0] : null;
    }
    
    return NextResponse.json(focus);
  } catch (error) {
    console.error('FOCUS POST ERROR:', error);
    return NextResponse.json({ error: 'Failed to update focus' }, { status: 500 });
  }
}
