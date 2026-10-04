'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Star, Trophy, Gift, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

interface YTViaje {
  id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  youtubeUrl: string;
  thumbnail?: string;
  recursoTipo?: string;
  recursoId?: string;
}

// Genera o recupera un device ID anónimo del navegador
function getDeviceId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('ajdrew_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ajdrew_device_id', id);
  }
  return id;
}

// Mapa de íconos por tipo de recurso
const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  ranking: <Star size={18} />,
  votacion: <Trophy size={18} />,
  sorteo: <Gift size={18} />,
  tutorial: <BookOpen size={18} />,
};

const RESOURCE_LABELS: Record<string, string> = {
  ranking: 'Ver Ranking',
  votacion: 'Participar en Votación',
  sorteo: 'Ver Sorteo',
  tutorial: 'Ver Tutorial',
};

const RESOURCE_PATHS: Record<string, string> = {
  ranking: '/ranking',
  votacion: '/votaciones',
  sorteo: '/sorteos',
  tutorial: '/tutoriales',
};

interface YtLandingClientProps {
  viaje: YTViaje;
}

export function YtLandingClient({ viaje }: YtLandingClientProps) {
  const tracked = useRef(false);

  // Registrar visita una sola vez
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const deviceId = getDeviceId();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt/${viaje.slug}/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, accion: 'view' }),
    }).catch(() => {/* silencioso */});
  }, [viaje.slug]);

  // Registrar click en recurso
  const handleResourceClick = () => {
    const deviceId = getDeviceId();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt/${viaje.slug}/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, accion: `click_${viaje.recursoTipo || 'resource'}` }),
    }).catch(() => {});
  };

  const resourcePath = viaje.recursoTipo
    ? `${RESOURCE_PATHS[viaje.recursoTipo] || ''}${viaje.recursoId ? `/${viaje.recursoId}` : ''}`
    : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl space-y-6">

        {/* Header con logo de canal */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
            <Youtube size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">AJDREW</p>
            <p className="text-xs text-white/60">Desde YouTube — Te traje algo especial 👇</p>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic leading-tight">
          {viaje.titulo}
        </h1>

        {/* Descripción */}
        {viaje.descripcion && (
          <p className="text-white/70 text-base leading-relaxed">
            {viaje.descripcion}
          </p>
        )}

        {/* Thumbnail o embed de YouTube */}
        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video w-full relative bg-black/40">
          {viaje.youtubeUrl && (
            <iframe
              src={viaje.youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
              title={viaje.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full absolute inset-0"
            />
          )}
        </div>

        {/* CTA principal — recurso relacionado */}
        {resourcePath && viaje.recursoTipo && (
          <Link
            href={resourcePath}
            onClick={handleResourceClick}
            className="flex items-center justify-between gap-4 w-full p-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all group"
          >
            <span className="flex items-center gap-3">
              {RESOURCE_ICONS[viaje.recursoTipo]}
              {RESOURCE_LABELS[viaje.recursoTipo] || 'Ir a la plataforma'}
            </span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Si no hay recurso, botón genérico a home */}
        {!resourcePath && (
          <Link
            href="/"
            className="flex items-center justify-between gap-4 w-full p-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all group"
          >
            <span className="flex items-center gap-3">
              <Trophy size={18} />
              Explorar la plataforma
            </span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Rankings', icon: <Star size={16} />, href: '/ranking' },
            { label: 'Votaciones', icon: <Trophy size={16} />, href: '/votaciones' },
            { label: 'Sorteos', icon: <Gift size={16} />, href: '/sorteos' },
            { label: 'Tutoriales', icon: <BookOpen size={16} />, href: '/tutoriales' },
          ].map(({ label, icon, href }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--color-primary)]/40 transition-all text-white/70 hover:text-white text-sm font-medium"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* Link de vuelta a YouTube */}
        <div className="text-center pt-2">
          <a
            href={viaje.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <Youtube size={14} />
            Ver en YouTube
            <ExternalLink size={12} />
          </a>
        </div>

      </div>
    </main>
  );
}
