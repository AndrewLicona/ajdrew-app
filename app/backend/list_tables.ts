import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Listing Tables ---');
    try {
        const tables: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
        console.log('Tables found:', tables.map(t => t.table_name).join(', '));

        const juegosCount: any[] = await prisma.$queryRaw`SELECT count(*) FROM "Juego"`;
        console.log('Juegos count:', juegosCount);
    } catch (e) {
        console.error('Error listing tables or counting:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
