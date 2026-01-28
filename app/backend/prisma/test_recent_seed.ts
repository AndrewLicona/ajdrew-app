import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🆕 Añadiendo contenido RECIENTE para probar Lo Más Reciente...');

    const brawlStars = await prisma.juego.findUnique({ where: { slug: 'brawl-stars' } });
    const fc25 = await prisma.juego.findUnique({ where: { slug: 'fc-25' } });

    if (!brawlStars) {
        console.error('❌ No se encontró Brawl Stars. Ejecuta el seed base primero.');
        return;
    }

    // 1. Sorteos NUEVOS con fecha de hoy
    console.log('🎁 Añadiendo 3 sorteos NUEVOS (fechas de hoy)...');
    const sorteoTitles = [
        'Mega Sorteo de Año Nuevo - 2000 Gemas',
        'Sorteo Exclusivo Suscriptores - Brawl Pass',
        'Sorteo Relámpago - 500 Gemas GRATIS'
    ];

    for (let i = 0; i < sorteoTitles.length; i++) {
        await prisma.sorteo.create({
            data: {
                titulo: sorteoTitles[i],
                descripcion: 'Sorteo creado para probar la sección Lo Más Reciente en la homepage.',
                premio: i === 0 ? '2000 Gemas' : i === 1 ? 'Brawl Pass Completo' : '500 Gemas',
                fechaFin: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // 1, 2, 3 weeks
                estado: 'ACTIVO',
                juegoId: brawlStars.id,
                image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769377554/ajdrew/juegos/krzqfrdsgb1e3fnzmqw1.png',
                numGanadores: i === 0 ? 3 : i === 1 ? 1 : 10,
                createdAt: new Date() // Hoy!
            }
        });
    }

    // 2. Tutoriales NUEVOS
    console.log('📚 Añadiendo 2 tutoriales NUEVOS...');
    const catMecanicas = await prisma.categoria.findFirst({
        where: { nombre: 'Mecánicas Pro', juegoId: brawlStars.id }
    });

    if (catMecanicas) {
        const tutorialTitles = [
            'META de Enero 2026 - Los Mejores Brawlers',
            'Guía DEFINITIVA para Ganar Trofeos Rápido'
        ];

        for (let i = 0; i < tutorialTitles.length; i++) {
            await prisma.tutorial.create({
                data: {
                    titulo: tutorialTitles[i],
                    slug: `tutorial-nuevo-${Date.now()}-${i}`,
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    descripcion: 'Tutorial creado para probar Lo Más Reciente.',
                    dificultad: i === 0 ? 'MEDIO' : 'FACIL',
                    juegoId: brawlStars.id,
                    categoriaId: catMecanicas.id,
                    image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769377554/ajdrew/juegos/krzqfrdsgb1e3fnzmqw1.png',
                    createdAt: new Date() // Hoy!
                }
            });
        }
    }

    // 3. Si existe FC 25, agregar contenido también
    if (fc25) {
        console.log('⚽ Añadiendo contenido a FC 25...');
        await prisma.sorteo.create({
            data: {
                titulo: 'Sorteo FC Coins - 10,000 Monedas',
                descripcion: 'Gana FC Coins para tu equipo Ultimate Team.',
                premio: '10,000 FC Coins',
                fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                estado: 'ACTIVO',
                juegoId: fc25.id,
                numGanadores: 5,
                createdAt: new Date()
            }
        });
    }

    console.log('✅ Contenido reciente añadido correctamente.');
    console.log('🔄 Ahora recarga la homepage para ver Lo Más Reciente.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
