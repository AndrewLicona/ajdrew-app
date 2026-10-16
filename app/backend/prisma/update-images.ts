import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Actualizando imágenes de ítems calificables...');

  const sampleImages: Record<string, string> = {
    'Arquero': 'https://res.cloudinary.com/djujhuorh/image/upload/v1700000000/ajdrew/items/archer.png',
    'Mago': 'https://res.cloudinary.com/djujhuorh/image/upload/v1700000000/ajdrew/items/wizard.png',
    'Valquiria': 'https://res.cloudinary.com/djujhuorh/image/upload/v1700000000/ajdrew/items/valkyrie.png',
    'Mortero': 'https://res.cloudinary.com/djujhuorh/image/upload/v1700000000/ajdrew/items/mortar.png',
    'Globo': 'https://res.cloudinary.com/djujhuorh/image/upload/v1700000000/ajdrew/items/balloon.png',
  };

  // O podemos usar imágenes genéricas de alta calidad de prueba si las anteriores no existen
  const fallbackImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60';

  const items = await prisma.itemCalificable.findMany();
  for (const item of items) {
    const img = sampleImages[item.nombre] || fallbackImage;
    await prisma.itemCalificable.update({
      where: { id: item.id },
      data: { image: img },
    });
    console.log(`✅ Actualizado item: ${item.nombre} con imagen.`);
  }

  console.log('🎉 ¡Actualización de imágenes completada!');
}

main()
  .catch((e) => {
    console.error('❌ Error actualizando imágenes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
