import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    const body = await request.json();
    const { title, content, excerpt } = body;
    
    const post = await prisma.blogPost.update({
      where: { id: blogId },
      data: { title, content, excerpt },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    await prisma.blogPost.delete({
      where: { id: blogId },
    });
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
