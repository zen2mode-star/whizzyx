const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.project.create({
    data: {
      title: 'Project Alpha: Inefficiency Tracker',
      description: 'An AI-powered tool that tracks daily workflows to identify and solve hidden bottlenecks.',
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      links: 'https://github.com/WhizzyX',
    }
  });
  console.log('Seed data inserted');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
