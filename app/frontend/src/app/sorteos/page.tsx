'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Gift, Zap, ChevronDown, Flame, CheckCircle } from 'lucide-react';
import { SorteosList } from '@/modules/juegos/components/SorteosList';
import { Sorteo } from '@/modules/juegos/types/juego';
import { fetchJuegos } from '@/modules/calificaciones/services/calificacionesService';

interface Juego {
    id: string;
    nombre: string;
    image?: string;
}

export default function SorteosPublicPage() {
    const [sorteos, setSorteos] = useState<Sorteo[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [selectedJuegoId, setSelectedJuegoId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ACTIVO' | 'CERRADO'>('ACTIVO');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sorteosRes, juegosData] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos`),
                    fetchJuegos()
                ]);
                const sorteosData = await sorteosRes.json();
                setSorteos(sorteosData);
                setJuegos(juegosData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredSorteos = useMemo(() => {
        let filtered = sorteos;
        if (selectedJuegoId) {
            filtered = filtered.filter(s => (s as any).juego?.id === selectedJuegoId);
        }
        return activeTab === 'ACTIVO'
            ? filtered.filter(s => s.estado === 'ACTIVO')
            : filtered.filter(s => s.estado === 'CERRADO');
    }, [sorteos, selectedJuegoId, activeTab]);

    const sorteosActivos = sorteos.filter(s => s.estado === 'ACTIVO');
    const sorteosCerrados = sorteos.filter(s => s.estado === 'CERRADO');

    return (
        <div className="min-h-screen pt-24 pb-40 px-2 md:px-8 lg:px-12 max-w-7xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>

            <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 mb-1 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                    <Zap size={12} className="text-yellow-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Premios Exclusivos</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    Gana con <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]">AJDREW</span>
                </h1>
                <p className="text-[10px] md:text-sm text-white/40 max-w-lg font-black italic opacity-60 uppercase tracking-tight animate-in fade-in duration-1000 delay-300">
                    Participa en nuestros sorteos exclusivos y llévate premios increíbles. ¡Tu próxima victoria comienza aquí!
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Filter Bar */}
                    <div className="sticky top-6 z-50 bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/5 p-2 rounded-[2rem] shadow-xl mb-12 max-w-2xl mx-auto">
                        <div className="flex gap-2 items-center flex-col md:flex-row">
                            {/* Game Filter */}
                            <div className="relative flex-1 w-full">
                                <select
                                    value={selectedJuegoId}
                                    onChange={(e) => setSelectedJuegoId(e.target.value)}
                                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-[1.8rem] px-5 py-3 pr-10 text-white text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-white/10 hover:border-yellow-400/30 transition-all focus:outline-none"
                                >
                                    <option value="" className="bg-[#0a0a0a] text-white">
                                        Todos los Juegos • {activeTab === 'ACTIVO' ? sorteosActivos.length : sorteosCerrados.length}
                                    </option>
                                    {juegos.map((juego) => {
                                        const count = sorteos.filter(s =>
                                            (s as any).juego?.id === juego.id &&
                                            s.estado === activeTab
                                        ).length;
                                        if (count === 0) return null;
                                        return (
                                            <option key={juego.id} value={juego.id} className="bg-[#0a0a0a] text-white">
                                                {juego.nombre} • {count}
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                            </div>

                            {/* Status Filters */}
                            <div className="flex gap-2 bg-white/5 p-1.5 rounded-[1.5rem] w-full md:w-auto">
                                <button
                                    onClick={() => setActiveTab('ACTIVO')}
                                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-[1.2rem] text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all flex-1 md:flex-none ${activeTab === 'ACTIVO'
                                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                        : 'text-white/50 hover:text-white/70'
                                        }`}
                                >
                                    <Flame size={12} className={activeTab === 'ACTIVO' ? 'fill-current' : ''} />
                                    En Vivo ({sorteosActivos.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('CERRADO')}
                                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-[1.2rem] text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all flex-1 md:flex-none ${activeTab === 'CERRADO'
                                        ? 'bg-gray-600 text-white shadow-lg'
                                        : 'text-white/50 hover:text-white/70'
                                        }`}
                                >
                                    <CheckCircle size={12} />
                                    Finalizados ({sorteosCerrados.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {filteredSorteos.length === 0 ? (
                        <div className="bg-[var(--color-card)] border border-white/5 p-20 rounded-[40px] text-center max-w-3xl mx-auto shadow-2xl">
                            <Zap className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" size={64} />
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
                                {activeTab === 'ACTIVO' ? 'No hay sorteos activos' : 'No hay sorteos finalizados'}
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-lg">
                                {activeTab === 'ACTIVO'
                                    ? '¡Estamos preparando algo legendario! Vuelve pronto para participar.'
                                    : 'Aún no se han cerrado sorteos. ¡Sé de los primeros en participar!'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <SorteosList sorteos={filteredSorteos} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
