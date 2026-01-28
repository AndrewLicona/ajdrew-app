import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando expansión masiva de datos (LOCAL)...');

    // Juegos existentes
    const brawlStars = await prisma.juego.findUnique({ where: { slug: 'brawl-stars' } });
    const fc25 = await prisma.juego.findUnique({ where: { slug: 'fc-25' } });
    const freeFire = await prisma.juego.findUnique({ where: { slug: 'free-fire' } });

    if (!brawlStars) {
        console.error('❌ No se encontró Brawl Stars. Ejecuta el seed base primero.');
        return;
    }

    // 1. MÁS SORTEOS PARA BRAWL STARS (El juego estrella)
    console.log('🎁 Añadiendo sorteos masivos a Brawl Stars...');
    for (let i = 1; i <= 10; i++) {
        await prisma.sorteo.create({
            data: {
                titulo: `Sorteo de Gemas Mega #${i} - Brawl Stars`,
                descripcion: `Participa en este gran sorteo de gemas para mejorar tus brawlers.`,
                premio: `${200 * i} Gemas Gratis`,
                fechaFin: new Date(Date.now() + (i * 2) * 24 * 60 * 60 * 1000),
                estado: i % 3 === 0 ? 'CERRADO' : 'ACTIVO',
                juegoId: brawlStars.id,
                image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769377554/ajdrew/juegos/krzqfrdsgb1e3fnzmqw1.png',
                numGanadores: i % 2 === 0 ? 1 : 5
            }
        });
    }

    // 2. MÁS TUTORIALES PARA BRAWL STARS
    console.log('📚 Añadiendo tutoriales masivos a Brawl Stars...');
    const catMecanicas = await prisma.categoria.findFirst({ where: { nombre: 'Mecánicas Pro', juegoId: brawlStars.id } });
    if (catMecanicas) {
        for (let i = 1; i <= 8; i++) {
            await prisma.tutorial.create({
                data: {
                    titulo: `Dominando a Brawler #${i}: Guía Avanzada`,
                    slug: `guia-brawler-avanzada-${i}-${Date.now()}`,
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    descripcion: 'Una guía detallada sobre cómo jugar de manera competitiva.',
                    dificultad: i % 3 === 0 ? 'DIFICIL' : 'MEDIO',
                    juegoId: brawlStars.id,
                    categoriaId: catMecanicas.id,
                    image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769377554/ajdrew/juegos/krzqfrdsgb1e3fnzmqw1.png'
                }
            });
        }
    }

    // 3. MÁS VOTACIONES Y CATEGORÍAS PARA BRAWL STARS
    console.log('🗳️ Añadiendo categorías y votaciones masivas a Brawl Stars...');
    const extraCats = [
        { nombre: 'Mejores Skins', tipo: 'VOTACION' },
        { nombre: 'Mapas Favoritos', tipo: 'VOTACION' },
        { nombre: 'Mejor Modo de Juego', tipo: 'VOTACION' },
        { nombre: 'Brawlers Legendarios', tipo: 'CALIFICACION' },
        { nombre: 'Gadgets OP', tipo: 'CALIFICACION' }
    ];

    const itemImages = [
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364997/ajdrew/items/vlzzqjyejeabdypylap1.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364992/ajdrew/items/sy7okf36kxmt1kmqpx01.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364999/ajdrew/items/qb9gghk5yvzucpjb2age.png'
    ];

    for (const catData of extraCats) {
        const categoria = await prisma.categoria.create({
            data: {
                nombre: catData.nombre,
                tipo: catData.tipo,
                juegoId: brawlStars.id,
                activa: true
            }
        });

        if (catData.tipo === 'VOTACION') {
            // Crear 3 torneos por categoría para testear mobile
            for (let t = 1; t <= 3; t++) {
                const bracket = await prisma.votacionBracket.create({
                    data: {
                        tematica: `${catData.nombre} - Temporada ${t}`,
                        slug: `torneo-${catData.nombre.toLowerCase().replace(/ /g, '-')}-t${t}-${Date.now()}`,
                        juegoId: brawlStars.id,
                        categoriaId: categoria.id,
                        estado: t === 1 ? 'ACTIVA' : 'BORRADOR',
                        rondaActual: 1,
                        rondaDuracion: 24,
                        proximoCierreAt: t === 1 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
                    }
                });

                // Añadir items y matches
                const items = await Promise.all(
                    Array.from({ length: 4 }).map((_, i) =>
                        prisma.itemCalificable.create({
                            data: {
                                nombre: `${catData.nombre} S${t} - Opción #${i + 1}`,
                                categoriaId: categoria.id,
                                image: itemImages[i % itemImages.length]
                            }
                        })
                    )
                );

                await prisma.bracketMatch.createMany({
                    data: [
                        { bracketId: bracket.id, ronda: 1, itemAId: items[0].id, itemBId: items[1].id },
                        { bracketId: bracket.id, ronda: 1, itemAId: items[2].id, itemBId: items[3].id }
                    ]
                });
            }
        } else {
            // Solo items calificables
            await prisma.itemCalificable.createMany({
                data: Array.from({ length: 4 }).map((_, i) => ({
                    nombre: `${catData.nombre} - Propuesta #${i + 1}`,
                    categoriaId: categoria.id,
                    image: itemImages[i % itemImages.length]
                }))
            });
        }
    }

    console.log('✅ Expansión de datos completada satisfactoriamente.');
    console.log('⭐ Brawl Stars es ahora el juego con más contenido.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
