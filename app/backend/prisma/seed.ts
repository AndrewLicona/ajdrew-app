import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear usuario admin
  const adminEmail = 'admin@ajdrew.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.usuario.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        nombre: 'Admin AJDREW',
        rol: 'ADMIN',
      },
    });
    console.log('✅ Admin creado:', adminEmail);
  } else {
    console.log('ℹ️ Admin ya existe:', adminEmail);
  }

  // 2. Crear usuario editor
  const editorEmail = 'editor@ajdrew.com';
  const editorPassword = 'editor123';

  const existingEditor = await prisma.usuario.findUnique({
    where: { email: editorEmail },
  });

  if (!existingEditor) {
    const hashedPassword = await bcrypt.hash(editorPassword, 10);
    await prisma.usuario.create({
      data: {
        email: editorEmail,
        password: hashedPassword,
        nombre: 'Editor AJDREW',
        rol: 'EDITOR',
      },
    });
    console.log('✅ Editor creado:', editorEmail);
  } else {
    console.log('ℹ️ Editor ya existe:', editorEmail);
  }

  // 3. Crear juegos de ejemplo
  const juegos = [
    {
      nombre: 'Clash Royale',
      slug: 'clash-royale',
      descripcion: 'Juego de cartas en tiempo real',
      activo: true,
    },
    {
      nombre: 'Brawl Stars',
      slug: 'brawl-stars',
      descripcion: 'Battle Royale multijugador',
      activo: true,
    },
    {
      nombre: 'Clash of Clans',
      slug: 'clash-of-clans',
      descripcion: 'Estrategia en tiempo real',
      activo: true,
    },
  ];

  for (const juego of juegos) {
    const existing = await prisma.juego.findUnique({ where: { slug: juego.slug } });
    if (!existing) {
      await prisma.juego.create({ data: juego });
      console.log(`✅ Juego creado: ${juego.nombre}`);
    } else {
      console.log(`ℹ️ Juego ya existe: ${juego.nombre}`);
    }
  }

  // 4. Crear categorías de ejemplo
  const categoriasData = [
    { nombre: 'Mejores Cartas', tipo: 'CALIFICACIONES' },
    { nombre: 'Mejores Personajes', tipo: 'CALIFICACIONES' },
    { nombre: 'Mejores Mazos', tipo: 'CALIFICACIONES' },
    { nombre: 'Eventos Especiales', tipo: 'BRACKETS' },
    { nombre: 'Torneos Mensuales', tipo: 'BRACKETS' },
  ];

  const createdCategorias = [];
  for (const cat of categoriasData) {
    const existing = await prisma.categoria.findFirst({ where: { nombre: cat.nombre } });
    if (!existing) {
      const created = await prisma.categoria.create({ data: cat });
      createdCategorias.push(created);
      console.log(`✅ Categoría creada: ${cat.nombre}`);
    } else {
      createdCategorias.push(existing);
      console.log(`ℹ️ Categoría ya existe: ${cat.nombre}`);
    }
  }

  // 5. Crear items calificables
  const itemsData = [
    { nombre: 'Arquero', version: 'Evolución', grl: 100, juegoId: (await prisma.juego.findUnique({ where: { slug: 'clash-royale' } }))?.id },
    { nombre: 'Mago', version: 'Evolución', grl: 100, juegoId: (await prisma.juego.findUnique({ where: { slug: 'clash-royale' } }))?.id },
    { nombre: 'Valquiria', version: 'Evolución', grl: 100, juegoId: (await prisma.juego.findUnique({ where: { slug: 'clash-royale' } }))?.id },
    { nombre: 'Mortero', version: 'Evolución', grl: 100, juegoId: (await prisma.juego.findUnique({ where: { slug: 'clash-royale' } }))?.id },
    { nombre: 'Globo', version: 'Evolución', grl: 100, juegoId: (await prisma.juego.findUnique({ where: { slug: 'clash-royale' } }))?.id },
  ];

  for (const item of itemsData) {
    if (!item.juegoId) continue;
    const existing = await prisma.itemCalificable.findFirst({ where: { nombre: item.nombre, version: item.version, juegoId: item.juegoId } });
    if (!existing) {
      await prisma.itemCalificable.create({ data: item });
      console.log(`✅ Item creado: ${item.nombre}`);
    } else {
      console.log(`ℹ️ Item ya existe: ${item.nombre}`);
    }
  }

  // 6. Crear tabla de calificación
  const juegoCR = await prisma.juego.findUnique({ where: { slug: 'clash-royale' } });
  const catCartas = await prisma.categoria.findFirst({ where: { nombre: 'Mejores Cartas' } });

  if (juegoCR && catCartas) {
    const existingTabla = await prisma.tablaCalificacion.findUnique({ where: { slug: 'mejores-cartas-clash-royale' } });
    if (!existingTabla) {
      const tabla = await prisma.tablaCalificacion.create({
        data: {
          nombre: 'Mejores Cartas Clash Royale',
          slug: 'mejores-cartas-clash-royale',
          descripcion: 'Ranking de las mejores cartas de Clash Royale',
          estado: 'ACTIVO',
          juegoId: juegoCR.id,
          categoriaId: catCartas.id,
        },
      });
      console.log('✅ Tabla de calificación creada');

      // Asociar items a la tabla
      const items = await prisma.itemCalificable.findMany({ where: { juegoId: juegoCR.id }, take: 5 });
      for (const item of items) {
        await prisma.tablaItem.create({
          data: { tablaId: tabla.id, itemId: item.id },
        }).catch(() => {});
      }
    }
  }

  // 7. Crear bracket de ejemplo
  if (juegoCR && catCartas) {
    const existingBracket = await prisma.votacionBracket.findFirst({ where: { slug: 'mejor-carta-clash-royale' } });
    if (!existingBracket) {
      const items = await prisma.itemCalificable.findMany({ where: { juegoId: juegoCR.id }, take: 8 });
      if (items.length >= 2) {
        const bracket = await prisma.votacionBracket.create({
          data: {
            tematica: 'Mejor Carta de Clash Royale',
            slug: 'mejor-carta-clash-royale',
            estado: 'ACTIVA',
            rondaActual: 1,
            juegoId: juegoCR.id,
            categoriaId: catCartas.id,
            rondaDuracion: 24,
            matches: {
              create: items.slice(0, 8).reduce((acc, item, i) => {
                if (i % 2 === 0 && items[i + 1]) {
                  acc.push({
                    ronda: 1,
                    itemAId: item.id,
                    itemBId: items[i + 1].id,
                  });
                }
                return acc;
              }, [] as any[]),
            },
          },
        });
        console.log('✅ Bracket creado:', bracket.tematica);
      }
    }
  }

  // 8. Crear sorteo de ejemplo
  if (juegoCR) {
    const existingSorteo = await prisma.sorteo.findFirst({ where: { titulo: 'Sorteo de Bienvenida' } });
    if (!existingSorteo) {
      await prisma.sorteo.create({
        data: {
          titulo: 'Sorteo de Bienvenida',
          descripcion: 'Participa y gana premios exclusivos',
          premio: 'Skin Legendaria + 5000 Gemas',
          fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          estado: 'ACTIVO',
          juegoId: juegoCR.id,
          numGanadores: 3,
          tareas: {
            create: [
              { tipo: 'SEGUIR', plataforma: 'TWITTER', obligatorio: true, url: 'https://twitter.com/ajdrew', descripcion: 'Síguenos en Twitter' },
              { tipo: 'SUSCRIBIR', plataforma: 'YOUTUBE', obligatorio: true, url: 'https://youtube.com/@ajdrew', descripcion: 'Suscríbete al canal' },
              { tipo: 'COMPARTIR', plataforma: 'FACEBOOK', obligatorio: false, descripcion: 'Comparte el sorteo' },
            ],
          },
        },
      });
      console.log('✅ Sorteo creado');
    }
  }

  // 9. Crear tutorial de ejemplo
  if (juegoCR) {
    const existingTutorial = await prisma.tutorial.findFirst({ where: { slug: 'mejor-deck-clash-royale' } });
    if (!existingTutorial) {
      await prisma.tutorial.create({
        data: {
          titulo: 'Mejor Deck para Subir Trofeos',
          slug: 'mejor-deck-clash-royale',
          videoUrl: 'https://youtube.com/watch?v=ejemplo',
          descripcion: 'Aprende el mejor deck meta actual',
          dificultad: 'MEDIO',
          destacado: true,
          activo: true,
          juegoId: juegoCR.id,
          categoriaId: catCartas?.id,
        },
      });
      console.log('✅ Tutorial creado');
    }
  }

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });