import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando REPOBLACIÓN con imágenes EXACTAS de Cloudinary...');

    // 1. Assets Premium para Items (Los 5 proporcionados)
    const itemImages = [
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364999/ajdrew/items/qb9gghk5yvzucpjb2age.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769489089/ajdrew/items/xgvwe8kjo4fn1ceto9rz.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364998/ajdrew/items/vv4nijsdwqwzognypkm3.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364994/ajdrew/items/eyylfgsq3txuchoqwtn8.png',
        'https://res.cloudinary.com/djujhuorh/image/upload/v1769364992/ajdrew/items/sy7okf36kxmt1kmqpx01.png'
    ];

    // 2. Catálogo de Juegos con sus imágenes específicas
    const juegosData = [
        {
            nombre: 'FC 25',
            slug: 'fc-25',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769332867/ajdrew/juegos/hixbyuhvrcxvlgxjax1y.png'
        },
        {
            nombre: 'Brawl Stars',
            slug: 'brawl-stars',
            image: 'https://res.cloudinary.com/djujhuorh/image/upload/v1769489008/ajdrew/juegos/byafybt7gdsufo2tavhk.png'
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
        console.log(`✅ Juego ${juego.nombre} actualizado.`);

        // Categorías de Tutoriales Reales
        const categoriasBase = [
            { nombre: 'Mecánicas Pro', tipo: 'TUTORIAL' },
            { nombre: 'Estrategias Ganadoras', tipo: 'TUTORIAL' },
            { nombre: 'Mejores Items', tipo: 'CALIFICACION' },
            { nombre: 'Torneo Semanal', tipo: 'VOTACION' }
        ];

        const categoriasMap: Record<string, string> = {};

        for (const c of categoriasBase) {
            const categoria = await prisma.categoria.upsert({
                where: { id: (await prisma.categoria.findFirst({ where: { nombre: c.nombre, juegoId: juego.id } }))?.id || 'non-existent' },
                update: { tipo: c.tipo },
                create: { ...c, juegoId: juego.id }
            });
            categoriasMap[c.nombre] = categoria.id;

            // Ítems Premium si es Clasificación
            if (categoria.tipo === 'CALIFICACION') {
                const items = await prisma.itemCalificable.findMany({ where: { categoriaId: categoria.id } });
                if (items.length === 0) {
                    await prisma.itemCalificable.createMany({
                        data: Array.from({ length: 6 }).map((_, i) => ({
                            nombre: `${juego.nombre} Elite #${i + 1}`,
                            categoriaId: categoria.id,
                            image: itemImages[i % itemImages.length]
                        }))
                    });
                } else {
                    for (let i = 0; i < items.length; i++) {
                        await prisma.itemCalificable.update({
                            where: { id: items[i].id },
                            data: { image: itemImages[i % itemImages.length] }
                        });
                    }
                }
            }
        }

        // Actualizar tutoriales con la imagen del juego
        await prisma.tutorial.updateMany({
            where: { juegoId: juego.id },
            data: { image: j.image }
        });

        // Actualizar sorteos con la imagen del juego
        await prisma.sorteo.updateMany({
            where: { juegoId: juego.id },
            data: { image: j.image }
        });
    }

    console.log('🚀 Base de datos sincronizada con las imágenes premium finales.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
