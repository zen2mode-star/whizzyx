const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const focus = await prisma.currentFocus.findFirst();
  console.log('Current Focus:', JSON.stringify(focus, null, 2));
  process.exit(0);
}

check();
