import React from 'react';
import { Vote, Link as LinkIcon } from 'lucide-react';
import { Juego } from '../../types/juego';
import { BracketCategoryCard } from '../BracketCategoryCard';
import Link from 'next/link';

interface BracketsSectionProps {
    juego: Juego;
    activeTab: string;
}

export const BracketsSection: React.FC<BracketsSectionProps> = ({ juego, activeTab }) => {
    const bracketCategories = juego.categorias
        .filter(cat => cat.votaciones && cat.votaciones.length > 0)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    const generalBrackets = (juego.votaciones || [])
        .filter((v: any) => !v.categoriaId && (v.estado === 'ACTIVA' || v.estado === 'FINALIZADA'));

    if (bracketCategories.length === 0 && generalBrackets.length === 0) return null;

    const isAllTab = activeTab === 'all';

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Vote className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
                        Torneos y Votaciones
                    </h2>
                </div>

                {isAllTab && (
                    <Link
                        href={`/votaciones`}
                        className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline whitespace-nowrap"
                    >
                        Ver todo
                    </Link>
                )}
            </div>

            {isAllTab ? (
                /* Mobile: Horizontal Scroll (Summary view) */
                <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:items-start">
                    <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                        {bracketCategories.slice(0, 3).map(cat => (
                            <div key={`cat-bracket-scroll-${cat.id}`} className="min-w-[85vw] snap-center">
                                <BracketCategoryCard category={cat} isAllTab={isAllTab} />
                            </div>
                        ))}
                    </div>

                    {/* Desktop for 'All' tab */}
                    <div className="hidden md:contents">
                        {bracketCategories.slice(0, 3).map(cat => (
                            <BracketCategoryCard key={`cat-bracket-grid-${cat.id}`} category={cat} isAllTab={isAllTab} />
                        ))}
                    </div>
                </div>
            ) : (
                /* Vertical Grid (Section view - No scroll) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 md:items-start">
                    {bracketCategories.map(cat => (
                        <BracketCategoryCard key={`cat-bracket-full-${cat.id}`} category={cat} isAllTab={isAllTab} />
                    ))}

                    {/* General Brackets Grid Support */}
                    {generalBrackets.length > 0 && (
                        <div className="bg-[var(--color-card)]/50 border border-white/5 rounded-3xl p-6 h-full hover:border-blue-500/30 transition-colors group">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                        <Vote size={14} className="text-blue-400" />
                                    </div>
                                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Torneos Generales</h2>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {generalBrackets.slice(0, 5).map((bracket: any) => (
                                    <Link
                                        key={bracket.id}
                                        href={`/votaciones/${bracket.slug || bracket.id}`}
                                        className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group/bracket"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-black text-white uppercase italic truncate group-hover/bracket:text-blue-400">
                                                {bracket.tematica}
                                            </span>
                                            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                                                {bracket.estado === 'ACTIVA' ? `Ronda ${bracket.rondaActual}` : 'Finalizado'}
                                            </span>
                                        </div>
                                        <div className={`p-1.5 rounded-lg ${bracket.estado === 'ACTIVA' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            <Vote size={12} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
