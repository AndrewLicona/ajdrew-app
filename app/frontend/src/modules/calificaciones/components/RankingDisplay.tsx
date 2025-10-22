// src/modules/calificaciones/components/RankingDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { RankingItem } from '../types';
import { fetchRanking } from '../services/calificacionesService';
import { AnimatedRankingTemplate } from './templates/AnimatedRankingTemplate';
import Image from 'next/image';

interface RankingDisplayProps {
  categoryId?: string;
  categoryName?: string;
}

export default function RankingDisplay({ categoryId, categoryName }: RankingDisplayProps) {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRanking = async (showLoading = true) => {
      if(showLoading) setLoading(true);
      try {
        const data = await fetchRanking(categoryId);
        setRanking(data);
        setError(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el ranking';
        setError(errorMessage);
      } finally {
        if(showLoading) setLoading(false);
      }
    };

    getRanking(true); 
    const interval = setInterval(() => getRanking(false), 3000); 

    return () => clearInterval(interval); 
  }, [categoryId]);

  const renderItem = (item: RankingItem, index: number) => {
    let medalClass = 'text-gray-400';
    if (index === 0) medalClass = 'text-yellow-400';
    else if (index === 1) medalClass = 'text-gray-300';
    else if (index === 2) medalClass = 'text-amber-600';

    return (
      <div className="flex items-center space-x-1.5 p-2 rounded-lg border-[var(--color-primary)]/30">
        <span className={`text-sm font-bold w-4 text-center flex-shrink-0 ${medalClass}`}>
          {index + 1}.
        </span>
        {item.itemImage && (
          <Image 
            src={item.itemImage} 
            alt={item.itemName} 
            width={32}
            height={32}
            className="w-8 h-8 object-contain border-[var(--color-primary)]/30 rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-white truncate">{item.itemName}</h3>
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center">
              <span className="text-[11px] font-bold text-yellow-400">
                {item.averageRating.toFixed(1)}
              </span>
              <span className="text-[9px] font-bold text-[var(--color-text-secondary)] ml-0.5">/5.0</span>
            </div>
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              {item.ratingCount} {item.ratingCount === 1 ? 'voto' : 'votos'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatedRankingTemplate<RankingItem>
      title={categoryName ? `Top ${categoryName}` : 'Top General'}
      ranking={ranking}
      loading={loading}
      error={error || undefined}
      renderItem={renderItem}
    />
  );
}
