const API_BASE_URL = 'http://localhost:3000/api';
const IMAGE_URL = 'https://res.cloudinary.com/djujhuorh/image/upload/v1757541410/ajdrew/items-calificables/1757541409851-Papin_fc25_download.png';

const categoriesToCreate = [
  { nombre: 'Mejores Cartas', tipo: 'Calificaciones' },
  { nombre: 'Mejores Juegos', tipo: 'Calificaciones' },
  { nombre: 'Mejores Eventos', tipo: 'Calificaciones' },
];

async function createCategory(category) {
  console.log(`Creando categoría: ${category.nombre}...`);
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error al crear categoría ${category.nombre}: ${error.message}`);
  }
  const newCategory = await response.json();
  console.log(`Categoría "${newCategory.nombre}" creada con ID: ${newCategory.id}`);
  return newCategory;
}

async function createItem(item) {
  console.log(`Creando ítem: ${item.nombre} para categoría ${item.categoriaId}...`);
  const response = await fetch(`${API_BASE_URL}/items-calificables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error al crear ítem ${item.nombre}: ${error.message}`);
  }
  const newItem = await response.json();
  console.log(`Ítem "${newItem.nombre}" creado con ID: ${newItem.id}`);
  return newItem;
}

async function seedData() {
  console.log('Iniciando la creación de datos de prueba...');
  try {
    for (const catData of categoriesToCreate) {
      const category = await createCategory(catData);
      for (let i = 1; i <= 5; i++) {
        await createItem({
          nombre: `${category.nombre}  ${i}`,
          categoriaId: category.id,
          image: IMAGE_URL,
        });
      }
    }
    console.log('¡Datos de prueba creados exitosamente!');
  } catch (error) {
    console.error('Ocurrió un error al crear los datos:', error);
  }
}

seedData();
