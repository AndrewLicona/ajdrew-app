// src/components/AnimatedRankingTemplate.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemWithId {
  id?: number | string;
  itemId?: number | string;
  [key: string]: unknown;
}

interface AnimatedRankingTemplateProps<T extends ItemWithId> {
  ranking: T[];
  loading: boolean;
  error?: string;
  highlightedItemId?: number | string | null;
  renderItem: (item: T, index: number, highlighted: boolean) => React.ReactNode;
  title?: string;
}

export function AnimatedRankingTemplate<T extends ItemWithId>({
  ranking,
  loading,
  error,
  highlightedItemId,
  renderItem,
  title = 'Ranking',
}: AnimatedRankingTemplateProps<T>) {
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
        <div className="space-y-2">
          <AnimatePresence>
            {ranking.map((item, index) => (
              <motion.div
                key={item.itemId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {renderItem(item, index, highlightedItemId === (item.id || item.itemId))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
