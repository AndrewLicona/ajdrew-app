import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding version column to ItemCalificable...');
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "ItemCalificable" ADD COLUMN IF NOT EXISTS "version" TEXT;`);
    console.log('✅ version column added');
  } catch (e: any) {
    console.log('version:', e.message);
  }

  console.log('Adding grl column to ItemCalificable...');
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "ItemCalificable" ADD COLUMN IF NOT EXISTS "grl" INTEGER;`);
    console.log('✅ grl column added');
  } catch (e: any) {
    console.log('grl:', e.message);
  }

  console.log('Creating unique index...');
  
  try {
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ItemCalificable_nombre_version_juegoId_key" ON "ItemCalificable"("nombre", "version", "juegoId");`);
    console.log('✅ Unique index created');
  } catch (e: any) {
    console.log('index:', e.message);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());