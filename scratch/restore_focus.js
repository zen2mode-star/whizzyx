const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const problem = "Automated expense tracking is too slow.";
  const description = "I'm currently investigating why existing solutions take 30+ seconds to categorize simple transactions. Goal: sub-second latency.";
  const status = "Noticing & Researching";

  const existing = await prisma.currentFocus.findFirst();
  if (existing) {
    await prisma.currentFocus.update({
      where: { id: existing.id },
      data: { problem, description, status }
    });
  } else {
    await prisma.currentFocus.create({
      data: { problem, description, status }
    });
  }
  console.log('Focus data restored');
  process.exit(0);
}

seed();
