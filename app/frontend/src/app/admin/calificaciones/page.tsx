'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Star, Users, Search, Tag, Gamepad2, Layers, X, Loader2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/shared/components/atoms/Input';

interface RankingItem {
    itemId: string;
    itemName: string;
    itemImage: string;
    averageRating: number;
    ratingCount: number;
}

interface Categoria { id: string; nombre: string; }
interface Juego { id: string; nombre: string; }

export default function AdminRankingsPage() {
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedJuego, setSelectedJuego] = useState<string>('');

    const fetchFilters = async () => {
        try {
            const [catRes, jueRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
            ]);
            const jueData = await jueRes.json();
            setCategorias(await catRes.json());
            setJuegos(jueData);
            
            // Default to the first game if available
            if (jueData && jueData.length > 0) {
                setSelectedJuego(jueData[0].id);
            }
        } catch (e) { console.error(e); }
    };

    const fetchRanking = useCallback(async () => {
        if (!selectedCategory && !selectedJuego) {
            setRanking([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/calificaciones/ranking-list`;
            const params = new URLSearchParams();
            if (selectedCategory) params.append('categoryId', selectedCategory);
            if (selectedJuego) params.append('juegoId', selectedJuego);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            setRanking(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching ranking:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedJuego]);

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        if (selectedCategory || selectedJuego) {
            fetchRanking();
        }
    }, [fetchRanking, selectedCategory, selectedJuego]);

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Calificaciones / Rankings</h1>
                    <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-black">Monitorea los leaderboards por Juego o Categoría</p>
                </div>
            </div>

            <div className="bg-[var(--color-card)] p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4 md:space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Game Selector */}
                    <div className="relative w-full lg:w-72">
                        <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <select
                            value={selectedJuego}
                            onChange={(e) => setSelectedJuego(e.target.value)}
                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] appearance-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer outline-none shadow-inner"
                        >
                            <option value="" className="bg-[#111] text-white">Todos los Juegos</option>
                            {juegos.map(jue => (
                                <option key={jue.id} value={jue.id} className="bg-[#111] text-white">{jue.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                    </div>

                    {/* Category Selector */}
                    <div className="relative w-full lg:w-72">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] appearance-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer outline-none shadow-inner"
                        >
                            <option value="" className="bg-[#111] text-white">Todas las Categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#111] text-white">{cat.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
                </div>
            ) : ranking.length === 0 ? (
                <div className="text-center py-20 text-white/30 italic text-sm">
                    No hay calificaciones registradas para los filtros seleccionados.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {ranking.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                key={item.itemId}
                                className="bg-[var(--color-card)] rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-4 hover:border-[var(--color-primary)]/30 transition-all group"
                            >
                                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 border border-[var(--color-primary)]/30 flex items-center justify-center font-black text-[var(--color-primary)] z-10 shadow-lg">
                                    #{index + 1}
                                </div>
                                <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)] transition-colors">
                                    <Image
                                        src={item.itemImage || '/placeholder.png'}
                                        alt={item.itemName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-black text-sm uppercase italic tracking-tighter truncate w-48">{item.itemName}</h3>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                                            <Star size={12} className="text-yellow-500" />
                                            <span className="text-xs font-black text-yellow-500">{item.averageRating.toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                            <Users size={12} className="text-blue-400" />
                                            <span className="text-xs font-black text-blue-400">{item.ratingCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
