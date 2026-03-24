'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, ArrowLeft, Gamepad2, Layers, Sparkles, Target } from 'lucide-react';
import { ShareButton } from '@/shared/components/molecules/ShareButton';
import ItemCalificableList from '@/modules/calificaciones/components/ItemCalificableList';
import RankingDisplay from '@/modules/calificaciones/components/RankingDisplay';
import { fetchCategories, fetchJuegos } from '@/modules/calificaciones/services/calificacionesService';
import type { Categoria, ItemCalificable } from '@/modules/calificaciones/types';

type CategoryWithItems = Categoria & { items: ItemCalificable[]; juegoNombre: string; juegoId?: string };

export default function RankingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<CategoryWithItems | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetailData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [tablasDataRes, juegosDataRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
                ]);

                const tablasData = await tablasDataRes.json();
                const juegosData = await juegosDataRes.json();

                const tablaData = tablasData.find((t: any) => t.slug === id || t.id === id);
                if (tablaData) {
                    const juego = juegosData.find((j: any) => j.id === tablaData.juegoId);
                    setCategory({
                        ...tablaData,
                        items: [], // ItemCalificableList will fetch these
                        juegoNombre: (juego?.nombre || 'General') as string,
                        juegoId: (juego?.id || undefined) as string | undefined
                    });
                }
            } catch (error) {
                console.error("Error loading ranking detail:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDetailData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white/40 font-black uppercase italic tracking-widest animate-pulse text-sm">Cargando Rankings...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="py-40 text-center">
                <h2 className="text-2xl font-black text-white italic uppercase mb-4">Categoría no encontrada</h2>
                <button
                    onClick={() => router.push('/calificaciones')}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:bg-white/10 transition-all"
                >
                    <ArrowLeft size={16} /> Volver a los Rankings
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] py-10 md:py-20">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-12 space-y-8 md:space-y-12">

                {/* Navigation & Header */}
                <div className="space-y-4 md:space-y-6">
                    <button
                        onClick={() => router.push('/calificaciones')}
                        className="group flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 hover:text-[var(--color-primary)] transition-all"
                    >
                        <div className="p-1.5 md:p-2 bg-white/5 rounded-lg md:rounded-xl group-hover:bg-[var(--color-primary)]/10 transition-colors">
                            <ArrowLeft size={14} className="md:size-[16px]" />
                        </div>
                        Volver a los Rankings
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-white/5">
                        <div className="space-y-2 md:space-y-4">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full flex items-center gap-1.5 md:gap-2">
                                    <Gamepad2 size={10} className="text-[var(--color-primary)] md:size-[12px]" />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">{category.juegoNombre}</span>
                                </div>
                                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-white/5 border border-white/5 rounded-full flex items-center gap-1.5 md:gap-2">
                                    <Layers size={10} className="text-white/40 md:size-[12px]" />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">{category.tipo}</span>
                                </div>
                            </div>
                            <h1 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                                {category.nombre}
                            </h1>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-white/20 select-none">
                            <Trophy size={48} className="opacity-10 rotate-12" />
                            <Sparkles size={32} className="opacity-10 -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: 3 Columns on PC */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

                    {/* Left Column: Official Category Ranking */}
                    <aside className="lg:col-span-3 space-y-6 md:space-y-8 order-1 lg:sticky lg:top-32">
                        <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-[var(--color-primary)]/30 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-3xl relative overflow-hidden group/ranking">
                            <div className="relative z-10 w-full">
                                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                    <div className="p-1.5 md:p-2 bg-[var(--color-primary)]/20 rounded-lg md:rounded-xl">
                                        <Trophy size={16} className="text-[var(--color-primary)] md:size-[20px]" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Ranking <span className="text-[var(--color-primary)]">Oficial</span></h3>
                                </div>

                                <RankingDisplay
                                    tablaId={category.id}
                                    categoryName={category.nombre}
                                    limit={5}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Center Column: Voting List */}
                    <div className="lg:col-span-6 space-y-6 md:space-y-10 order-2">
                        <div className="bg-[var(--color-card)]/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 text-[var(--color-primary)]/5 pointer-events-none">
                                <Target size={150} className="rotate-12 translate-x-1/4 -translate-y-1/4" />
                            </div>

                            <div className="relative z-10 w-full">
                                <ItemCalificableList
                                    tablaId={category.id}
                                    initialItems={[]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Global Elite */}
                    <aside className="lg:col-span-3 space-y-6 md:space-y-8 order-3 lg:sticky lg:top-32">
                        <div className="bg-gradient-to-br from-[#0f0f0f] to-[#050505] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative overflow-hidden group/global">
                            <div className="absolute top-0 right-0 p-4 text-[var(--color-primary)]/5 pointer-events-none">
                                <Trophy size={50} className="rotate-12 translate-x-2 -translate-y-2" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 md:mb-6">
                                    <div className="p-1 md:p-1.5 bg-[var(--color-primary)]/10 rounded-lg md:rounded-xl">
                                        <Trophy size={14} className="text-[var(--color-primary)] md:size-[16px]" />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-white uppercase italic tracking-tighter">Élite <span className="text-[var(--color-primary)]">Global</span></h3>
                                </div>

                                <RankingDisplay
                                    limit={10}
                                />
                            </div>
                        </div>

                        {/* Share & Support */}
                        <div className="space-y-3">
                            {category && (
                                <ShareButton
                                    title={`Ranking: ${category.nombre}`}
                                    text={`🏆 Mira el Ranking Oficial de ${category.nombre} en AJDREW!`}
                                    url={typeof window !== 'undefined' ? window.location.href : ''}
                                    variant="full"
                                    className="w-full"
                                />
                            )}

                            <button
                                onClick={() => router.push('/calificaciones')}
                                className="w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 group/btn hover:bg-white/10 transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                            >
                                <ArrowLeft size={12} className="md:size-[14px]" /> Volver a Rankings
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
