const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const settings = await prisma.siteSettings.findMany();
  console.log('--- SETTINGS ---');
  settings.forEach(s => {
    const displayValue = s.key.toLowerCase().includes('key') ? '********' : s.value;
    console.log(`${s.key}: ${displayValue}`);
  });
  console.log('----------------');
}

check().finally(() => prisma.$disconnect());
