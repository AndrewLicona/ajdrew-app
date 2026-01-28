import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Loading from './loading';
import CalificacionesContent from '@/modules/calificaciones/components/CalificacionesContent';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rankings Elite - AJDREW',
  description: 'Descubre lo mejor de cada categoría según la comunidad. Rankings en tiempo real con los mejores ítems de tus juegos favoritos.',
};

export default function CalificacionesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 md:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header Section */}
        <section className="text-center mb-12 md:mb-16 space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 mb-4">
            <Sparkles size={14} className="text-[var(--color-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Selección de la Comunidad</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
            RANKINGS <br className="md:hidden" />
            <span className="text-[var(--color-primary)]">ELITE</span>
          </h1>

          <p className="text-sm md:text-lg text-[var(--color-text-secondary)] font-semibold max-w-2xl mx-auto italic opacity-80 leading-relaxed">
            Descubre los ítems mejor valorados por nuestra comunidad. <br className="hidden md:block" />
            Tu voto ayuda a definir quién domina cada categoría.
          </p>
        </section>

        <Suspense fallback={<Loading />}>
          <CalificacionesContent />
        </Suspense>
      </div>
    </div>
  );
}