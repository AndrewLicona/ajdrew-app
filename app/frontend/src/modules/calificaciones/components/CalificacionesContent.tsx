'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import ItemCalificableList from '@/modules/calificaciones/components/ItemCalificableList';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';
import { fetchCategories, fetchItemsForCategory, fetchJuegos } from '@/modules/calificaciones/services/calificacionesService';
import type { Categoria, ItemCalificable } from '@/modules/calificaciones/types';
import { Search, Filter, Gamepad2, Layers, X, Trophy, ChevronRight, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryWithItems = Categoria & { items: ItemCalificable[]; juegoNombre: string; juegoId?: string };

export default function CalificacionesContent() {
  const [allCategories, setAllCategories] = useState<CategoryWithItems[]>([]);
  const [juegos, setJuegos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJuegoId, setSelectedJuegoId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [categoriesData, juegosData] = await Promise.all([
          fetchCategories(),
          fetchJuegos()
        ]);

        setJuegos(juegosData);

        // Build full data structure
        const rawEnriched = await Promise.all(categoriesData.map(async (cat): Promise<CategoryWithItems | null> => {
          const type = cat.tipo.toLowerCase();
          const isRanking = !['votacion', 'tutorial', 'sorteo', 'bracket'].includes(type);
          if (!isRanking) return null;

          const items = await fetchItemsForCategory(cat.id);
          if (items.length === 0) return null;

          // Find game name
          const juego = juegosData.find(j => j.id === (cat as any).juegoId);

          return {
            ...cat,
            items,
            juegoNombre: (juego?.nombre || 'General') as string,
            juegoId: (juego?.id || undefined) as string | undefined
          };
        }));

        const enrichedCategories = rawEnriched.filter((c): c is CategoryWithItems => c !== null);
        setAllCategories(enrichedCategories);
      } catch (error) {
        console.error("Error loading rankings data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filter Logic
  const filteredCategories = useMemo(() => {
    return allCategories.filter(cat => {
      const matchesJuego = !selectedJuegoId || cat.juegoId === selectedJuegoId;
      const matchesCategory = !selectedCategoryName || cat.nombre === selectedCategoryName;

      return matchesJuego && matchesCategory;
    });
  }, [allCategories, selectedJuegoId, selectedCategoryName]);

  // Unique Category Names for the secondary filter (filtered by current game)
  const availableCategoryNames = useMemo(() => {
    const cats = selectedJuegoId
      ? allCategories.filter(c => c.juegoId === selectedJuegoId)
      : allCategories;
    return Array.from(new Set(cats.map(c => c.nombre))).sort();
  }, [allCategories, selectedJuegoId]);

  const selectedJuego = useMemo(() => juegos.find(j => j.id === selectedJuegoId), [juegos, selectedJuegoId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/40 font-black uppercase italic tracking-widest animate-pulse text-sm">Cargando Rankings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-12 max-w-screen-2xl mx-auto">
      {/* Filters Bar - Refactored with Dropdowns */}
      <div className="sticky top-2 md:top-4 z-50 flex flex-col items-center gap-6 mb-12 max-w-5xl mx-auto">


        {/* Separate Total Section */}
        <div className="flex items-center gap-3 animate-in fade-in duration-1000 delay-500">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]/20"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total: {filteredCategories.length} Categorías Academy</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]/20"></div>
        </div>


        <div className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center md:items-center">

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Game Dropdown */}
              <div className="relative min-w-[200px]">
                <button
                  onClick={() => { setIsGameDropdownOpen(!isGameDropdownOpen); setIsCategoryDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-6 py-4 bg-white/5 border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedJuegoId ? 'border-[var(--color-primary)]/50 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/5 text-white/40'} hover:bg-white/10`}
                >
                  <div className="flex items-center gap-2">
                    <Gamepad2 size={16} className={selectedJuegoId ? 'text-[var(--color-primary)]' : 'text-white/20'} />
                    <span className="truncate">{selectedJuego?.nombre || 'Eligir Juego'}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isGameDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {isGameDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-[1.5rem] shadow-4xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                      <button
                        onClick={() => { setSelectedJuegoId(null); setSelectedCategoryName(null); setIsGameDropdownOpen(false); }}
                        className="w-full px-6 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors border-b border-white/5 text-white/40 mb-2"
                      >
                        Ver Todos los Juegos
                      </button>
                      {juegos.map(juego => (
                        <button
                          key={juego.id}
                          onClick={() => { setSelectedJuegoId(juego.id); setSelectedCategoryName(null); setIsGameDropdownOpen(false); }}
                          className={`w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)]/10 transition-colors flex items-center gap-3 ${selectedJuegoId === juego.id ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'text-white/60'}`}
                        >
                          <Gamepad2 size={12} />
                          {juego.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Dropdown (Only visible if game is selected) */}
              {selectedJuegoId && (
                <div className="relative min-w-[200px]">
                  <button
                    onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsGameDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between gap-3 px-6 py-4 bg-white/5 border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedCategoryName ? 'border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-white/5 text-white/40'} hover:bg-white/10`}
                  >
                    <div className="flex items-center gap-2">
                      <Filter size={16} className={selectedCategoryName ? 'text-blue-400' : 'text-white/20'} />
                      <span className="truncate">{selectedCategoryName || 'Categoría'}</span>
                    </div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-[1.5rem] shadow-4xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                        <button
                          onClick={() => { setSelectedCategoryName(null); setIsCategoryDropdownOpen(false); }}
                          className="w-full px-6 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors border-b border-white/5 text-white/40 mb-2"
                        >
                          Todas las Categorías
                        </button>
                        {availableCategoryNames.map(name => (
                          <button
                            key={name}
                            onClick={() => { setSelectedCategoryName(name); setIsCategoryDropdownOpen(false); }}
                            className={`w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 transition-colors ${selectedCategoryName === name ? 'text-blue-400 bg-blue-500/5' : 'text-white/60'}`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(selectedJuegoId || selectedCategoryName) && (
                <button
                  onClick={() => { setSelectedJuegoId(null); setSelectedCategoryName(null); }}
                  className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all border border-red-500/20"
                  title="Limpiar Filtros"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Ver Top General Button (Mobile Only) */}
            <div className="flex-1 md:hidden">
              <button
                onClick={() => {
                  const aside = document.querySelector('aside');
                  aside?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full px-8 py-4 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-black text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
              >
                <Trophy size={14} className="group-hover:scale-110 transition-transform" />
                Ver Top General
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative min-h-[600px]">
        {/* Left Side: Categories Grid */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="py-20 md:py-32 text-center border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem] bg-black/20">
              <Filter size={40} className="mx-auto mb-4 text-white/10" />
              <p className="text-white/40 font-black uppercase italic tracking-widest text-sm md:text-base">No se encontraron categorías</p>
              <p className="text-white/20 text-[10px] md:text-xs font-bold mt-2">Prueba ajustando los filtros o buscando otra cosa</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:gap-10">
              {filteredCategories.map((category) => (
                <div key={category.id} className="relative group">
                  <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-6 backdrop-blur-md shadow-3xl hover:border-[var(--color-primary)]/40 transition-all flex flex-col relative overflow-hidden group/card">

                    {/* Official Badge Decor */}
                    <div className="absolute top-0 right-0 p-6 text-[var(--color-primary)]/5 pointer-events-none group-hover/card:scale-110 group-hover/card:text-[var(--color-primary)]/10 transition-all duration-700">
                      <Trophy size={100} className="rotate-12 translate-x-1/4 -translate-y-1/4" />
                    </div>

                    {/* Header with Title & Game */}
                    <div className="flex items-start justify-between mb-6 md:mb-10 relative z-10">
                      <div className="flex-1 min-w-0">
                        <div className="px-1.5 py-0.5 md:px-3 md:py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full inline-flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                          <Zap size={8} className="text-[var(--color-primary)] md:size-[10px]" />
                          <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)]">Oficial</span>
                        </div>
                        <Link href={`/calificaciones/${category.id}`}>
                          <h2 className="text-base md:text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-colors leading-none truncate">
                            {category.nombre}
                          </h2>
                        </Link>
                      </div>
                      <div className="p-2 md:p-4 bg-white/5 rounded-xl md:rounded-2xl group-hover/card:bg-[var(--color-primary)]/10 border border-white/5 group-hover/card:border-[var(--color-primary)]/30 transition-all shadow-xl ml-2 shrink-0">
                        <Trophy size={16} className="text-white/20 group-hover/card:text-[var(--color-primary)] transition-colors md:size-[28px]" />
                      </div>
                    </div>

                    {/* Ranking Preview */}
                    <div className="mb-6 md:mb-10 relative z-10">
                      <RankingDisplay
                        categoryId={category.id}
                        limit={5}
                      />
                    </div>

                    {/* Action Button - More Official Look */}
                    <Link href={`/calificaciones/${category.id}`} className="mt-auto relative z-10">
                      <div className="group/btn flex items-center justify-center gap-3 w-full py-5 px-6 bg-white/5 hover:bg-[var(--color-primary)] text-white/40 hover:text-white border border-white/5 hover:border-[var(--color-primary)] rounded-[1.5rem] transition-all duration-500 overflow-hidden relative shadow-lg hover:shadow-[0_10px_30px_rgba(var(--color-primary-rgb),0.3)]">
                        <span className="text-xs font-black uppercase tracking-[0.2em] relative z-10">Ver Ranking y Votar</span>
                        <ChevronRight size={18} className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Sticky Global Ranking (Top 10) */}
        <aside className="w-full lg:w-80 xl:w-[400px] lg:sticky lg:top-36 shrink-0 space-y-6 mt-8 lg:mt-0">
          <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-[var(--color-primary)]/20 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-3xl relative overflow-hidden group/top">
            <div className="absolute top-0 right-0 p-8 text-[var(--color-primary)]/5 pointer-events-none">
              <Trophy size={100} className="md:size-[120px] scale-125 -rotate-12 translate-x-8 -translate-y-8" />
            </div>

            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-1.5 md:p-2 bg-[var(--color-primary)]/20 rounded-xl">
                  <Trophy size={18} className="md:size-[20px] text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Élite <span className="text-[var(--color-primary)]">Global</span></h3>
              </div>

              <RankingDisplay
                limit={10}
              />
            </div>
          </div>
        </aside>
      </div>
    </div >
  );
}
