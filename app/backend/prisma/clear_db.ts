import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚮 Iniciando LIMPIEZA TOTAL de la base de datos...');

    try {
        // Orden inverso de dependencias para evitar errores de FK
        console.log('- Borrando ganadores de sorteos...');
        await (prisma as any).sorteoWinner.deleteMany();

        console.log('- Borrando participaciones de sorteos...');
        await (prisma as any).sorteoParticipante.deleteMany();

        console.log('- Borrando tareas de sorteos...');
        await (prisma as any).sorteoTask.deleteMany();

        console.log('- Borrando sorteos...');
        await (prisma as any).sorteo.deleteMany();

        console.log('- Borrando votos de brackets...');
        await (prisma as any).bracketVote.deleteMany();

        console.log('- Borrando matches de brackets...');
        await (prisma as any).bracketMatch.deleteMany();

        console.log('- Borrando brackets...');
        await (prisma as any).votacionBracket.deleteMany();

        console.log('- Borrando calificaciones...');
        await prisma.calificacion.deleteMany();

        console.log('- Borrando items calificables...');
        await prisma.itemCalificable.deleteMany();

        console.log('- Borrando pasos de tutoriales...');
        await prisma.tutorialStep.deleteMany();

        console.log('- Borrando tutoriales...');
        await prisma.tutorial.deleteMany();

        console.log('- Borrando categorías...');
        await prisma.categoria.deleteMany();

        console.log('- Borrando juegos...');
        await prisma.juego.deleteMany();

        console.log('✅ Base de datos COMPLETAMENTE VACÍA.');
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
