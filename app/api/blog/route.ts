import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // SECURITY: Verify Admin Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const admin = await prisma.adminUser.findFirst();
    if (!token || token !== admin?.password) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, isHidden } = body;
    const post = await prisma.blogPost.create({
      data: { title, content, excerpt, isHidden: !!isHidden },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
