'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Trophy, Calendar, Gift, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { WinnerRoulette } from '@/modules/sorteos/components/WinnerRoulette';
import { ShareButton } from '@/shared/components/molecules/ShareButton';

interface Sorteo {
    id: string;
    titulo: string;
    premio: string;
    fechaFin: string;
    estado: 'ACTIVO' | 'CERRADO';
    numGanadores: number;
    image?: string;
    externalUrl?: string;
    juegoId: string;
    juego?: { nombre: string };
    _count?: { participantes: number };
    ganadores?: {
        usuario?: { nombre: string },
        nombreManual?: string,
        emailManual?: string
    }[];
    tareas?: any[];
}

interface Participante {
    id: string;
    nombre?: string;
    email?: string;
    usuario?: { nombre: string; email: string };
    deviceId?: string;
    createdAt: string;
    entries?: number;
    tareas?: any[];
}

export default function SorteoPublicPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [sorteo, setSorteo] = useState<Sorteo | null>(null);
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRoulette, setShowRoulette] = useState(false);

    const fetchData = async () => {
        try {
            const [resSorteo, resParticipantes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${id}`, { credentials: 'include' }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${id}/participantes`, { credentials: 'include' })
            ]);
            if (!resSorteo.ok) throw new Error('Sorteo no encontrado');
            setSorteo(await resSorteo.json());
            if (resParticipantes.ok) {
                setParticipantes(await resParticipantes.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const isActive = sorteo?.estado === 'ACTIVO' && new Date(sorteo?.fechaFin || '') > new Date();
    const canDraw = sorteo?.estado === 'ACTIVO' && new Date(sorteo?.fechaFin || '') < new Date() && (sorteo?._count?.participantes || 0) > 0;

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
        </div>
    );

    if (!sorteo) return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 text-center">
            <Gift size={64} className="text-[var(--color-text)] opacity-10 mb-6" />
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4 italic uppercase">Sorteo no encontrado</h1>
            <Link href="/sorteos" className="text-[var(--color-primary)] font-bold hover:underline uppercase tracking-widest text-sm">Volver a sorteos</Link>
        </div>
    );

    const participantNames = participantes.map(p => p.usuario?.nombre || p.nombre || p.email || `Usuario ${p.id.slice(0, 6)}`);

    return (
        <div className="min-h-screen pt-20 pb-48 px-2 md:px-4 bg-transparent relative overflow-x-hidden transition-colors duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none opacity-50"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-8 px-2">
                    <Link href="/sorteos" className="flex items-center gap-2 text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-all text-[10px] font-black uppercase tracking-widest">
                        <ArrowLeft size={14} /> Volver
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-50">Sorteo</span>
                        <div className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="text-center space-y-2 mb-10 px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text)] italic uppercase tracking-tighter leading-tight">
                        {sorteo.titulo}
                    </h1>
                    <p className="text-[10px] md:text-xs text-[var(--color-text)]/30 font-black uppercase tracking-[0.3em]">
                        {sorteo.juego?.nombre || 'General'} • Premio: {sorteo.premio}
                    </p>
                    <div className="flex justify-center gap-6 mt-6 text-sm">
                        <span className="flex items-center gap-1">
                            <Users size={14} />
                            {sorteo._count?.participantes || 0} participantes
                        </span>
                        <span className="flex items-center gap-1">
                            <Trophy size={14} />
                            {sorteo.numGanadores} ganador{sorteo.numGanadores > 1 ? 'es' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Fin: {new Date(sorteo.fechaFin).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex justify-center mt-4">
                        <ShareButton
                            title={`Participa en: ${sorteo.titulo}`}
                            text={`🎁 Estoy participando en "${sorteo.titulo}" (${sorteo.premio}) en AJDREW. ¡Únete!`}
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            variant="minimal"
                        />
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-8">
                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        sorteo.estado === 'ACTIVO' && isActive
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse'
                            : sorteo.estado === 'CERRADO'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                        {sorteo.estado === 'ACTIVO' && isActive ? '⚡ ACTIVO' : sorteo.estado === 'CERRADO' ? '🔒 CERRADO' : '⏳ FINALIZADO'}
                    </span>
                </div>

                {/* External Link */}
                {sorteo.externalUrl && (
                    <div className="text-center mb-8">
                        <a href={sorteo.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all font-black text-sm uppercase tracking-widest">
                            <Zap size={16} /> Ver en {new URL(sorteo.externalUrl).hostname}
                        </a>
                    </div>
                )}

                {/* Participants List */}
                <div className="mb-12">
                    <h2 className="text-xl font-black text-[var(--color-text)] mb-6 uppercase tracking-tighter flex items-center justify-center gap-3">
                        <Users size={24} className="text-[var(--color-primary)]" />
                        Participantes ({participantes.length})
                    </h2>
                    {participantes.length === 0 ? (
                        <div className="text-center py-12 bg-black/20 border border-white/5 rounded-2xl text-white/40">
                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No hay participantes aún</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                            {participantes.slice(0, 100).map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center gap-3 hover:border-[var(--color-primary)]/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-black text-lg flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white truncate">
                                            {p.usuario?.nombre || p.nombre || p.email || `Usuario ${p.id.slice(0, 6)}`}
                                        </p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                                            {p.entries || 1} entrada{p.entries && p.entries > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {participantes.length > 100 && (
                                <div className="col-span-full text-center text-white/40 text-sm py-4">
                                    + {participantes.length - 100} participantes más
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Roulette Button */}
                {canDraw && (
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setShowRoulette(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Loader2 size={20} className="animate-spin" />
                            INICIAR RULETA DE GANADORES
                        </button>
                        <p className="mt-3 text-white/40 text-sm">El sorteo ha finalizado. Elige los {sorteo.numGanadores} ganador{sorteo.numGanadores > 1 ? 'es' : ''} con la ruleta.</p>
                    </div>
                )}

                {/* Winners Display */}
                {sorteo.ganadores && sorteo.ganadores.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-black text-[var(--color-text)] mb-6 uppercase tracking-tighter flex items-center justify-center gap-3">
                            <Trophy size={24} className="text-yellow-400" />
                            Ganadores
                        </h2>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {sorteo.ganadores.map((g, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: idx * 0.15, type: "spring", stiffness: 200 }}
                                    className="relative px-6 py-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl shadow-xl shadow-yellow-500/10 min-w-[200px] text-center"
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-black">
                                        {idx + 1}
                                    </div>
                                    <div className="text-yellow-400 font-bold text-lg pt-2">{g.usuario?.nombre || g.nombreManual}</div>
                                    <div className="text-white/40 text-xs mt-1">Ganador #{idx + 1}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Roulette Modal */}
                {showRoulette && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoulette(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-[var(--color-card)] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl max-h-[90vh]"
                        >
                            <WinnerRoulette
                                totalParticipants={sorteo._count?.participantes || 0}
                                numWinners={sorteo.numGanadores || 1}
                                participantNames={participantNames}
                                onComplete={async (winners) => {
                                    try {
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${sorteo.id}/elegir-ganadores`, {
                                            method: 'POST',
                                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                        });
                                        if (response.ok) {
                                            Swal.fire('¡Éxito!', 'Los ganadores han sido seleccionados.', 'success');
                                            fetchData();
                                        }
                                    } catch (error) {
                                        Swal.fire('Error', 'No se pudo realizar el sorteo.', 'error');
                                    }
                                    setShowRoulette(false);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}