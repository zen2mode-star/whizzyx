const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const focus = await prisma.currentFocus.findFirst();
  console.log(JSON.stringify(focus, null, 2));
}

main().finally(() => prisma.$disconnect());
