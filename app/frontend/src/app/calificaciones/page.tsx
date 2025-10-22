import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Loading from './loading';
import CalificacionesContent from '@/modules/calificaciones/components/CalificacionesContent';

export const metadata: Metadata = {
  title: 'Calificaciones y Rankings',
  description: 'Califica ítems, revisa los rankings de la comunidad y ayuda a decidir qué es lo mejor en cada categoría.',
};

export default function CalificacionesPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center text-[var(--color-text)] mb-8">
        Calificaciones
      </h1><Suspense fallback={<Loading />}>
        <CalificacionesContent />
      </Suspense>
    </div>
  );
}