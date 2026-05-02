const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- UPDATING OLD DATA ---');

  // 1. Update Current Focus
  await prisma.currentFocus.updateMany({
    data: {
      finalDestination: "Automated Governance & Efficiency"
    }
  });
  console.log('✓ Updated Current Focus');

  // 2. Update Projects
  const projectUpdates = [
    { id: 1, goal: "Global System Launch" },
    { id: 3, goal: "Government Transit Integration" },
    { id: 4, goal: "Mass Production & Security Standard" }
  ];

  for (const p of projectUpdates) {
    try {
      await prisma.project.update({
        where: { id: p.id },
        data: { finalDestination: p.goal }
      });
      console.log(`✓ Updated Project #${p.id}: ${p.goal}`);
    } catch (e) {
      console.log(`! Could not update Project #${p.id} (might not exist)`);
    }
  }

  console.log('\n--- DATA UPDATE COMPLETE ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
