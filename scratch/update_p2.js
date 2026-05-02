const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.project.update({
    where: { id: 2 },
    data: { finalDestination: 'Global System Launch' }
  });
  console.log('✓ Updated Project #2');
}

main().finally(() => prisma.$disconnect());
