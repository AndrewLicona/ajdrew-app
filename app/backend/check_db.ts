import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Record Counts ---');
    try {
        const juegos = await prisma.juego.count();
        const categorias = await prisma.categoria.count();
        const tutoriales = await prisma.tutorial.count();
        const items = await prisma.item.count();
        const publicaciones = await prisma.publicacion.count();
        const votaciones = await prisma.votacionBracket.count();

        console.log(`Juegos: ${juegos}`);
        console.log(`Categorias: ${categorias}`);
        console.log(`Tutoriales: ${tutoriales}`);
        console.log(`Items: ${items}`);
        console.log(`Publicaciones: ${publicaciones}`);
        console.log(`Votaciones: ${votaciones}`);
    } catch (e) {
        console.error('Error checking counts:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
