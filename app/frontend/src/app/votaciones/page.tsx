'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Vote, Trophy, ChevronRight, Zap, Activity, ChevronDown, Layers } from 'lucide-react';
import Link from 'next/link';
import { fetchJuegos } from '@/modules/calificaciones/services/calificacionesService';

interface Match {
    ronda: number;
}

interface Bracket {
    id: string;
    tematica: string;
    slug: string;
    estado: string;
    rondaActual: number;
    juego?: { id: string; nombre: string; image: string };
    matches?: Match[];
}

interface Juego {
    id: string;
    nombre: string;
    image?: string;
}

export default function VotacionesPage() {
    const [brackets, setBrackets] = useState<Bracket[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [selectedJuegoId, setSelectedJuegoId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [bracketsRes, juegosData] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones`),
                fetchJuegos()
            ]);
            const bracketsData = await bracketsRes.json();
            // Filter only active or finished ones for public view
            setBrackets(bracketsData.filter((b: any) => b.estado === 'ACTIVA' || b.estado === 'FINALIZADA'));
            setJuegos(juegosData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredBrackets = useMemo(() => {
        if (!selectedJuegoId) return brackets;
        return brackets.filter(bracket => bracket.juego?.id === selectedJuegoId);
    }, [brackets, selectedJuegoId]);

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-40 px-2 md:px-8 lg:px-12 max-w-7xl mx-auto relative overflow-hidden transition-colors duration-500">
            {/* Background Orbs adapted to theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30"></div>

            <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 mb-1 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                    <Zap size={12} className="text-[var(--color-primary)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Competición Arena</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text)] italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    TORNEOS <span className="text-[var(--color-primary)]">ELITE</span>
                </h1>
                <p className="text-[10px] md:text-sm text-[var(--color-text-secondary)] max-w-lg font-black italic opacity-60 uppercase tracking-tight animate-in fade-in duration-1000 delay-300">
                    Tú decides quién domina la arena. Participa en brackets de eliminación directa.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-6 z-50 bg-[#0a0a0a]/10 dark:bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/5 p-2 rounded-[2rem] shadow-xl mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <select
                            value={selectedJuegoId}
                            onChange={(e) => setSelectedJuegoId(e.target.value)}
                            data-testid="game-filter-select"
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-[1.8rem] px-5 py-3 pr-10 text-[var(--color-text)] text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-white/10 hover:border-[var(--color-primary)]/30 transition-all focus:outline-none"
                        >
                            <option value="" className="bg-[#0a0a0a] text-white">
                                Todos los Juegos • {brackets.length}
                            </option>
                            {juegos.map((juego) => {
                                const count = brackets.filter(b => b.juego?.id === juego.id).length;
                                return (
                                    <option key={juego.id} value={juego.id} className="bg-[#0a0a0a] text-white">
                                        {juego.nombre} • {count}
                                    </option>
                                );
                            })}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text)]/30 pointer-events-none" />
                    </div>
                </div>
            </div>

            {filteredBrackets.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-16 text-center animate-in fade-in zoom-in-95 duration-1000">
                    <Vote className="text-white/10 mx-auto mb-4" size={48} />
                    <p className="text-white/30 italic text-lg font-black uppercase tracking-tighter">No hay torneos activos</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                    {filteredBrackets.map((bracket, idx) => {
                        const maxRounds = bracket.matches ? Math.max(...bracket.matches.map(m => m.ronda), 0) : 0;

                        return (
                            <Link
                                key={bracket.id}
                                href={`/votaciones/${bracket.slug || bracket.id}`}
                                className="group relative aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-[#0d0d0d] border border-white/5 hover:border-[var(--color-primary)]/40 transition-all duration-700 hover:-translate-y-1 shadow-2xl animate-in fade-in slide-in-from-bottom-10"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000 scale-110 group-hover:scale-100">
                                    {bracket.juego?.image && (
                                        <img src={bracket.juego.image} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end z-10">
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        <div className="px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1">
                                            <Zap size={8} className="text-[var(--color-primary)]" />
                                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider text-white/80">{bracket.juego?.nombre || 'General'}</span>
                                        </div>
                                        {maxRounds > 0 && (
                                            <div className="px-2 py-0.5 bg-[var(--color-primary)]/20 backdrop-blur-md border border-[var(--color-primary)]/30 rounded-lg flex items-center gap-1">
                                                <Layers size={8} className="text-[var(--color-primary)]" />
                                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider text-[var(--color-primary)]">{maxRounds} FASES</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xs md:text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                        {bracket.tematica}
                                    </h3>

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${bracket.estado === 'ACTIVA' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
                                            <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{bracket.estado}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-white/20 group-hover:text-[var(--color-primary)] transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
