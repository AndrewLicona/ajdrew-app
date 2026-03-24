'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';
import { Gamepad2, Layers, X, Trophy, ChevronRight, Zap, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tabla {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  image?: string;
  juegoId: string;
  categoriaId?: string;
  juego?: { id: string; nombre: string };
  categoria?: { id: string; nombre: string; tipo: string };
}

export default function CalificacionesContent() {
  const [tablas, setTablas] = useState<Tabla[]>([]);
  const [juegos, setJuegos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJuegoId, setSelectedJuegoId] = useState<string | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tablasRes, juegosRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`),
        ]);
        setTablas(await tablasRes.json());
        setJuegos(await juegosRes.json());
      } catch (e) {
        console.error('Error loading calificaciones:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Unique categories from the tablas currently visible for the selected game
  const availableCategorias = useMemo(() => {
    const source = selectedJuegoId
      ? tablas.filter(t => t.juegoId === selectedJuegoId)
      : tablas;
    const map = new Map<string, { id: string; nombre: string }>();
    source.forEach(t => {
      if (t.categoria) map.set(t.categoria.id, t.categoria);
    });
    return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [tablas, selectedJuegoId]);

  // Filtered tablas
  const filteredTablas = useMemo(() => {
    return tablas.filter(t => {
      if (selectedJuegoId && t.juegoId !== selectedJuegoId) return false;
      if (selectedCategoriaId) {
        if (selectedCategoriaId === '__none__') return !t.categoriaId;
        return t.categoriaId === selectedCategoriaId;
      }
      return true;
    });
  }, [tablas, selectedJuegoId, selectedCategoriaId]);

  // Group filtered tablas by categoria for display
  const groupedTablas = useMemo(() => {
    const groups = new Map<string, { label: string; tablas: Tabla[] }>();
    filteredTablas.forEach(t => {
      const key = t.categoriaId || '__none__';
      const label = t.categoria?.nombre || 'General';
      if (!groups.has(key)) groups.set(key, { label, tablas: [] });
      groups.get(key)!.tablas.push(t);
    });
    // Sort: put named categories first, General last
    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === '__none__') return 1;
      if (b === '__none__') return -1;
      return 0;
    });
  }, [filteredTablas]);

  const selectedJuego = juegos.find(j => j.id === selectedJuegoId);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 font-black uppercase italic tracking-widest animate-pulse text-sm">Cargando Rankings...</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-12 max-w-screen-2xl mx-auto">

      {/* ── FILTERS BAR ─────────────────────────────────────── */}
      <div className="sticky top-2 md:top-4 z-50 flex flex-col items-center gap-4 mb-12 max-w-5xl mx-auto">

        <div className="flex items-center gap-3 animate-in fade-in duration-1000 delay-500">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            {filteredTablas.length} Calificaci{filteredTablas.length === 1 ? 'ón' : 'ones'}
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]/20" />
        </div>

        <div className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 p-4 md:p-5 rounded-[1.5rem] shadow-2xl">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center justify-between">

            {/* Game picker */}
            <div className="relative min-w-[190px]">
              <button
                onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-white/5 border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedJuegoId ? 'border-[var(--color-primary)]/50 text-white' : 'border-white/5 text-white/40'} hover:bg-white/10`}
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 size={14} className={selectedJuegoId ? 'text-[var(--color-primary)]' : 'text-white/20'} />
                  <span className="truncate">{selectedJuego?.nombre || 'Todos los Juegos'}</span>
                </div>
                <ChevronRight size={12} className={`transition-transform ${isGameDropdownOpen ? 'rotate-90' : ''}`} />
              </button>
              {isGameDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-[1.2rem] shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-150">
                  <div className="max-h-56 overflow-y-auto no-scrollbar py-2">
                    <button
                      onClick={() => { setSelectedJuegoId(null); setSelectedCategoriaId(null); setIsGameDropdownOpen(false); }}
                      className="w-full px-5 py-2.5 text-left text-[9px] font-black uppercase tracking-widest hover:bg-white/5 border-b border-white/5 text-white/40"
                    >
                      Todos los Juegos
                    </button>
                    {juegos.map(j => (
                      <button
                        key={j.id}
                        onClick={() => { setSelectedJuegoId(j.id); setSelectedCategoriaId(null); setIsGameDropdownOpen(false); }}
                        className={`w-full px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)]/10 flex items-center gap-2 ${selectedJuegoId === j.id ? 'text-[var(--color-primary)]' : 'text-white/60'}`}
                      >
                        <Gamepad2 size={11} />{j.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category dropdown */}
            {availableCategorias.length > 0 && (
              <div className="relative min-w-[190px]">
                <button
                  onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsGameDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-white/5 border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    selectedCategoriaId ? 'border-blue-500/50 text-white' : 'border-white/5 text-white/40'
                  } hover:bg-white/10`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={14} className={selectedCategoriaId ? 'text-blue-400' : 'text-white/20'} />
                    <span className="truncate">
                      {selectedCategoriaId
                        ? availableCategorias.find(c => c.id === selectedCategoriaId)?.nombre || 'Categoría'
                        : 'Todas las Categorías'}
                    </span>
                  </div>
                  <ChevronRight size={12} className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-90' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-[1.2rem] shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-56 overflow-y-auto no-scrollbar py-2">
                      <button
                        onClick={() => { setSelectedCategoriaId(null); setIsCategoryDropdownOpen(false); }}
                        className="w-full px-5 py-2.5 text-left text-[9px] font-black uppercase tracking-widest hover:bg-white/5 border-b border-white/5 text-white/40"
                      >
                        Todas las Categorías
                      </button>
                      {availableCategorias.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategoriaId(cat.id); setIsCategoryDropdownOpen(false); }}
                          className={`w-full px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 flex items-center gap-2 ${
                            selectedCategoriaId === cat.id ? 'text-blue-400' : 'text-white/60'
                          }`}
                        >
                          <Layers size={11} />{cat.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clear */}
            {(selectedJuegoId || selectedCategoriaId) && (
              <button
                onClick={() => { setSelectedJuegoId(null); setSelectedCategoriaId(null); }}
                className="px-4 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all border border-red-500/20"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative min-h-[600px]">

        {/* Left: Grouped Tablas */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-14">
          {groupedTablas.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-black/20">
              <Filter size={40} className="mx-auto mb-4 text-white/10" />
              <p className="text-white/40 font-black uppercase italic tracking-widest text-sm">No se encontraron calificaciones</p>
            </div>
          ) : (
            groupedTablas.map(([key, group]) => (
              <div key={key}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <Layers size={14} className="text-blue-400" />
                  </div>
                  <h2 className="text-base md:text-xl font-black text-white uppercase italic tracking-tighter">
                    {group.label}
                  </h2>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{group.tablas.length} tabla{group.tablas.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {group.tablas.map(tabla => (
                    <motion.div
                      key={tabla.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group"
                    >
                      <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 backdrop-blur-md shadow-3xl hover:border-[var(--color-primary)]/40 transition-all overflow-hidden group/card">
                        <div className="absolute top-0 right-0 p-6 text-[var(--color-primary)]/5 pointer-events-none group-hover/card:text-[var(--color-primary)]/10 transition-all duration-700">
                          <Trophy size={100} className="rotate-12 translate-x-1/4 -translate-y-1/4" />
                        </div>

                        {/* Header */}
                        <div className="flex items-start justify-between mb-5 relative z-10">
                          <div className="flex-1 min-w-0">
                            <div className="px-2 py-0.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full inline-flex items-center gap-1.5 mb-3">
                              <Zap size={8} className="text-[var(--color-primary)]" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                                {tabla.juego?.nombre || 'General'}
                              </span>
                            </div>
                            <Link href={`/calificaciones/${tabla.slug}`}>
                              <h3 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tighter group-hover/card:text-[var(--color-primary)] transition-colors leading-none">
                                {tabla.nombre}
                              </h3>
                            </Link>
                            {tabla.descripcion && (
                              <p className="text-white/30 text-xs mt-2 line-clamp-1">{tabla.descripcion}</p>
                            )}
                          </div>
                          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover/card:border-[var(--color-primary)]/30 transition-all ml-3 shrink-0">
                            <Trophy size={20} className="text-white/20 group-hover/card:text-[var(--color-primary)] transition-colors" />
                          </div>
                        </div>

                        {/* Ranking preview */}
                        <div className="mb-5 relative z-10">
                          <RankingDisplay tablaId={tabla.id} limit={5} />
                        </div>

                        <Link href={`/calificaciones/${tabla.slug}`} className="relative z-10 block">
                          <div className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-[var(--color-primary)] text-white/40 hover:text-white border border-white/5 hover:border-[var(--color-primary)] rounded-xl transition-all duration-300">
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Ver Ranking y Votar</span>
                            <ChevronRight size={16} className="group-hover/card:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Global Top 10 sidebar */}
        <aside className="w-full lg:w-80 xl:w-[380px] lg:col-span-4 xl:col-span-3 lg:sticky lg:top-36">
          <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-[var(--color-primary)]/20 p-5 rounded-[1.5rem] shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[var(--color-primary)]/5 pointer-events-none">
              <Trophy size={100} className="scale-125 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-[var(--color-primary)]/20 rounded-xl">
                  <Trophy size={18} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Élite <span className="text-[var(--color-primary)]">Global</span></h3>
              </div>
              <RankingDisplay limit={10} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
