import React, { useState } from 'react';
import { JuegoHero } from './JuegoHero';
import { JuegoTabs, TabId } from './JuegoTabs';
import { SorteosList } from './SorteosList';
import { RankingCategoryCard } from './RankingCategoryCard';
import { BracketCategoryCard } from './BracketCategoryCard';
import { Juego } from '../types/juego';
import { Trophy, Vote, Star, Target, Sparkles, Gift, Clock, ChevronRight } from 'lucide-react';
import { BracketsSection } from './sections/BracketsSection';
import { RankingsSection } from './sections/RankingsSection';
import { TutorialsSection } from './sections/TutorialsSection';
import { SorteosSection } from './sections/SorteosSection';

interface JuegoHubProps {
    juego: Juego;
}

export const JuegoHub: React.FC<JuegoHubProps> = ({ juego }) => {
    const [activeTab, setActiveTab] = useState<TabId>('all');

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <JuegoHero juego={juego} />

            <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10 space-y-12 pb-40">
                <JuegoTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Dynamic Section Title */}
                <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter text-center">
                        {activeTab === 'all' ? 'TODOS' :
                            activeTab === 'ranking' ? 'RANKINGS' :
                                activeTab === 'bracket' ? 'BRACKETS' :
                                    activeTab === 'tutorial' ? 'TUTORIALES' :
                                        activeTab === 'sorteo' ? 'SORTEOS' : ''}
                    </h2>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                {/* Modular Content Sections */}
                <div className="space-y-20">
                    {/* Sorteos Section - Move inside modular flow */}
                    {(activeTab === 'all' || activeTab === 'sorteo') && (
                        <SorteosSection juego={juego} activeTab={activeTab} />
                    )}

                    {activeTab !== 'sorteo' && (
                        <>
                            {/* Brackets / Votaciones Section */}
                            {(activeTab === 'all' || activeTab === 'bracket') && (
                                <BracketsSection juego={juego} activeTab={activeTab} />
                            )}

                            {/* Tutorials Section */}
                            {(activeTab === 'all' || activeTab === 'tutorial') && (
                                <TutorialsSection juego={juego} activeTab={activeTab} />
                            )}

                            {/* Rankings Section */}
                            {(activeTab === 'all' || activeTab === 'ranking') && (
                                <RankingsSection juego={juego} activeTab={activeTab} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
