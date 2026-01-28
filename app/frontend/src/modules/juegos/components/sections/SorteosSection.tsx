import React from 'react';
import { Gift } from 'lucide-react';
import { Juego } from '../../types/juego';
import { SorteosList } from '../SorteosList';
import Link from 'next/link';

interface SorteosSectionProps {
    juego: Juego;
    activeTab: string;
}

export const SorteosSection: React.FC<SorteosSectionProps> = ({ juego, activeTab }) => {
    const activeSorteos = (juego.sorteos || []).filter(s => s.estado === 'ACTIVA' || s.estado === 'ACTIVO');

    if (activeSorteos.length === 0) return null;

    const isAllTab = activeTab === 'all';

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-xl">
                        <Gift className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
                        Sorteos Exclusivos
                    </h2>
                </div>

                {isAllTab && (
                    <Link
                        href="/sorteos"
                        className="text-[10px] font-black text-yellow-500 uppercase tracking-widest hover:underline whitespace-nowrap"
                    >
                        Ver todos
                    </Link>
                )}
            </div>

            <SorteosList
                sorteos={activeSorteos as any}
                limit={isAllTab ? 4 : undefined}
                isSection={true}
                isAllTab={isAllTab}
            />
        </section>
    );
};
