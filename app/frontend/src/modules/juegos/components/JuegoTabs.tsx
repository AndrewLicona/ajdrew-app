import React from 'react';
import { LayoutGrid, Trophy, Vote, Target, Gift } from 'lucide-react';

export type TabId = 'all' | 'ranking' | 'bracket' | 'tutorial' | 'sorteo';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
}

interface JuegoTabsProps {
    activeTab: string;
    setActiveTab: (tabId: TabId) => void;
}

const TABS: Tab[] = [
    { id: 'all', label: 'TODAS', icon: LayoutGrid },
    { id: 'ranking', label: 'RANKINGS', icon: Trophy },
    { id: 'bracket', label: 'BRACKETS', icon: Vote },
    { id: 'tutorial', label: 'TUTOS', icon: Target },
    { id: 'sorteo', label: 'SORTEOS', icon: Gift },
];

export const JuegoTabs: React.FC<JuegoTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-full mb-8">
            <div className="max-w-4xl mx-auto px-2">
                <div className="grid grid-cols-5 bg-black/40 backdrop-blur-md p-1 rounded-[1.5rem] sm:rounded-full border border-white/10 shadow-2xl">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-2.5 sm:py-3 px-1 sm:px-6 rounded-2xl sm:rounded-full transition-all duration-300 ${isActive
                                        ? 'bg-[var(--color-primary)] text-black shadow-lg shadow-[var(--color-primary)]/20 scale-[1.02]'
                                        : 'text-white/30 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} strokeWidth={isActive ? 3 : 2} className="sm:w-4 sm:h-4" />
                                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
