import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, Target, Trophy, Medal } from 'lucide-react';
import { Categoria } from '../types/juego';

interface RankingCategoryCardProps {
    category: Categoria;
    isAllTab?: boolean;
}

export const RankingCategoryCard: React.FC<RankingCategoryCardProps> = ({ category, isAllTab }) => {
    const type = category.tipo.toLowerCase();
    const isRanking = !['votacion', 'tutorial', 'sorteo', 'bracket'].includes(type);
    const topItems = category.items.slice(0, isAllTab ? 3 : 5);

    return (
        <div className="bg-[var(--color-card)]/50 border border-white/5 rounded-3xl p-6 h-full animate-in fade-in zoom-in-95 duration-500 hover:border-[var(--color-primary)]/20 transition-all group/card shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg group-hover/card:scale-110 transition-transform">
                        {isRanking ? <Star size={14} className="text-[var(--color-primary)]" /> :
                            <Target size={14} className="text-yellow-400" />}
                    </div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter truncate max-w-[150px]">{category.nombre}</h2>
                </div>
                <Link
                    href={`/calificaciones/${category.id}`}
                    className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0"
                >
                    Ver Todo <ChevronRight size={10} />
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {topItems.map((item, index) => {
                    const ratingPercentage = ((item.averageRating || 0) / 5) * 100;

                    return (
                        <Link
                            key={item.id}
                            href={`/calificaciones/${category.id}`}
                            className="group flex items-center gap-4 p-2.5 rounded-2xl bg-black/30 border border-white/5 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Rank Decorator */}
                            <div className="flex flex-col items-center justify-center w-8 shrink-0 relative">
                                {index === 0 ? (
                                    <div className="relative group-hover:scale-125 transition-transform duration-500">
                                        <Trophy size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                                        <div className="absolute -inset-1 bg-yellow-400/20 blur-md rounded-full -z-10 animate-pulse"></div>
                                    </div>
                                ) : index === 1 ? (
                                    <Medal size={18} className="text-slate-400 drop-shadow-[0_0_5px_rgba(148,163,184,0.3)]" />
                                ) : index === 2 ? (
                                    <Medal size={18} className="text-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.3)]" />
                                ) : (
                                    <span className="text-[10px] font-black text-white/30 italic">#{index + 1}</span>
                                )}
                            </div>

                            {/* Item Image */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-[var(--color-primary)]/30 transition-colors shadow-lg shadow-black/40 bg-black/40">
                                <Image
                                    src={item.image || '/LOGO-AJDREW.png'}
                                    alt={item.nombre}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Info Container */}
                            <div className="flex flex-col flex-1 min-w-0 pr-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-black text-white uppercase italic tracking-tight truncate group-hover:text-[var(--color-primary)] transition-colors">
                                        {item.nombre}
                                    </span>
                                    {item.averageRating !== undefined && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[var(--color-primary)]/10">
                                            <span className="text-[10px] font-black text-[var(--color-primary)]">{item.averageRating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Score Bar */}
                                {item.averageRating !== undefined && (
                                    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary)] to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${ratingPercentage}%` }}
                                        />
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white/20 animate-shimmer"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Selection Effect */}
                            <div className="absolute inset-y-0 left-0 w-1 bg-[var(--color-primary)] scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                        </Link>
                    );
                })}
                {topItems.length === 0 && (
                    <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl bg-black/20">
                        <Star className="mx-auto mb-2 text-white/10" size={24} />
                        <p className="text-[var(--color-text-secondary)] text-[10px] font-black uppercase italic tracking-widest opacity-40">Ranking vacío</p>
                    </div>
                )}
            </div>
        </div>
    );
};
