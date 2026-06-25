import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple in-memory rate limiter to slow down brute-force attacks
const ipAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    // Basic IP tracking for rate limiting (fallback to generic if IP not found)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    const now = Date.now();
    const attempts = ipAttempts.get(ip);
    
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      if (now - attempts.lastAttempt < LOCKOUT_MS) {
        return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
      } else {
        // Reset after lockout
        ipAttempts.delete(ip);
      }
    }

    const { username, password } = await request.json();
    
    // Auto-seed admin user if none exists
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0) {
      await prisma.adminUser.create({
        data: { username: 'mj@admin', password: '12345678' }
      });
    }

    // Deliberate 1-second delay to slow down brute-force scripts
    await new Promise(resolve => setTimeout(resolve, 1000));

    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin || admin.password !== password) {
      // Record failed attempt
      ipAttempts.set(ip, { 
        count: (attempts?.count || 0) + 1, 
        lastAttempt: now 
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success, clear attempts
    ipAttempts.delete(ip);
    return NextResponse.json({ success: true, username: admin.username, token: admin.password });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
