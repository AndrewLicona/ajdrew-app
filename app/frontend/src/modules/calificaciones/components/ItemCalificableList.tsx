// itemCalificableList.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ItemCalificable } from '../types';
import { submitRating, getOrCreateDeviceId, fetchItemsForCategory } from '../services/calificacionesService';
import CalificarCardTemplate from './templates/CalificarCardTemplate';
import './templates/CalificarCardTemplate.css';
import { Alert } from '@/shared/components/Alert';

interface ItemCalificableListProps {
  categoryId: string;
  initialItems: ItemCalificable[];

}

export default function ItemCalificableList({ categoryId, initialItems }: ItemCalificableListProps) {
  const [items, setItems] = useState<ItemCalificable[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRatings = useCallback(async () => {
    try {
      const deviceId = getOrCreateDeviceId();
      const fetchedItems = await fetchItemsForCategory(categoryId, deviceId);
      setItems(fetchedItems);
      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar las calificaciones';
      setError(`Error al cargar calificaciones: ${errorMessage}`);
    }
  }, [categoryId]);

  useEffect(() => {

    fetchUserRatings();
  }, [fetchUserRatings]);



  const handleRatingChange = async (itemId: string, rating: number) => {
    try {
      const updatedItem = await submitRating(itemId, rating);

      setItems(currentItems =>
        currentItems.map(item =>
          item.id === itemId ? updatedItem : item
        )
      );

      Alert.toast({
        title: '¡Gracias por tu voto!',
        icon: 'success',
        position: 'bottom-end',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al enviar la calificación';
      setError(`Error al enviar calificación: ${errorMessage}`);
    }
  };

  if (error) {
    return <p className="text-[var(--color-error)] text-center justify-center">Error al cargar ítems: {error}</p>;
  }

  return (
    <div className="w-full mx-auto px-0 sm:px-2">
      <h2 className="text-xl md:text-3xl font-black mb-6 md:mb-10 text-center text-white uppercase italic tracking-tighter">
        Zona de <span className="text-[var(--color-primary)]">Votación</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">
        {items.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)] col-span-full">No hay ítems calificables en esta categoría.</p>
        ) : (
          items.map((item) => (
            <CalificarCardTemplate
              key={item.id}
              nombre={item.nombre}
              imagen={item.image || ''}
              promedio={item.averageRating || 0}
              votos={item.ratingCount || 0}
              valorVisual={item.myRating || 0}
              onStarClick={(rating) => handleRatingChange(item.id, rating)}
            />
          ))
        )}
      </div>
    </div>
  );
}
