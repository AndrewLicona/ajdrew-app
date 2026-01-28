import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando EXPANSIÓN MASIVA con 6 juegos y contenido completo...');

    // 1. Noticias (Feed)
    await prisma.publicacion.deleteMany({});
    const publicaciones = [
        {
            titulo: '¡Sorteos Mensuales Activos!',
            contenido: 'Participa ahora en los sorteos de FC 25, Brawl Stars y Genshin Impact. ¡No te pierdas la oportunidad de ganar premios exclusivos!',
            tipo: 'NORMAL',
        },
        {
            titulo: 'Nuevos Brackets de Votación',
            contenido: 'Hemos abierto las votaciones para elegir a los mejores jugadores internacionales de Clash Royale y Free Fire. ¡Tu voto decide!',
            tipo: 'NORMAL',
        },
        {
            titulo: 'Guías Pro Actualizadas',
            contenido: 'Nuevos tutoriales de mecánicas avanzadas para Valorant y League of Legends ya disponibles.',
            tipo: 'NORMAL',
        }
    ];
    await prisma.publicacion.createMany({ data: publicaciones });

    // 2. Assets Premium (Proporcionados por el Usuario)
    const itemImages = [
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364997/ajdrew/items/vlzzqjyejeabdypylap1.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364992/ajdrew/items/sy7okf36kxmt1kmqpx01.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364999/ajdrew/items/qb9gghk5yvzucpjb2age.png'
    ];

    // 3. Catálogo de Juegos (6 Juegos)
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
            nombre: 'Clash Royale',
            slug: 'clash-royale',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332881/ajdrew/juegos/sy7okf36kxmt1kmqpx01.png'
        },
        {
            nombre: 'Free Fire',
            slug: 'free-fire',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332898/ajdrew/juegos/qb9gghk5yvzucpjb2age.png'
        },
        {
            nombre: 'Genshin Impact',
            slug: 'genshin-impact',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332866/ajdrew/juegos/vlzzqjyejeabdypylap1.jpg'
        }
    ];

    for (const j of juegosData) {
        const juego = await prisma.juego.upsert({
            where: { slug: j.slug },
            update: { image: j.image },
            create: { ...j, descripcion: `Comunidad oficial de ${j.nombre}` },
        });
        console.log(`✅ Procesando: ${juego.nombre}`);

        // Categorías por Juego
        const categoriasBase = [
            { nombre: 'Mejores Cartas/Skins', tipo: 'CALIFICACION' },
            { nombre: 'Top Personajes', tipo: 'CALIFICACION' },
            { nombre: 'Torneo de Maestros', tipo: 'VOTACION' },
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

            // Ítems para Calificación
            if (categoria.tipo === 'CALIFICACION') {
                const itemCount = await prisma.itemCalificable.count({ where: { categoriaId: categoria.id } });
                if (itemCount === 0) {
                    const items = Array.from({ length: 6 }).map((_, i) => ({
                        nombre: `${juego.nombre} - ${categoria.nombre} #${i + 1}`,
                        categoriaId: categoria.id,
                        image: itemImages[i % itemImages.length]
                    }));
                    await prisma.itemCalificable.createMany({ data: items });
                }
            }

            // Torneos (Votaciones)
            if (categoria.tipo === 'VOTACION') {
                const bracketSlug = `${juego.slug}-torneo-pro`;
                const bracket = await prisma.votacionBracket.upsert({
                    where: { slug: bracketSlug },
                    update: { estado: 'ACTIVA' },
                    create: {
                        tematica: `Torneo de Maestros: ${juego.nombre}`,
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
                                    nombre: `${juego.nombre} Challenger ${i + 1}`,
                                    categoriaId: categoria.id,
                                    image: itemImages[i % itemImages.length]
                                }
                            })
                        )
                    );

                    const matches = [];
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

        // Tutoriales Reales
        const tutorialesData = [
            {
                titulo: `Dominando el Meta: ${juego.nombre}`,
                slug: `guia-meta-${juego.slug}`,
                categoriaNombre: 'Estrategias Ganadoras',
                descripcion: `Aprende las mejores estrategias para subir de rango en ${juego.nombre}.`
            },
            {
                titulo: `Trucos y Consejos ${juego.nombre}`,
                slug: `tips-${juego.slug}`,
                categoriaNombre: 'Mecánicas Pro',
                descripcion: `Detalles técnicos que te harán destacar en ${juego.nombre}.`
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
                            { titulo: 'Preparación', orden: 1, descripcion: 'Revisa tu equipamiento y settings.' },
                            { titulo: 'Ejecución', orden: 2, descripcion: 'Aplica el movimiento clave en partida.' }
                        ]
                    }
                }
            });
        }

        // Sorteos Activos
        await prisma.sorteo.upsert({
            where: { id: (await prisma.sorteo.findFirst({ where: { juegoId: juego.id, titulo: { contains: juego.nombre } } }))?.id || 'non-existent' },
            update: { estado: 'ACTIVO', image: j.image },
            create: {
                titulo: `Sorteo Premium: ${juego.nombre}`,
                descripcion: `Participa por el gran premio de ${juego.nombre}. ¡Cierre en 7 días!`,
                premio: `Pack Especial / Monedas Pro de ${juego.nombre}`,
                fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                estado: 'ACTIVO',
                juegoId: juego.id,
                image: j.image,
                numGanadores: 5,
                tareas: {
                    create: [
                        { tipo: 'FOLLOW', plataforma: 'SOCIAL', descripcion: 'Sigue a la comunidad AJDREW', obligatorio: true, url: 'https://ajdrew.com' }
                    ]
                }
            }
        });
    }

    console.log('✅ EXPANSIÓN MASIVA COMPLETADA. 6 Juegos listos.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
