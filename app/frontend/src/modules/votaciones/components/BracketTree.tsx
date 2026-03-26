'use client';

import React from 'react';
import Image from 'next/image';
import { Crown, Star, Target, Users } from 'lucide-react';

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

    const MATCH_HEIGHT = 320; 
    const GUTTER_WIDTH = 100;
    const HEADER_HEIGHT = 60;
    const FINAL_EXTRA_GAP = 100;

    const renderMatchCard = (match: Match | null, isPlaceholder: boolean, side: 'left' | 'right' | 'center') => {
        const winnerA = match ? (match.votosA > match.votosB || (match.votosA === match.votosB && match.votosA > 0)) : false;
        const winnerB = match ? (match.votosB > match.votosA) : false;
        const isLive = match && match.ronda === currentRound && estado === 'ACTIVA';

        const renderItem = (item: Item | null, votos: number, winner: boolean) => (
            <div className={`
                flex flex-col items-center p-1.5 rounded-xl w-full z-10 relative overflow-hidden transition-all duration-300
                ${winner 
                    ? 'bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                    : 'bg-[#0a0a0a]/90 border border-white/10 shadow-lg'}
                ${!item ? 'border-dashed opacity-40' : 'hover:scale-105'}
                min-h-[120px]
            `}>
                {/* Image - Square container with contain to avoid any cutting */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-inner group-hover:scale-105 transition-transform duration-700">
                    {item?.image ? (
                        <Image src={item.image} alt="" fill className="object-contain" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-xl italic uppercase">
                             ?
                        </div>
                    )}
                </div>

                {/* Votes - Rating style */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/50 border border-white/5 mt-auto w-full justify-center">
                    <div className="flex items-center gap-1">
                        <Users size={12} className={winner ? 'text-[var(--color-primary)]' : 'text-white/30'} />
                        <span className={`text-[11px] font-black ${winner ? 'text-[var(--color-primary)]' : 'text-white'}`}>
                            {votos}
                        </span>
                    </div>
                </div>

                {/* Winner Badge */}
                {winner && (
                    <div className="absolute top-2 right-2 rotate-12">
                        <Star size={14} className="text-yellow-400 fill-yellow-400 animate-pulse drop-shadow-glow" />
                    </div>
                )}
            </div>
        );

        if (side === 'center') {
            return (
                <div className={`
                    flex flex-row items-center justify-center gap-10 md:gap-16 w-auto h-full transition-all duration-1000 relative
                    ${isPlaceholder ? 'opacity-30' : 'opacity-100'}
                `}>
                    {/* Team A Finalist */}
                    <div className="w-32 md:w-44">
                        {renderItem(match?.itemA || null, match?.votosA || 0, winnerA)}
                    </div>

                    {/* VS centered in final - Large and Epic */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                         <div className="flex flex-col items-center gap-2">
                             <div className="px-4 py-1.5 bg-[var(--color-primary)] text-black font-black italic text-lg md:text-xl skew-x-[-15deg] shadow-[0_0_20px_rgba(34,197,94,0.5)] border-2 border-black">
                                VS
                             </div>
                         </div>
                    </div>

                    {/* Team B Finalist */}
                    <div className="w-32 md:w-44">
                        {renderItem(match?.itemB || null, match?.votosB || 0, winnerB)}
                    </div>
                </div>
            );
        }

        return (
            <div className={`
                flex flex-col justify-between w-32 md:w-40 h-[300px] transition-all duration-700 relative group
                ${isPlaceholder ? 'opacity-30' : 'opacity-100'}
                [--card-half-width:64px] md:[--card-half-width:80px]
            `}>
                {isLive && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full animate-pulse z-20 shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-red-400">
                        LIVE NOW
                    </div>
                )}

                {/* Connector lines inside the match - with Subtle Glow */}
                {!isPlaceholder && (
                    <div className={`absolute top-[70px] bottom-[70px] w-1/2 border-t-2 border-b-2 border-[var(--color-primary)]/20 z-0
                        ${side === 'left' ? 'right-0 border-r-2 rounded-r-xl shadow-[2px_0_10px_rgba(34,197,94,0.2)]' : 'left-0 border-l-2 rounded-l-xl shadow-[-2px_0_10px_rgba(34,197,94,0.2)]'}
                        group-hover:border-[var(--color-primary)]/60 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-500
                    `}></div>
                )}

                {/* Team A */}
                {renderItem(match?.itemA || null, match?.votosA || 0, winnerA)}

                {/* Team B */}
                {renderItem(match?.itemB || null, match?.votosB || 0, winnerB)}
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
                                    <div className="relative flex items-center justify-center z-10 w-full h-full">
                                        {renderMatchCard(m, !m, side)}
                                    </div>

                                    {side !== 'center' && roundIdx < totalRounds - 1 && (
                                        <div
                                            className={`absolute pointer-events-none top-0 bottom-0 ${side === 'left' ? 'left-full' : 'right-full'}`}
                                            style={{
                                                width: isLastRoundOfWing ? 200 : (totalRounds - 1 - roundIdx) * GUTTER_WIDTH,
                                                [side === 'left' ? 'left' : 'right']: '50%',
                                                [side === 'left' ? 'marginLeft' : 'marginRight']: 'var(--card-half-width, 80px)',
                                            }}
                                        >
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <defs>
                                                    <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur" />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>
                                                {isLastRoundOfWing ? (
                                                    <line
                                                        x1={side === 'left' ? "0" : "100"}
                                                        y1="50"
                                                        x2={side === 'left' ? "100" : "0"}
                                                        y2="50"
                                                        stroke={lineColor}
                                                        strokeWidth="2"
                                                        style={{ opacity: lineOpacity, filter: m ? 'url(#glow-line)' : 'none' }}
                                                        strokeDasharray={!m ? "4,4" : "0"}
                                                    />
                                                ) : (
                                                    <path
                                                        d={side === 'left'
                                                            ? (mIdx % 2 === 0
                                                                ? `M 0 50 C 40 50, 60 50, 60 75 L 60 75 C 60 100, 80 100, 100 100`
                                                                : `M 0 50 C 40 50, 60 50, 60 25 L 60 25 C 60 0, 80 0, 100 0`)
                                                            : (mIdx % 2 === 0
                                                                ? `M 100 50 C 60 50, 40 50, 40 75 L 40 75 C 40 100, 20 100, 0 100`
                                                                : `M 100 50 C 60 50, 40 50, 40 25 L 40 25 C 40 0, 20 0, 0 0`)
                                                        }
                                                        stroke={lineColor}
                                                        strokeWidth="2"
                                                        fill="none"
                                                        style={{ opacity: lineOpacity, filter: m ? 'url(#glow-line)' : 'none' }}
                                                        strokeDasharray={!m ? "4,4" : "0"}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
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

            <div className="w-full overflow-x-auto pb-44 custom-scrollbar cursor-grab active:cursor-grabbing">
                <div className="flex items-center justify-center gap-0 min-w-max px-20 md:px-44 pt-64 md:pt-96 pb-20">

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
                    <div className="px-10 md:px-16 relative z-20">
                        {finalWinner && estado === 'FINALIZADA' && (
                            <div className="absolute -top-64 md:-top-80 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="relative mb-4 group/champion">
                                    <div className="absolute -inset-8 bg-yellow-400/20 blur-2xl rounded-full mix-blend-screen"></div>
                                    <Crown size={64} className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-500 drop-shadow-xl z-20" fill="currentColor" />
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] bg-black">
                                        {finalWinner.image && <Image src={finalWinner.image} alt="" fill className="object-cover" />}
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-black text-[10px] md:text-xs font-black uppercase tracking-[0.5em] rounded-full shadow-2xl whitespace-nowrap z-20">
                                        CAMPEÓN
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-black/40 px-4 py-1 rounded-xl mt-2">
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
