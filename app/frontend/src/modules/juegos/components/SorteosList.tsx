import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Zap, CheckCircle2, Calendar, Youtube, Star, Trophy } from 'lucide-react';
import { Sorteo } from '../types/juego';
import Swal from 'sweetalert2';
import { ParticipationModal } from '@/modules/sorteos/components/ParticipationModal';

interface SorteosListProps {
    sorteos: Sorteo[];
    limit?: number;
    isSection?: boolean;
    isAllTab?: boolean;
}

export const SorteosList: React.FC<SorteosListProps> = ({ sorteos, limit, isSection, isAllTab }) => {
    const [participatingIds, setParticipatingIds] = useState<string[]>([]);
    const [user, setUser] = useState<any>(null);
    const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const handleParticipar = async (sorteo: Sorteo) => {
        // Abre modal de participación directamente (soporta usuarios anónimos)
        setSelectedSorteo(sorteo);
    };

    const handleParticipationSuccess = () => {
        if (selectedSorteo) {
            setParticipatingIds(prev => [...prev, selectedSorteo.id]);
        }
    };

    const displayedSorteos = limit ? sorteos.slice(0, limit) : sorteos;

    if (displayedSorteos.length === 0) return null;

    return (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {!isSection && (
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Gift className="text-yellow-400 w-5 h-5 md:w-7 md:h-7" />
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight text-glow-yellow">Sorteos Exclusivos</h2>
                    </div>
                    <Link href="/sorteos" className="text-xs font-bold text-yellow-500 uppercase tracking-widest hover:underline">Ver todos</Link>
                </div>
            )}
            {/* Adaptive layout for Mobile (Scroll in 'All', Grid in 'Section'), Grid for Desktop */}
            <div className="relative">
                <div className={`${isAllTab ? 'flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide' : 'grid grid-cols-2'} md:grid md:grid-cols-3 gap-3 md:gap-4`}>
                    {displayedSorteos.map(sorteo => {
                        const isParticipating = participatingIds.includes(sorteo.id);
                        const isClosed = sorteo.estado === 'CERRADO';
                        const winners = (sorteo as any).ganadores || [];

                        return (
                            <div
                                key={sorteo.id}
                                onClick={() => !isClosed && handleParticipar(sorteo)}
                                className={`group relative bg-[var(--color-card)]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-500 flex flex-col shadow-xl cursor-pointer select-none ${isAllTab ? 'min-w-[240px] md:min-w-0 snap-start' : 'w-full'}`}
                            >
                                {/* Image Header - Top (Cover) */}
                                <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden bg-black border-b border-white/5">
                                    {sorteo.image ? (
                                        <img
                                            src={sorteo.image}
                                            alt={sorteo.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-yellow-500/5">
                                            <Gift className="text-yellow-500/10" size={32} />
                                        </div>
                                    )}

                                    {/* Status Chip Overlay */}
                                    <div className="absolute top-2 right-2 z-20">
                                        <div className={`flex items-center gap-1 text-[7px] md:text-[8px] font-black uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-full backdrop-blur-md border ${isClosed
                                            ? 'bg-black/60 border-gray-500/30 text-gray-400'
                                            : 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20'}`}>
                                            {isClosed ? 'Fín' : <><Zap size={8} className="fill-current" /> Live</>}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-3 md:p-4 flex flex-col flex-1">
                                    <div className="flex-1 space-y-1 md:space-y-2">
                                        <h3 className="text-[11px] md:text-sm font-black text-white uppercase italic tracking-tight group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                                            {sorteo.titulo}
                                        </h3>

                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg max-w-full">
                                            <Star size={8} className="text-yellow-400 fill-yellow-400 shrink-0" />
                                            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-wider truncate">
                                                {sorteo.premio}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5 space-y-2 md:space-y-3">
                                        <div className="flex flex-col gap-0.5 text-[7px] md:text-[8px] font-bold uppercase tracking-widest">
                                            <div className="flex justify-between text-white/40">
                                                <span>Finaliza:</span>
                                                <span>
                                                    {new Date(sorteo.fechaFin).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-end">
                                                <span className="text-yellow-500/60 font-black">
                                                    {new Date(sorteo.fechaFin).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} HS
                                                </span>
                                            </div>
                                        </div>

                                        {/* Feedback line for participation status */}
                                        {isParticipating && (
                                            <div className="flex items-center justify-center gap-1.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <CheckCircle2 size={10} className="text-green-400" />
                                                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Ya estás dentro</span>
                                            </div>
                                        )}

                                        {isClosed && (
                                            <div className="space-y-2">
                                                {winners.length > 0 ? (
                                                    <div className="w-full px-2 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-1.5">
                                                        <Trophy size={10} className="text-yellow-400" />
                                                        <span className="text-[8px] font-bold text-yellow-400 truncate">
                                                            Ganador: {winners[0].usuario?.nombre || winners[0].nombreManual || 'Ver más'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    sorteo.externalUrl && (
                                                        <a
                                                            href={sorteo.externalUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[8px] font-black uppercase flex items-center justify-center gap-2 border border-white/10 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Youtube size={12} className="text-red-500" /> Resultados
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Click Highlight Overlay (Desktop only) */}
                                <div className="absolute inset-0 bg-yellow-500/0 group-active:bg-yellow-500/5 transition-colors pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Participation Modal */}
            {selectedSorteo && (
                <ParticipationModal
                    sorteo={{
                        id: selectedSorteo.id,
                        titulo: selectedSorteo.titulo,
                        premio: selectedSorteo.premio,
                        tareas: (selectedSorteo as any).tareas || []
                    }}
                    onClose={() => setSelectedSorteo(null)}
                    onSuccess={handleParticipationSuccess}
                />
            )}
        </section>
    );
};
