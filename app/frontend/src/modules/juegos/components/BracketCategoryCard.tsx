import React from 'react';
import Link from 'next/link';
import { Vote, ChevronRight, Zap, Trophy } from 'lucide-react';
import { Categoria } from '../types/juego';

interface BracketCategoryCardProps {
    category: Categoria;
    isAllTab?: boolean;
}

export const BracketCategoryCard: React.FC<BracketCategoryCardProps> = ({ category, isAllTab }) => {
    const activeBrackets = category.votaciones?.filter((v: any) => v.activa !== false) || [];

    return (
        <div className="bg-[var(--color-card)]/50 border border-white/5 rounded-3xl p-6 h-full animate-in fade-in zoom-in-95 duration-500 hover:border-blue-500/30 transition-colors group">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg flex-shrink-0">
                        <Vote size={14} className="text-blue-400" />
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white uppercase italic tracking-tighter truncate">{category.nombre}</h2>
                </div>
                <Link
                    href={`/votaciones?categoryId=${category.id}`}
                    className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-1 flex-shrink-0"
                >
                    Ver Todo <ChevronRight size={10} />
                </Link>
            </div>

            {/* Vertical Stack for Tournaments (Always vertical for better readability) */}
            {activeBrackets.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {activeBrackets.slice(0, isAllTab ? 3 : 5).map((bracket: any) => (
                        <Link
                            key={bracket.id}
                            href={`/votaciones/${bracket.slug || bracket.id}`}
                            className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group/bracket"
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black text-white uppercase italic truncate group-hover/bracket:text-blue-400 transition-colors">
                                    {bracket.tematica}
                                </span>
                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                                    {bracket.estado === 'ACTIVA' ? `Ronda ${bracket.rondaActual}` : 'Finalizado'}
                                </span>
                            </div>
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${bracket.estado === 'ACTIVA' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {bracket.estado === 'ACTIVA' ? <Zap size={12} className="animate-pulse" /> : <Trophy size={12} />}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center border border-dashed border-white/5 rounded-xl bg-black/20">
                    <p className="text-[var(--color-text-secondary)] text-[10px] italic opacity-60">Sin torneos activos.</p>
                </div>
            )}
        </div>
    );
};
