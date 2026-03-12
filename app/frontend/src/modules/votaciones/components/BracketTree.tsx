'use client';

import React from 'react';
import Image from 'next/image';
import { Trophy, Crown, Star, Target } from 'lucide-react';

interface Item {
    id: string;
    nombre: string;
    image?: string;
}

interface Match {
    id: string;
    ronda: number;
    itemAId: string | null;
    itemBId: string | null;
    votosA: number;
    votosB: number;
    itemA: Item | null;
    itemB: Item | null;
    ganadorId?: string | null;
}

interface BracketTreeProps {
    matches: Match[];
    currentRound: number;
    estado: string;
}

export const BracketTree: React.FC<BracketTreeProps> = ({ matches, currentRound, estado }) => {
    // Determine total participants from Round 1
    const round1Matches = matches.filter(m => m.ronda === 1);
    const totalParticipants = round1Matches.length * 2;
    const totalRounds = totalParticipants <= 1 ? 1 : Math.ceil(Math.log2(totalParticipants));

    // Group matches and ensure full tournament structure (placeholders)
    const getRoundsData = () => {
        const rounds = [];
        for (let r = 1; r <= totalRounds; r++) {
            const roundMatches = matches.filter(m => m.ronda === r);
            const expectedCount = Math.pow(2, totalRounds - r);
            const padded: (Match | null)[] = [...roundMatches];
            while (padded.length < expectedCount) {
                padded.push(null);
            }
            rounds.push(padded);
        }
        return rounds;
    };

    const roundsData = getRoundsData();

    // Determine Final Winner
    const finalMatch = roundsData[totalRounds - 1]?.[0];
    let finalWinner: Item | null = null;
    if (estado === 'FINALIZADA' && finalMatch) {
        if (finalMatch.votosA > finalMatch.votosB) finalWinner = finalMatch.itemA;
        else if (finalMatch.votosB > finalMatch.votosA) finalWinner = finalMatch.itemB;
        else if (finalMatch.votosA >= finalMatch.votosB) finalWinner = finalMatch.itemA;
    }

    const MATCH_HEIGHT = 100;
    const GUTTER_WIDTH = 40;
    const HEADER_HEIGHT = 60;
    const FINAL_EXTRA_GAP = 80;

    const renderMatchCard = (match: Match | null, isPlaceholder: boolean) => {
        const winnerA = match ? (match.votosA > match.votosB || (match.votosA === match.votosB && match.votosA > 0)) : false;
        const winnerB = match ? (match.votosB > match.votosA) : false;
        const isLive = match && match.ronda === currentRound && estado === 'ACTIVA';

        return (
            <div className={`
                flex flex-col gap-1 w-40 md:w-44 transition-all duration-700 relative group
                ${isPlaceholder ? 'opacity-30' : 'opacity-100'}
                [--card-half-width:80px] md:[--card-half-width:88px]
            `}>
                {isLive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest rounded-full animate-pulse z-10 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        LIVE
                    </div>
                )}

                <div className={`
                    bg-white/5 dark:bg-black/60 backdrop-blur-3xl border rounded-2xl overflow-hidden p-1.5
                    ${match && finalWinner && (match.itemA?.id === finalWinner.id || match.itemB?.id === finalWinner.id) && estado === 'FINALIZADA'
                        ? 'border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.2)]'
                        : isPlaceholder ? 'border-dashed border-black/5 dark:border-white/5' : 'border-black/5 dark:border-white/10 group-hover:border-[var(--color-primary, #22c55e)]/40 shadow-xl'}
                    transition-all duration-500
                `}>
                    {/* Item A */}
                    <div className={`flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-500 ${winnerA
                        ? 'bg-[var(--color-primary, #22c55e)] text-white font-black'
                        : 'text-white/90'
                        }`}>
                        <div className={`relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border ${winnerA ? 'border-black/20' : 'border-black/5 dark:border-white/10 bg-black/20'}`}>
                            {match?.itemA?.image && <Image src={match.itemA.image} alt="" fill className="object-cover" />}
                        </div>
                        <span className="text-[9px] uppercase truncate flex-1 tracking-tight font-black leading-none">
                            {match?.itemA?.nombre || 'TBD'}
                        </span>
                        {match && <span className={`text-[9px] font-black ${winnerA ? 'text-white' : 'opacity-40'}`}>{match.votosA}</span>}
                    </div>

                    <div className="h-1 flex items-center justify-center opacity-10">
                        <div className="w-full h-[1px] bg-[var(--color-text)]"></div>
                    </div>

                    {/* Item B */}
                    <div className={`flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-500 ${winnerB
                        ? 'bg-[var(--color-primary, #22c55e)] text-white font-black'
                        : 'text-white/90'
                        }`}>
                        <div className={`relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border ${winnerB ? 'border-black/20' : 'border-black/5 dark:border-white/10 bg-black/20'}`}>
                            {match?.itemB?.image && <Image src={match.itemB.image} alt="" fill className="object-cover" />}
                        </div>
                        <span className="text-[9px] uppercase truncate flex-1 tracking-tight font-black leading-none">
                            {match?.itemB?.nombre || 'TBD'}
                        </span>
                        {match && <span className={`text-[9px] font-black ${winnerB ? 'text-white' : 'opacity-40'}`}>{match.votosB}</span>}
                    </div>
                </div>
            </div>
        );
    };

    const renderColumn = (side: 'left' | 'right' | 'center', roundIdx: number) => {
        const roundMatches = roundsData[roundIdx];
        if (!roundMatches) return null;

        let sideMatches: (Match | null)[] = [];
        if (side === 'center') {
            sideMatches = [roundMatches[0]];
        } else {
            const half = roundMatches.length / 2;
            sideMatches = side === 'left' ? roundMatches.slice(0, half) : roundMatches.slice(half);
        }

        if (sideMatches.length === 0) return null;

        const baseMatchHeight = MATCH_HEIGHT;
        const currentRoundStep = Math.pow(2, roundIdx);
        const containerStepHeight = baseMatchHeight * currentRoundStep;

        // Dynamic labels based on match count
        const matchCount = roundMatches.length;
        let label = `Fase ${roundIdx + 1}`;
        if (matchCount === 1) label = 'Gran Final';
        else if (matchCount === 2) label = 'Semifinales';
        else if (matchCount === 4) label = 'Cuartos';
        else if (matchCount === 8) label = 'Octavos';

        return (
            <div className={`flex flex-col ${side === 'right' ? 'items-end' : (side === 'left' ? 'items-start' : 'items-center')}`}>
                <div className="text-center flex items-center justify-center p-0 mb-8" style={{ height: HEADER_HEIGHT }}>
                    <div className="flex flex-col items-center gap-1 group/header transition-all duration-500 px-4">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-black/5 dark:bg-white/5 px-4 md:px-5 py-2 rounded-full border border-black/5 dark:border-white/5 transition-all
                            ${side === 'center' ? 'text-yellow-400 border-yellow-400/30 shadow-2xl shadow-yellow-400/20' : 'text-[var(--color-text)]/40'}`}>
                            {label}
                        </span>
                        {side === 'center' && (
                            <Star size={10} className="text-yellow-400 animate-spin-slow fill-yellow-400" />
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center" style={{ height: roundsData[0].length * (MATCH_HEIGHT / 2) }}>
                    {sideMatches.map((m, mIdx) => {
                        const isLastRoundOfWing = roundIdx === totalRounds - 2;
                        const connectorWidth = isLastRoundOfWing ? FINAL_EXTRA_GAP : GUTTER_WIDTH;
                        const lineColor = m ? 'var(--color-primary, #22c55e)' : 'rgba(128,128,128,0.4)';
                        const lineOpacity = m ? 0.8 : 0.2;

                        return (
                            <div
                                key={`${side}-${roundIdx}-${mIdx}`}
                                className="relative w-full flex items-center justify-center"
                                style={{ height: containerStepHeight }}
                            >
                                <div className={`relative flex items-center h-full w-full justify-center ${side === 'left' ? 'flex-row' : (side === 'right' ? 'flex-row-reverse' : '')}`}>
                                    {/* The Card wrapper is absolutely centered in the h-full container */}
                                    <div className="relative flex items-center justify-center z-10">
                                        {renderMatchCard(m, !m)}
                                    </div>

                                    {side !== 'center' && roundIdx < totalRounds - 1 && (
                                        <div
                                            className={`absolute pointer-events-none top-0 bottom-0 ${side === 'left' ? 'left-full' : 'right-full'}`}
                                            style={{
                                                width: connectorWidth,
                                                [side === 'left' ? 'left' : 'right']: '50%',
                                                [side === 'left' ? 'marginLeft' : 'marginRight']: 'var(--card-half-width, 88px)',
                                            }}
                                        >
                                            <svg className="w-full h-full overflow-visible">
                                                {isLastRoundOfWing ? (
                                                    <line
                                                        x1={side === 'left' ? "0" : "100%"}
                                                        y1="50%"
                                                        x2={side === 'left' ? "100%" : "0"}
                                                        y2="50%"
                                                        stroke={lineColor}
                                                        strokeWidth="3"
                                                        style={{ opacity: lineOpacity }}
                                                        strokeDasharray={!m ? "4,4" : "0"}
                                                    />
                                                ) : (
                                                    <path
                                                        d={side === 'left'
                                                            ? (mIdx % 2 === 0
                                                                ? `M 0 50% L ${connectorWidth / 2} 50% L ${connectorWidth / 2} 100% L ${connectorWidth} 100%`
                                                                : `M 0 50% L ${connectorWidth / 2} 50% L ${connectorWidth / 2} 0% L ${connectorWidth} 0%`)
                                                            : (mIdx % 2 === 0
                                                                ? `M ${connectorWidth} 50% L ${connectorWidth / 2} 50% L ${connectorWidth / 2} 100% L 0 100%`
                                                                : `M ${connectorWidth} 50% L ${connectorWidth / 2} 50% L ${connectorWidth / 2} 0% L 0 0%`)
                                                        }
                                                        stroke={lineColor}
                                                        strokeWidth="2.5"
                                                        fill="none"
                                                        style={{ opacity: lineOpacity }}
                                                        strokeDasharray={!m ? "4,4" : "0"}
                                                    />
                                                )}
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col items-center select-none overflow-y-visible pb-32">
            {/* Legend / Info Bar */}
            <div className="mt-2 mb-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 bg-black/5 dark:bg-white/5 backdrop-blur-3xl px-6 md:px-8 py-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-1000 mx-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary, #22c55e)] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[9px] font-black text-[var(--color-text)] uppercase tracking-widest opacity-60">En Curso</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    <span className="text-[9px] font-black text-[var(--color-text)] uppercase tracking-widest opacity-60">Campeón</span>
                </div>
                <div className="hidden lg:flex items-center gap-3 border-l border-black/10 dark:border-white/10 pl-8 ml-2 italic">
                    <Target size={12} className="text-[var(--color-text)] opacity-30" />
                    <span className="text-[9px] font-black text-[var(--color-text)] uppercase tracking-widest opacity-30 line-clamp-1">Navega lateralmente para ver el árbol completo</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-64 no-scrollbar cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-center gap-0 min-w-max px-32 md:px-64 pt-56 md:pt-72 pb-20">

                    {/* LEFT WING */}
                    {totalRounds > 1 && (
                        <div className="flex items-start">
                            {roundsData.slice(0, -1).map((_, rIdx) => (
                                <React.Fragment key={`left-r-${rIdx}`}>
                                    {renderColumn('left', rIdx)}
                                    <div style={{ width: GUTTER_WIDTH }}></div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* CENTRAL FINAL AREA */}
                    <div className="px-16 md:px-24 relative z-20">
                        {finalWinner && estado === 'FINALIZADA' && (
                            <div className="absolute -top-40 md:-top-56 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="relative mb-4 group/champion">
                                    <div className="absolute -inset-4 bg-yellow-400/10 blur-xl rounded-full"></div>
                                    <Crown size={48} className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400/80 drop-shadow-md z-10" fill="currentColor" />
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] overflow-hidden border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/10">
                                        {finalWinner.image && <Image src={finalWinner.image} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-lg whitespace-nowrap z-20">
                                        CAMPEÓN
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-yellow-400 uppercase tracking-tighter italic text-center drop-shadow-md opacity-90">
                                    {finalWinner.nombre}
                                </h3>
                            </div>
                        )}
                        {renderColumn('center', totalRounds - 1)}
                    </div>

                    {/* RIGHT WING */}
                    {totalRounds > 1 && (
                        <div className="flex items-start flex-row-reverse">
                            {roundsData.slice(0, -1).map((_, rIdx) => (
                                <React.Fragment key={`right-r-${rIdx}`}>
                                    {renderColumn('right', rIdx)}
                                    <div style={{ width: GUTTER_WIDTH }}></div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
