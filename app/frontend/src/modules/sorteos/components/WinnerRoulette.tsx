'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, User, Users, Loader2, CheckCircle } from 'lucide-react';
import { Bt } from '@/shared/components/atoms/Button';

interface WinnerRouletteProps {
    /** Total de participantes */
    totalParticipants: number;
    /** Número de ganadores a elegir */
    numWinners: number;
    /** Callback cuando termina la animación */
    onComplete: (winners: { index: number; name: string }[]) => void;
    /** Nombres de participantes (para mostrar en la ruleta) */
    participantNames?: string[];
    /** Si está en modo manual (admin elige) */
    isManual?: boolean;
    /** Ganadores ya seleccionados en modo manual */
    manualWinners?: { nombreManual: string; emailManual?: string }[];
    /** Callback para actualizar ganadores manuales */
    onManualChange?: (winners: { nombreManual: string; emailManual?: string }[]) => void;
}

const SPIN_DURATION = 4000; // 4 segundos
const ITEMS_ON_WHEEL = 12; // Cuántos nombres se ven en la ruleta

export const WinnerRoulette: React.FC<WinnerRouletteProps> = ({
    totalParticipants,
    numWinners,
    onComplete,
    participantNames = [],
    isManual = false,
    manualWinners = [],
    onManualChange,
}) => {
    const [phase, setPhase] = useState<'idle' | 'spinning' | 'result'>('idle');
    const [winners, setWinners] = useState<{ index: number; name: string }[]>([]);
    const [currentSpin, setCurrentSpin] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [selectedManual, setSelectedManual] = useState<number | null>(null);

    // Generar nombres ficticios si no hay suficientes
    const displayNames = participantNames.length > 0
        ? [...participantNames]
        : Array.from({ length: Math.max(totalParticipants, ITEMS_ON_WHEEL) }, (_, i) => 
            `Participante ${i + 1}`
        );

    // Duplicar para llenar la ruleta visual
    const wheelItems = [...displayNames, ...displayNames, ...displayNames].slice(0, ITEMS_ON_WHEEL * 3);

    const startSpin = () => {
        if (phase !== 'idle') return;
        
        setPhase('spinning');
        setWinners([]);
        setCurrentSpin(0);

        // Simular selección aleatoria ponderada
        const winnerIndices: number[] = [];
        const available = Array.from({ length: totalParticipants }, (_, i) => i);
        
        for (let i = 0; i < numWinners && available.length > 0; i++) {
            const idx = Math.floor(Math.random() * available.length);
            winnerIndices.push(available.splice(idx, 1)[0]);
        }

        // Calcular rotación para que caiga en el primer ganador
        const itemHeight = 60; // px por item
        const targetIndex = winnerIndices[0] % ITEMS_ON_WHEEL;
        const baseRotations = 10; // vueltas completas
        const targetRotation = baseRotations * ITEMS_ON_WHEEL + targetIndex + ITEMS_ON_WHEEL; // offset para centrar

        setCurrentSpin(targetRotation);
        setWinners(winnerIndices.map((idx, i) => ({ index: idx, name: displayNames[idx] || `Participante ${idx + 1}` })));

        // Timeout para terminar animación
        setTimeout(() => {
            setPhase('result');
            if (!isManual) {
                onComplete(winners);
            }
        }, SPIN_DURATION + 500);
    };

    const handleManualSelect = (idx: number) => {
        setSelectedManual(idx);
    };

    const confirmManualWinner = () => {
        if (selectedManual !== null && onManualChange && manualWinners) {
            const newWinners = [...manualWinners];
            newWinners[winners.length] = { ...newWinners[winners.length], nombreManual: displayNames[selectedManual] };
            onManualChange(newWinners);
            setWinners(prev => [...prev, { index: selectedManual, name: displayNames[selectedManual] }]);
            setSelectedManual(null);
        }
    };

    if (isManual) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <Users className="mx-auto text-4xl text-white/20 mb-4" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                        Selección Manual de Ganadores
                    </h3>
                    <p className="text-white/50">
                        {totalParticipants} participantes • Elegir {numWinners} ganador{numWinners > 1 ? 'es' : ''}
                    </p>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-3">
                    {displayNames.slice(0, 50).map((name, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            onClick={() => handleManualSelect(idx)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                selectedManual === idx
                                    ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20'
                                    : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${selectedManual === idx ? 'bg-white text-black' : 'bg-white/10 text-white/40'}`}>
                                    {idx + 1}
                                </div>
                                <span className="font-bold text-white">{name}</span>
                                {selectedManual === idx && (
                                    <CheckCircle className="ml-auto text-[var(--color-primary)]" size={20} />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {selectedManual !== null && (
                    <Bt 
                        className="w-full" 
                        onClick={confirmManualWinner}
                        icon={<CheckCircle size={18} />}
                    >
                        Confirmar Ganador {winners.length + 1} de {numWinners}
                    </Bt>
                )}

                {winners.length >= numWinners && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center pt-4"
                    >
                        <Trophy className="mx-auto text-5xl text-yellow-400 mb-3" />
                        <h3 className="text-xl font-black text-white">¡Ganadores Seleccionados!</h3>
                        <div className="flex justify-center gap-2 mt-4 flex-wrap">
                            {winners.map((w, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1, type: "spring" }}
                                    className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 font-bold"
                                >
                                    {i + 1}. {w.name}
                                </motion.div>
                            ))}
                        </div>
                        <Bt 
                            className="w-full mt-6" 
                            onClick={() => onComplete(winners)}
                            icon={<CheckCircle size={18} />}
                        >
                            Confirmar y Cerrar Sorteo
                        </Bt>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Users className="mx-auto text-4xl text-white/20 mb-4" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                    Sorteo de Ganadores
                </h3>
                <div className="flex justify-center gap-8 text-white/50 text-sm">
                    <span>{totalParticipants} participantes</span>
                    <span>•</span>
                    <span>{numWinners} ganador{numWinners > 1 ? 'es' : ''}</span>
                </div>
            </div>

            {phase === 'idle' && (
                <Bt 
                    className="w-full py-4 text-lg" 
                    onClick={startSpin}
                    icon={<Loader2 size={20} className="animate-spin" />}
                >
                    INICIAR RULETA
                </Bt>
            )}

            {phase === 'spinning' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none z-10" />
                    
                    <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                        {/* Línea central */}
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-2 h-2 -translate-x-1/2 bg-yellow-400 rounded-full z-20 shadow-[0_0_20px_yellow]" />
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-px h-12 -translate-x-1/2 bg-yellow-400/50 z-10" />
                        
                        {/* Ruletas por cada ganador */}
                        {Array.from({ length: numWinners }, (_, wIdx) => (
                            <motion.div
                                key={wIdx}
                                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 pointer-events-none"
                                style={{
                                    transform: `translateY(${wIdx * -30}px) translateX(-50%)`,
                                    left: '50%',
                                }}
                                animate={{
                                    transform: `translateY(${wIdx * -30}px) translateX(-50%)`,
                                }}
                            >
                                <div 
                                    ref={wIdx === 0 ? wheelRef : undefined}
                                    className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full"
                                    style={{
                                        transform: `translateY(-${currentSpin * 60}px)`,
                                        transition: `transform ${SPIN_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1)`,
                                    }}
                                >
                                    {wheelItems.map((name, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-12 flex items-center justify-center px-4 text-white/80 font-medium text-sm overflow-hidden"
                                            style={{
                                                background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            }}
                                        >
                                            {i === wheelItems.length - 1 - (currentSpin % wheelItems.length) ? (
                                                <motion.span
                                                    initial={{ scale: 1 }}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                    className="text-yellow-400 font-black"
                                                >
                                                    ► {name} ◄
                                                </motion.span>
                                            ) : (
                                                name
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Loader2 className="mx-auto animate-spin text-[var(--color-primary)]" size={32} />
                        <p className="mt-3 text-white/60 font-medium">Girando la ruleta...</p>
                    </div>
                </motion.div>
            )}

            {phase === 'result' && (
                <AnimatePresence mode="popLayout">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-4"
                    >
                        <Trophy className="mx-auto text-6xl text-yellow-400 animate-bounce" />
                        <h3 className="text-2xl font-black text-white">¡GANADORES!</h3>
                        
                        <div className="flex justify-center gap-3 flex-wrap">
                            {winners.map((w, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                                    className="relative px-6 py-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl shadow-xl shadow-yellow-500/10 min-w-[200px]"
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-black">
                                        {i + 1}
                                    </div>
                                    <div className="text-yellow-400 font-bold text-lg pt-2">{w.name}</div>
                                    <div className="text-white/40 text-xs mt-1">Ganador #{i + 1}</div>
                                </motion.div>
                            ))}
                        </div>

                        <Bt 
                            className="w-full md:w-auto mt-4" 
                            onClick={() => onComplete(winners)}
                            icon={<CheckCircle size={18} />}
                        >
                            Confirmar y Publicar
                        </Bt>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};