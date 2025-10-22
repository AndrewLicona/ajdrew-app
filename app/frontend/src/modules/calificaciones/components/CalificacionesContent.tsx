import React from 'react';
import ItemCalificableList from '@/modules/calificaciones/components/ItemCalificableList';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';
import { fetchCategories, fetchItemsForCategory } from '@/modules/calificaciones/services/calificacionesService';
import type { Categoria, ItemCalificable } from '@/modules/calificaciones/types';
import { StructuredData } from './StructuredData';

// Extiende Categoria para incluir los items
type CategoryWithItems = Categoria & { items: ItemCalificable[] };

export default async function CalificacionesContent() {
  const categories = await fetchCategories();

  // Obtiene todos los items para todas las categorías y filtra las que no tienen items
  const categoriesWithItems: CategoryWithItems[] = (await Promise.all(categories.map(async (category) => {
    const items = await fetchItemsForCategory(category.id);
    return items.length > 0 ? { ...category, items } : null;
  }))).filter((c): c is CategoryWithItems => c !== null);

  // Genera los datos estructurados para todos los items de todas las categorías
  const allItems = categoriesWithItems.flatMap(c => c.items);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.nombre,
        "image": item.image,
        "aggregateRating": item.averageRating ? {
          "@type": "AggregateRating",
          "ratingValue": item.averageRating.toFixed(1),
          "ratingCount": item.ratingCount,
          "bestRating": "5",
          "worstRating": "1"
        } : undefined
      }
    }))
  };

  return (
    <>
      <StructuredData data={structuredData} />
      {categoriesWithItems.length === 0 ? (
        <p className="text-center">No hay categorías con ítems para mostrar.</p>
      ) : (
        <div className="w-full max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-10">
          <div className="flex-1 ">
            {categoriesWithItems.map((category) => (
              <div key={category.id} className="mb-8 p-4 border rounded-lg shadow-md bg-[var(--color-card)] border-[var(--color-primary)]/30">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="order-2 md:order-1 flex-1">
                    <h2 className="text-2xl font-semibold mb-3 text-[var(--color-text)]">{category.nombre}</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">Tipo: {category.tipo} | Activa: {category.activa ? 'Sí' : 'No'}</p>
                    <ItemCalificableList categoryId={category.id} initialItems={category.items} />
                  </div>
                  
                  <div className="order-1 md:order-2 w-full md:w-60 flex-shrink-0">
                    <div className="bg-[var(--color-card)]/90 backdrop-blur-sm p-4 rounded-lg border border-[var(--color-primary)]/30 shadow-lg">
                      <h3 className="text-lg font-semibold mb-3 text-[var(--color-text)]">Ranking {category.nombre}</h3>
                      <RankingDisplay 
                        categoryId={category.id}
                        categoryName={category.nombre}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-80 xl:w-90 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              <div className="bg-[var(--color-card)]/90 backdrop-blur-sm p-4 rounded-lg border border-[var(--color-primary)]/30 shadow-lg">
                <RankingDisplay 
                  categoryName="General"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
