import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando repoblación FINAL con imágenes INDIVIDUALES y CATEGORÍAS DE TUTORIALES...');

    // 1. Noticias (Feed)
    await prisma.publicacion.deleteMany({});
    const publicaciones = [
        {
            titulo: '¡Sorteos Mensuales Activos!',
            contenido: 'Participa ahora en los sorteos de FC 25 y Brawl Stars. ¡No te pierdas la oportunidad de ganar premios exclusivos!',
            tipo: 'NORMAL',
        },
        {
            titulo: 'Nuevos Brackets de Votación',
            contenido: 'Hemos abierto las votaciones para elegir a los mejores jugadores internacionales. ¡Tu voto decide!',
            tipo: 'NORMAL',
        }
    ];
    await prisma.publicacion.createMany({ data: publicaciones });
    console.log('✅ Publicaciones creadas.');

    // 2. Imágenes Proporcionadas por el Usuario (Items)
    const itemImages = [
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364997/ajdrew/items/vlzzqjyejeabdypylap1.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364992/ajdrew/items/sy7okf36kxmt1kmqpx01.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364999/ajdrew/items/qb9gghk5yvzucpjb2age.png'
    ];

    // 3. Juegos con las NUEVAS imágenes individuales proporcionadas
    const juegosData = [
        {
            nombre: 'FC 25',
            slug: 'fc-25',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332867/ajdrew/juegos/hixbyuhvrcxvlgxjax1y.png'
        },
        {
            nombre: 'Brawl Stars',
            slug: 'brawl-stars',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769377554/ajdrew/juegos/krzqfrdsgb1e3fnzmqw1.png'
        },
        {
            nombre: 'League of Legends',
            slug: 'league-of-legends',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332926/ajdrew/juegos/wyzxcfzsugei1c9bhrd5.jpg'
        },
        {
            nombre: 'Free Fire',
            slug: 'free-fire',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332867/ajdrew/juegos/hixbyuhvrcxvlgxjax1y.png'
        }
    ];

    for (const j of juegosData) {
        const juego = await prisma.juego.upsert({
            where: { slug: j.slug },
            update: { image: j.image },
            create: { ...j, descripcion: `Comunidad oficial de ${j.nombre}` },
        });
        console.log(`✅ Actualizado Juego: ${juego.nombre}`);

        // Categorías
        const categoriasBase = [
            { nombre: 'Mejores Cartas', tipo: 'CALIFICACION' },
            { nombre: 'Top Jugadores', tipo: 'CALIFICACION' },
            { nombre: 'Torneo Semanal', tipo: 'VOTACION' },
            { nombre: 'Mecánicas Pro', tipo: 'TUTORIAL' },
            { nombre: 'Estrategias Ganadoras', tipo: 'TUTORIAL' }
        ];

        const categoriasMap: Record<string, string> = {};

        for (const c of categoriasBase) {
            const categoria = await prisma.categoria.upsert({
                where: { id: (await prisma.categoria.findFirst({ where: { nombre: c.nombre, juegoId: juego.id } }))?.id || 'non-existent' },
                update: { tipo: c.tipo },
                create: { ...c, juegoId: juego.id }
            });
            categoriasMap[c.nombre] = categoria.id;

            // Items Calificables
            if (categoria.tipo === 'CALIFICACION') {
                const itemCount = await prisma.itemCalificable.count({ where: { categoriaId: categoria.id } });
                if (itemCount === 0) {
                    const items = Array.from({ length: 6 }).map((_, i) => ({
                        nombre: `${juego.nombre} - ${categoria.nombre} #${i + 1}`,
                        categoriaId: categoria.id,
                        image: itemImages[i % itemImages.length]
                    }));
                    await prisma.itemCalificable.createMany({ data: items });
                } else {
                    const items = await prisma.itemCalificable.findMany({ where: { categoriaId: categoria.id } });
                    for (let i = 0; i < items.length; i++) {
                        await prisma.itemCalificable.update({
                            where: { id: items[i].id },
                            data: { image: itemImages[i % itemImages.length] }
                        });
                    }
                }
            }

            // Brackets
            if (categoria.tipo === 'VOTACION') {
                const bracketSlug = `${juego.slug}-torneo-pro`;
                const bracket = await prisma.votacionBracket.upsert({
                    where: { slug: bracketSlug },
                    update: { estado: 'ACTIVA' },
                    create: {
                        tematica: `Torneo Pro de ${juego.nombre}`,
                        slug: bracketSlug,
                        juegoId: juego.id,
                        categoriaId: categoria.id,
                        estado: 'ACTIVA',
                        rondaActual: 1,
                        rondaDuracion: 24,
                        proximoCierreAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                    }
                });

                const matchCount = await prisma.bracketMatch.count({ where: { bracketId: bracket.id } });
                if (matchCount === 0) {
                    const tourneyItems = await Promise.all(
                        Array.from({ length: 8 }).map((_, i) =>
                            prisma.itemCalificable.create({
                                data: {
                                    nombre: `${juego.nombre} Pro ${i + 1}`,
                                    categoriaId: categoria.id,
                                    image: itemImages[i % itemImages.length]
                                }
                            })
                        )
                    );

                    const matches: any[] = [];
                    for (let i = 0; i < tourneyItems.length; i += 2) {
                        matches.push({
                            bracketId: bracket.id,
                            ronda: 1,
                            itemAId: tourneyItems[i].id,
                            itemBId: tourneyItems[i + 1].id
                        });
                    }
                    await prisma.bracketMatch.createMany({ data: matches });
                }
            }
        }

        // Tutoriales por Categoría
        const tutorialesData = [
            {
                titulo: `Guía de Mecánicas: ${juego.nombre}`,
                slug: `mecanicas-${juego.slug}`,
                categoriaNombre: 'Mecánicas Pro',
                descripcion: 'Domina los controles y movimientos básicos para ser el mejor.'
            },
            {
                titulo: `Estrategias Maestras: ${juego.nombre}`,
                slug: `estrategias-${juego.slug}`,
                categoriaNombre: 'Estrategias Ganadoras',
                descripcion: 'Aprende a rotar y ganar partidas con inteligencia.'
            }
        ];

        for (const t of tutorialesData) {
            await prisma.tutorial.upsert({
                where: { slug: t.slug },
                update: {
                    categoriaId: categoriasMap[t.categoriaNombre],
                    juegoId: juego.id,
                    image: j.image
                },
                create: {
                    titulo: t.titulo,
                    slug: t.slug,
                    descripcion: t.descripcion,
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    dificultad: 'MEDIO',
                    juegoId: juego.id,
                    categoriaId: categoriasMap[t.categoriaNombre],
                    image: j.image,
                    pasos: {
                        create: [
                            { titulo: 'Paso 1: Configuración', orden: 1, descripcion: 'Ajusta tu sensibilidad.' },
                            { titulo: 'Paso 2: Ejecución', orden: 2, descripcion: 'Practica en el campo de entrenamiento.' }
                        ]
                    }
                }
            });
        }

        // 4. Sorteos
        const existingSorteo = await prisma.sorteo.findFirst({ where: { juegoId: juego.id } });
        if (!existingSorteo) {
            await prisma.sorteo.create({
                data: {
                    titulo: `Sorteo Especial ${juego.nombre}`,
                    descripcion: `Gana packs exclusivos y gemas para ${juego.nombre}. ¡Participa gratis!`,
                    premio: `10,000 Monedas / Gemas de ${juego.nombre}`,
                    fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    estado: 'ACTIVO',
                    juegoId: juego.id,
                    image: j.image,
                    numGanadores: 3,
                    tareas: {
                        create: [
                            { tipo: 'FOLLOW', plataforma: 'X', descripcion: 'Sigue a AJDREW en X', obligatorio: true, url: 'https://x.com/ajdrew' }
                        ]
                    }
                }
            });
        } else {
            await prisma.sorteo.update({
                where: { id: existingSorteo.id },
                data: { image: j.image }
            });
        }
    }

    console.log('🚀 Repoblación FINAL con CATEGORÍAS DE TUTORIALES COMPLETADA.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
