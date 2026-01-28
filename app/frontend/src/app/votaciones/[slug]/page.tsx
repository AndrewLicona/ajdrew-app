'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Vote, Trophy, ArrowLeft, Zap, Star, LayoutGrid, GitMerge, Activity, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { getOrCreateDeviceId } from '@/modules/calificaciones/services/calificacionesService';
import { BracketTree } from '@/modules/votaciones/components/BracketTree';

interface Item {
    id: string;
    nombre: string;
    image?: string;
}

interface Match {
    id: string;
    ronda: number;
    itemAId: string;
    itemBId: string | null;
    votosA: number;
    votosB: number;
    itemA: Item;
    itemB: Item | null;
    userVoteItemId?: string | null;
}

interface Bracket {
    id: string;
    tematica: string;
    slug: string;
    estado: string;
    rondaActual: number;
    juego?: { nombre: string, image: string };
    matches: Match[];
    proximoCierreAt?: string;
}

export default function BracketViewPage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const [bracket, setBracket] = useState<Bracket | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'vote' | 'tree'>('vote');
    const [selectedRound, setSelectedRound] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const deviceId = getOrCreateDeviceId();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${slug}`, {
                headers: {
                    'x-device-id': deviceId
                }
            });
            if (!res.ok) throw new Error('Bracket no encontrado');
            const data = await res.json();
            setBracket(data);
            if (selectedRound === null) {
                setSelectedRound(data.rondaActual);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    const handleVote = async (matchId: string, itemId: string) => {
        try {
            const deviceId = getOrCreateDeviceId();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-device-id': deviceId
                },
                body: JSON.stringify({ matchId, itemId }),
            });

            if (response.ok) {
                fetchData();
                Swal.fire({
                    title: '¡Voto registrado!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1a1a1a',
                    color: '#ffffff',
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Aviso',
                    text: errorData.message || 'No se pudo registrar el voto',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    confirmButtonColor: '#22c55e'
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!bracket) return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 text-center">
            <Vote size={64} className="text-[var(--color-text)] opacity-10 mb-6" />
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4 italic uppercase">Torneo no encontrado</h1>
            <Link href="/votaciones" className="text-[var(--color-primary)] font-bold hover:underline uppercase tracking-widest text-sm">Volver al listado</Link>
        </div>
    );

    const maxRound = Math.max(...bracket.matches.map(m => m.ronda));

    return (
        <div className="min-h-screen pt-20 pb-48 px-2 md:px-4 bg-transparent relative overflow-x-hidden transition-colors duration-500">
            {/* Minimalist Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none opacity-50"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Slim Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <Link href="/votaciones" className="flex items-center gap-2 text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-all text-[10px] font-black uppercase tracking-widest">
                        <ArrowLeft size={14} /> Volver
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-50">Arena</span>
                        <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="text-center space-y-2 mb-10 px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text)] italic uppercase tracking-tighter leading-tight">
                        {bracket.tematica}
                    </h1>
                    <p className="text-[10px] md:text-xs text-[var(--color-text)]/30 font-black uppercase tracking-[0.3em]">
                        {bracket.juego?.nombre || 'General'} • {bracket.estado}
                    </p>
                </div>

                {/* Segmented Navigation Phases & View Toggle */}
                <div className="flex flex-col items-center gap-6 mb-12 px-2">
                    {/* View Toggle */}
                    <div className="bg-black/5 dark:bg-black/40 backdrop-blur-3xl p-1 rounded-[2rem] flex items-center border border-black/5 dark:border-white/5 shadow-xl">
                        <button
                            onClick={() => setViewMode('vote')}
                            className={`flex items-center gap-2 py-2 px-6 rounded-[1.8rem] transition-all duration-300 text-[10px] font-black uppercase tracking-widest
                                ${viewMode === 'vote' ? 'bg-[var(--color-primary)] text-black shadow-lg' : 'text-[var(--color-text)]/40 hover:text-[var(--color-text)]'}`}
                        >
                            <LayoutGrid size={14} /> Arena
                        </button>
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`flex items-center gap-2 py-2 px-6 rounded-[1.8rem] transition-all duration-300 text-[10px] font-black uppercase tracking-widest
                                ${viewMode === 'tree' ? 'bg-[var(--color-primary)] text-black shadow-lg' : 'text-[var(--color-text)]/40 hover:text-[var(--color-text)]'}`}
                        >
                            <GitMerge size={14} /> Bracket
                        </button>
                    </div>

                    {/* Phases Selector (Only in Arena mode) */}
                    {viewMode === 'vote' && (
                        <div className="bg-black/5 dark:bg-black/40 backdrop-blur-3xl p-1 md:p-1.5 rounded-[2.5rem] flex items-center border border-black/5 dark:border-white/5 shadow-2xl overflow-x-auto no-scrollbar max-w-full w-fit">
                            <div className="flex items-center gap-1 md:gap-2 px-1">
                                {Array.from({ length: maxRound }, (_, i) => i + 1).map((r) => {
                                    const isActive = selectedRound === r;
                                    const isLive = r === bracket.rondaActual && bracket.estado === 'ACTIVA';
                                    const matchCount = bracket.matches.filter(m => m.ronda === r).length;

                                    let label = `F ${r}`;
                                    if (matchCount === 1) label = 'Final';
                                    else if (matchCount === 2) label = 'Semi';
                                    else if (matchCount === 4) label = 'Cuartos';
                                    else if (matchCount === 8) label = 'Octavos';

                                    return (
                                        <button
                                            key={r}
                                            onClick={() => setSelectedRound(r)}
                                            className={`flex flex-col items-center justify-center min-w-[60px] md:min-w-[110px] py-1.5 md:py-3 px-2 md:px-4 rounded-[2rem] transition-all duration-500 relative group
                                                ${isActive ? 'bg-[var(--color-primary)] text-black' : 'text-[var(--color-text)]/40 hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                                        >
                                            <div className="mb-0.5 md:mb-1">
                                                {matchCount === 1 ? <Trophy size={12} className="md:w-[14px] md:h-[14px]" /> : <Target size={12} className="md:w-[14px] md:h-[14px]" />}
                                            </div>
                                            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                                                {label}
                                            </span>
                                            {isLive && !isActive && (
                                                <div className="absolute top-1 right-2 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                {viewMode === 'vote' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 px-1 md:px-0">
                        {(bracket.matches || []).filter(m => m.ronda === selectedRound).map((match, idx) => {
                            const isRoundClosed = selectedRound !== bracket.rondaActual || bracket.estado !== 'ACTIVA';

                            return (
                                <div key={match.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700 w-full md:max-w-md lg:max-w-full mx-auto" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="bg-black/5 dark:bg-[#0c0c0c] border border-black/5 dark:border-white/5 rounded-2xl md:rounded-[2.5rem] p-2 md:p-4 lg:p-5 overflow-hidden hover:border-[var(--color-primary)]/30 transition-all shadow-2xl group/card relative h-full flex flex-col justify-center">

                                        {/* Row Layout: A vs B */}
                                        <div className="flex items-center justify-between gap-1 md:gap-4 lg:gap-6 relative z-10 w-full">

                                            {/* Item A */}
                                            <button
                                                disabled={isRoundClosed}
                                                onClick={() => handleVote(match.id, match.itemAId)}
                                                className={`flex-1 min-w-0 flex flex-col items-center gap-2 group/item transition-all ${isRoundClosed ? 'cursor-default' : 'hover:scale-105 active:scale-95'}`}
                                            >
                                                <div className="relative w-full aspect-square rounded-xl md:rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 bg-black/40 group-hover/item:border-[var(--color-primary)] transition-all">
                                                    <Image src={match.itemA?.image || '/placeholder.png'} alt="" fill className="object-contain transition-transform duration-700 group-hover/item:scale-105" />
                                                    {match.votosA > match.votosB && (
                                                        <div className="absolute top-1 right-1 md:top-2 md:right-2 p-1 bg-yellow-400 text-black rounded-lg border border-black/5 shadow-xl">
                                                            <Trophy size={10} className="md:w-3 md:h-3" fill="black" />
                                                        </div>
                                                    )}
                                                    {match.userVoteItemId === match.itemAId && (
                                                        <div className="absolute bottom-0 inset-x-0 py-1 md:py-1.5 bg-[var(--color-primary)] text-black font-black uppercase tracking-[0.2em] animate-in slide-in-from-bottom-2 text-[7px] md:text-[9px] text-center shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">VOTADO</div>
                                                    )}
                                                </div>
                                                <div className="text-center w-full px-1 min-h-[4rem] flex flex-col justify-start">
                                                    <h4 className="text-[11px] md:text-sm lg:text-base font-black text-[var(--color-text)] italic line-clamp-2 w-full uppercase tracking-tighter group-hover/item:text-[var(--color-primary)] transition-colors leading-tight">
                                                        {match.itemA?.nombre}
                                                    </h4>
                                                    <span className="text-[10px] md:text-sm font-black text-[var(--color-primary)] opacity-80 tracking-widest mt-1 bg-[var(--color-primary)]/5 rounded-lg px-2 py-0.5 w-fit mx-auto border border-[var(--color-primary)]/10">{match.votosA} VOTOS</span>
                                                </div>
                                            </button>

                                            {/* Minimalist VS Section */}
                                            <div className="flex flex-col items-center justify-center shrink-0">
                                                <div className="w-[1px] h-4 md:h-10 bg-gradient-to-b from-transparent via-[var(--color-text)]/10 to-transparent"></div>
                                                <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center bg-black/5 dark:bg-[#0a0a0a] rounded-lg md:rounded-xl border border-black/10 dark:border-white/10 rotate-45 group-hover:border-[var(--color-primary)]/40 group-hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] transition-all duration-500">
                                                    <span className="text-[8px] md:text-sm font-black text-[var(--color-text)] -rotate-45 drop-shadow-xl">VS</span>
                                                </div>
                                                <div className="w-[1px] h-4 md:h-10 bg-gradient-to-t from-transparent via-[var(--color-text)]/10 to-transparent"></div>
                                            </div>

                                            {/* Item B */}
                                            {match.itemBId ? (
                                                <button
                                                    disabled={isRoundClosed}
                                                    onClick={() => handleVote(match.id, match.itemBId!)}
                                                    className={`flex-1 min-w-0 flex flex-col items-center gap-2 group/item transition-all ${isRoundClosed ? 'cursor-default' : 'hover:scale-105 active:scale-95'}`}
                                                >
                                                    <div className="relative w-full aspect-square rounded-xl md:rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 bg-black/40 group-hover/item:border-[var(--color-primary)] transition-all">
                                                        <Image src={match.itemB?.image || '/placeholder.png'} alt="" fill className="object-contain transition-transform duration-700 group-hover/item:scale-105" />
                                                        {match.votosB > match.votosA && (
                                                            <div className="absolute top-1 right-1 md:top-2 md:right-2 p-1 bg-yellow-400 text-black rounded-lg border border-black/5 shadow-xl">
                                                                <Trophy size={10} className="md:w-3 md:h-3" fill="black" />
                                                            </div>
                                                        )}
                                                        {match.userVoteItemId === match.itemBId && (
                                                            <div className="absolute bottom-0 inset-x-0 py-1 md:py-1.5 bg-[var(--color-primary)] text-black font-black uppercase tracking-[0.2em] animate-in slide-in-from-bottom-2 text-[7px] md:text-[9px] text-center shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">VOTADO</div>
                                                        )}
                                                    </div>
                                                    <div className="text-center w-full px-1 min-h-[4rem] flex flex-col justify-start">
                                                        <h4 className="text-[11px] md:text-sm lg:text-base font-black text-[var(--color-text)] italic line-clamp-2 w-full uppercase tracking-tighter group-hover/item:text-[var(--color-primary)] transition-colors leading-tight">
                                                            {match.itemB?.nombre}
                                                        </h4>
                                                        <span className="text-[10px] md:text-sm font-black text-[var(--color-primary)] opacity-80 tracking-widest mt-1 bg-[var(--color-primary)]/5 rounded-lg px-2 py-0.5 w-fit mx-auto border border-[var(--color-primary)]/10">{match.votosB} VOTOS</span>
                                                    </div>
                                                </button>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center gap-3 opacity-20 filter grayscale">
                                                    <div className="w-full aspect-[2/3] rounded-xl md:rounded-[2rem] border-2 md:border-3 border-dashed border-white/5 bg-black/20 flex flex-col items-center justify-center gap-4">
                                                        <Zap size={18} className="text-white/20 animate-pulse" />
                                                        <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.4em]">BYE</span>
                                                    </div>
                                                    <div className="h-10"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Tag */}
                                        {isRoundClosed && (
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 bg-black/10 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                                                <span className="text-[7px] md:text-[9px] font-black text-[var(--color-text)]/40 uppercase tracking-[0.2em]">Cerrado</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-700 px-2">
                        <BracketTree matches={bracket.matches} currentRound={bracket.rondaActual} estado={bracket.estado} />
                    </div>
                )}
            </div>
        </div>
    );
}
