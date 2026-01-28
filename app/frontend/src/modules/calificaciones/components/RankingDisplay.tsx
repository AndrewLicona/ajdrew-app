// src/modules/calificaciones/components/RankingDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RankingItem } from '../types';
import { fetchRanking } from '../services/calificacionesService';
import { AnimatedRankingTemplate } from './templates/AnimatedRankingTemplate';
import Image from 'next/image';
import { Trophy, Medal, Star } from 'lucide-react';

interface RankingDisplayProps {
  categoryId?: string;
  categoryName?: string;
  limit?: number;
}

export default function RankingDisplay({ categoryId, categoryName, limit = 5 }: RankingDisplayProps) {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRanking = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const data = await fetchRanking(categoryId, limit);
        // Aplicar límite en frontend también como seguridad
        setRanking(data.slice(0, limit));
        setError(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el ranking';
        setError(errorMessage);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    getRanking(true);
    const interval = setInterval(() => getRanking(false), 5000);

    return () => clearInterval(interval);
  }, [categoryId, limit]);

  const renderItem = (item: RankingItem, index: number) => {
    const ratingPercentage = (item.averageRating / 5) * 100;

    const content = (
      <div className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-xl border border-white/5 bg-black/40 hover:border-[var(--color-primary)]/30 transition-all group/item overflow-hidden relative">
        {/* Medal/Rank */}
        <div className="flex flex-col items-center justify-center w-6 md:w-8 shrink-0 relative">
          {index === 0 ? (
            <Trophy size={16} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] md:size-[18px]" />
          ) : index === 1 ? (
            <Medal size={16} className="text-slate-400 md:size-[18px]" />
          ) : index === 2 ? (
            <Medal size={16} className="text-amber-700 md:size-[18px]" />
          ) : (
            <span className="text-[9px] md:text-[10px] font-black text-white/20 italic">#{index + 1}</span>
          )}
        </div>

        {/* Thumbnail */}
        {item.itemImage && (
          <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-white/10 group-hover/item:border-[var(--color-primary)]/40 transition-colors shrink-0 bg-black/40 shadow-lg">
            <Image
              src={item.itemImage}
              alt={item.itemName}
              fill
              className="object-cover group-hover/item:scale-110 transition-transform duration-700"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 md:mb-1.5">
            <h3 className="text-[9px] md:text-xs font-black text-white uppercase italic tracking-tight truncate group-hover/item:text-[var(--color-primary)] transition-colors">
              {item.itemName}
            </h3>
            <span className="text-[7px] md:text-[9px] font-black text-[var(--color-primary)] shrink-0 bg-[var(--color-primary)]/10 px-1 py-0.5 rounded">
              {item.averageRating.toFixed(1)}
            </span>
          </div>

          {/* Score Bar */}
          <div className="relative h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-1 md:mb-1.5">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary)] to-cyan-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${ratingPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[7px] md:text-[9px] font-bold text-white/20 uppercase tracking-[0.1em]">
            <span>{item.ratingCount} votos</span>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-y-0 left-0 w-1 bg-[var(--color-primary)] scale-y-0 group-hover/item:scale-y-100 transition-transform origin-center" />
      </div>
    );

    if (categoryId) {
      return (
        <Link key={item.itemId || index} href={`/calificaciones/${categoryId}`}>
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <AnimatedRankingTemplate<RankingItem>
      title={categoryName ? `Top ${limit}: ${categoryName}` : `Top ${limit}: General`}
      ranking={ranking}
      loading={loading}
      error={error || undefined}
      renderItem={renderItem}
    />
  );
}
