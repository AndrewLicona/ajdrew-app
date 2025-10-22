import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Bienvenido a la comunidad de AJDREW. Explora juegos, participa en calificaciones, vota en torneos y mucho más.',
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a AJDREW</h1>

      {/* Sección destacada del Ranking General
      <div className="mb-12 p-6 bg-[var(--color-card)] rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-[var(--color-text)]">Ranking General</h2>
        <Suspense fallback={<p className="text-[var(--color-text-secondary)]">Cargando ranking...</p>}>
          <RankingDisplay categoryName="General" />
        </Suspense>
        <Link 
          href="/calificaciones" 
          className="mt-6 inline-block bg-[var(--color-primary)] text-[var(--color-text-on-primary)] px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors duration-300"
        >
          Ver Calificaciones
        </Link>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 max-w-xl w-full mx-auto"> {/* Centrado */}
        

        {/* Nueva sección de Ranking dentro de un Link a Calificaciones */}
        <Link 
          href="/calificaciones" 
          className="bg-[var(--color-card)] p-6 rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] transition-colors duration-300 flex flex-col justify-between items-center text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Calificar y Rankings</h2>
          <p className="text-[var(--color-text)] opacity-80 mb-4">Explora y participa en los rankings.</p>
          <div className="w-full">
            <Suspense fallback={<p className="text-[var(--color-text-secondary)] text-sm">Cargando...</p>}>
              <RankingDisplay categoryName="General" />
            </Suspense>
          </div>
          <span className="mt-4 text-sm font-medium text-[var(--color-text)] hover:underline">Ver más rankings</span>
        </Link>

        {/* <Link 
          href="/juegos" 
          className="bg-[var(--color-card)] p-6 rounded-xl hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] transition-colors duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Juegos</h2>
          <p className="text-[var(--color-text)] opacity-80">Descubre y juega a los mejores juegos de la comunidad.</p>
        </Link>

        <Link 
          href="/votar" 
          className="bg-[var(--color-card)] p-6 rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] transition-colors duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Votar</h2>
          <p className="text-[var(--color-text)] opacity-80">Participa en torneos y elige a los ganadores.</p>
        </Link>

        <Link 
          href="/sorteos" 
          className="bg-[var(--color-card)] p-6 rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] transition-colors duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Sorteos</h2>
          <p className="text-[var(--color-text)] opacity-80">Participa y gana premios exclusivos.</p>
        </Link>

        <Link 
          href="/tutoriales" 
          className="bg-[var(--color-card)] p-6 rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] transition-colors duration-300 sm:col-span-2"
        >
          <h2 className="text-2xl font-semibold mb-2">Tutoriales</h2>
          <p className="text-[var(--color-text)] opacity-80">Aprende a usar la plataforma con nuestros videos.</p>
        </Link> */}
      </div>
    </div>
  );
};

export default HomePage;