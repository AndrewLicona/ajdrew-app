import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const games = await prisma.juego.findMany({
        include: {
            categorias: {
                include: {
                    items: { take: 1 }
                }
            }
        }
    });

    console.log(`Juegos encontrados: ${games.length}`);
    games.forEach(g => {
        console.log(`Juego: ${g.nombre} (Slug: ${g.slug})`);
        g.categorias.forEach(c => {
            console.log(`  - Categoría: ${c.nombre} (Tipo: ${c.tipo}) - Items: ${c.items.length} (Total items count check later)`);
        });
    });

    const itemsCount = await prisma.itemCalificable.count();
    console.log(`Total items en DB: ${itemsCount}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
