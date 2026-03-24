'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, ChevronRight, Zap, Layers, Star } from 'lucide-react';
import Link from 'next/link';
import { Juego } from '../../types/juego';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';

interface Tabla {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  categoriaId?: string;
  categoria?: { id: string; nombre: string };
  juegoId: string;
}

interface RankingsSectionProps {
  juego: Juego;
  activeTab: string;
}

// ─── Compact category card (like BracketCategoryCard) used in 'all' tab ──────
function RankingCategoryCardCompact({ label, tablas }: { label: string; tablas: Tabla[] }) {
  return (
    <div className="bg-[var(--color-card)]/50 border border-white/5 rounded-3xl p-6 h-full animate-in fade-in zoom-in-95 duration-500 hover:border-[var(--color-primary)]/30 transition-colors group">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
            <Trophy size={14} className="text-yellow-500" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase italic tracking-tighter truncate">{label}</h2>
        </div>
        <Link
          href="/calificaciones"
          className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0"
        >
          Ver Todo <ChevronRight size={10} />
        </Link>
      </div>

      {/* Tabla rows */}
      <div className="flex flex-col gap-3">
        {tablas.slice(0, 5).map(tabla => (
          <Link
            key={tabla.id}
            href={`/calificaciones/${tabla.slug}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all group/t"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-white uppercase italic truncate group-hover/t:text-[var(--color-primary)] transition-colors">
                {tabla.nombre}
              </span>
              {tabla.descripcion && (
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5 truncate">
                  {tabla.descripcion}
                </span>
              )}
            </div>
            <div className="p-1.5 rounded-lg shrink-0 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Star size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Full tabla card (used in 'ranking' tab) with top-3 preview ───────────────
function TablaCardFull({ tabla }: { tabla: Tabla }) {
  return (
    <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-white/5 rounded-2xl p-4 hover:border-[var(--color-primary)]/40 transition-all overflow-hidden group/card relative flex flex-col h-full">
      <div className="absolute top-0 right-0 p-3 text-[var(--color-primary)]/5 pointer-events-none group-hover/card:text-[var(--color-primary)]/10 transition-all duration-700">
        <Trophy size={60} className="rotate-12 translate-x-1/4 -translate-y-1/4" />
      </div>
      <div className="relative z-10 mb-3">
        <Link href={`/calificaciones/${tabla.slug}`}>
          <h4 className="text-sm md:text-base font-black text-white italic uppercase tracking-tighter group-hover/card:text-[var(--color-primary)] transition-colors leading-tight line-clamp-1">
            {tabla.nombre}
          </h4>
        </Link>
        {tabla.descripcion && (
          <p className="text-white/30 text-[10px] mt-0.5 line-clamp-1">{tabla.descripcion}</p>
        )}
      </div>
      <div className="relative z-10 mb-3 flex-1">
        {/* Only top 3 in full/ranking tab */}
        <RankingDisplay tablaId={tabla.id} limit={3} />
      </div>
      <Link href={`/calificaciones/${tabla.slug}`} className="relative z-10 block mt-auto">
        <div className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-[var(--color-primary)] text-white/40 hover:text-white border border-white/5 hover:border-[var(--color-primary)] rounded-xl transition-all duration-300 group/btn">
          <span className="text-[9px] font-black uppercase tracking-widest">Ver y Votar</span>
          <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export const RankingsSection: React.FC<RankingsSectionProps> = ({ juego, activeTab }) => {
  const [tablas, setTablas] = useState<Tabla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!juego?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion?juegoId=${juego.id}`)
      .then(r => r.json())
      .then(data => setTablas(Array.isArray(data) ? data : []))
      .catch(() => setTablas([]))
      .finally(() => setLoading(false));
  }, [juego?.id]);

  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; tablas: Tabla[] }>();
    tablas.forEach(t => {
      const key = t.categoriaId || '__none__';
      const label = t.categoria?.nombre || 'General';
      if (!map.has(key)) map.set(key, { label, tablas: [] });
      map.get(key)!.tablas.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === '__none__') return 1;
      if (b === '__none__') return -1;
      return 0;
    });
  }, [tablas]);

  if (loading || tablas.length === 0) return null;

  const isAllTab = activeTab === 'all';

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-xl">
            <Trophy className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
            Rankings y Calificaciones
          </h2>
        </div>
        {isAllTab && (
          <Link href="/calificaciones" className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline whitespace-nowrap">
            Ver todo
          </Link>
        )}
      </div>

      {isAllTab ? (
        /* ── 'All' tab: compact category cards like BracketCategoryCard ── */
        <>
          {/* Mobile: horizontal scroll */}
          <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {grouped.slice(0, 3).map(([key, group]) => (
              <div key={key} className="min-w-[85vw] snap-center">
                <RankingCategoryCardCompact label={group.label} tablas={group.tablas} />
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {grouped.slice(0, 3).map(([key, group]) => (
              <RankingCategoryCardCompact key={key} label={group.label} tablas={group.tablas} />
            ))}
          </div>
        </>
      ) : (
        /* ── 'Rankings' tab: full tabla cards grouped by category, top 3 ── */
        <div className="space-y-10">
          {grouped.map(([key, group]) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
                  <Layers size={12} className="text-yellow-500" />
                </div>
                <span className="text-xs font-black text-white/60 uppercase italic tracking-tighter">{group.label}</span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{group.tablas.length} tabla{group.tablas.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.tablas.map(t => <TablaCardFull key={t.id} tabla={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
