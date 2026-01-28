import React from 'react';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { Juego } from '../../types/juego';
import { RankingCategoryCard } from '../RankingCategoryCard';

interface RankingsSectionProps {
    juego: Juego;
    activeTab: string;
}

export const RankingsSection: React.FC<RankingsSectionProps> = ({ juego, activeTab }) => {
    const rankingCategories = juego.categorias
        .filter(cat => {
            const type = cat.tipo.toLowerCase();
            const isReservedType = ['votacion', 'tutorial', 'sorteo', 'bracket'].includes(type);
            return !isReservedType;
        })
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (rankingCategories.length === 0) return null;

    const isAllTab = activeTab === 'all';
    const categoriesToShow = isAllTab ? rankingCategories.slice(0, 3) : rankingCategories;

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-xl">
                        <Trophy className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
                        Rankings y Posiciones
                    </h2>
                </div>

                {isAllTab && (
                    <Link
                        href={`/calificaciones`}
                        className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline whitespace-nowrap"
                    >
                        Ver todo
                    </Link>
                )}
            </div>

            {isAllTab ? (
                /* Mobile: Horizontal Scroll (Summary) */
                <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:items-start">
                    <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                        {categoriesToShow.map(cat => (
                            <div key={`rank-scroll-${cat.id}`} className="min-w-[85vw] snap-center">
                                <RankingCategoryCard category={cat} isAllTab={isAllTab} />
                            </div>
                        ))}
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:contents">
                        {categoriesToShow.map(cat => (
                            <RankingCategoryCard key={`rank-grid-mini-${cat.id}`} category={cat} isAllTab={isAllTab} />
                        ))}
                    </div>
                </div>
            ) : (
                /* Vertical Grid (Full Section) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all">
                    {categoriesToShow.map(cat => (
                        <RankingCategoryCard key={`rank-grid-full-${cat.id}`} category={cat} isAllTab={isAllTab} />
                    ))}
                </div>
            )}
        </section>
    );
};
