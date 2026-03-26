const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const bracket = await prisma.votacionBracket.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  console.log(JSON.stringify(bracket, null, 2));
}
main().finally(() => prisma.$disconnect());
