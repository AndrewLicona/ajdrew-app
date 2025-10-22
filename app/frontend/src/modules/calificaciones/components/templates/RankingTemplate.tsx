// src/modules/calificaciones/components/templates/AnimatedRankingTemplate.tsx
import React from 'react';

interface ItemWithId {
  id?: number | string;
  itemId?: number | string;
  [key: string]: unknown;
}

interface RankingTemplateProps<T extends ItemWithId> {
  ranking: T[];
  loading: boolean;
  error?: string;
  highlightedItemId?: number | string | null;
  renderItem: (item: T, index: number, highlighted: boolean) => React.ReactNode;
  title?: string;
}

export function RankingTemplate<T extends ItemWithId>({
  ranking,
  loading,
  error,
  highlightedItemId,
  renderItem,
  title = 'Ranking',
}: RankingTemplateProps<T>) {
  return (
    <div className="bg-[var(--color-card)] p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-[var(--color-text)] text-center">
        {title}
      </h3>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : error ? (
        <p className="text-[var(--color-error)] text-center">{error}</p>
      ) : (
        <ul className="space-y-2">
          {ranking.map((item, index) =>
            renderItem(item, index, highlightedItemId === (item.id || item.itemId))
          )}
        </ul>
      )}
    </div>
  );
}
