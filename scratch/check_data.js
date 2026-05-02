const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const focus = await prisma.currentFocus.findFirst({ include: { project: true } });
  const projects = await prisma.project.findMany();
  
  console.log('--- CURRENT FOCUS ---');
  console.log(JSON.stringify(focus, null, 2));
  
  console.log('\n--- PROJECTS ---');
  console.log(JSON.stringify(projects, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
