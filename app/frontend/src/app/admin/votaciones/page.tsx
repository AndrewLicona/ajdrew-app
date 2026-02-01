'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    Vote,
    ChevronRight,
    Eye,
    EyeOff,
    Search,
    Gamepad2,
    Target,
    Activity,
    Users,
    ChevronDown,
    X,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BracketForm } from '@/modules/votaciones/components/BracketForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';

interface MatchMin {
    votosA: number;
    votosB: number;
    ronda: number;
}

interface Bracket {
    id: string;
    tematica: string;
    slug: string;
    estado: 'BORRADOR' | 'ACTIVA' | 'FINALIZADA';
    rondaActual: number;
    juegoId: string;
    juego?: { nombre: string };
    activa: boolean;
    _count: { matches: number };
    matches?: MatchMin[];
    rondaDuracion: number;
    proximoCierreAt?: string;
    itemsIds?: string[];
    categoriaId?: string;
}

interface Juego {
    id: string;
    nombre: string;
}

export default function VotacionesAdminPage() {
    const [brackets, setBrackets] = useState<Bracket[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBracket, setEditingBracket] = useState<Bracket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJuego, setSelectedJuego] = useState<string>('all');

    const fetchData = async () => {
        try {
            const [resBrackets, resJuegos] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
            ]);
            const bracketsData = await resBrackets.json();
            setBrackets(Array.isArray(bracketsData) ? bracketsData : []);
            setJuegos(await resJuegos.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (data: any) => {
        try {
            // Fix: ensure categoriaId is null if empty string to avoid Prisma errors
            if (data.categoriaId === '') data.categoriaId = null;

            const url = editingBracket ? `${process.env.NEXT_PUBLIC_API_URL}/votaciones/${editingBracket.id}` : `${process.env.NEXT_PUBLIC_API_URL}/votaciones`;
            const method = editingBracket ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire({ title: '¡Guardado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                setShowForm(false);
                setEditingBracket(null);
                fetchData();
            } else {
                const errorData = await response.json();
                Swal.fire('Error', errorData.message || 'No se pudo guardar la votación.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de red al intentar guardar.', 'error');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ estado: newStatus })
            });
            fetchData();
        } catch (e) { console.error('Error changing status'); }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ activa: !currentStatus })
            });
            fetchData();
        } catch (e) { console.error('Error toggling active'); }
    };

    const handleDelete = async (id: string, tematica: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Torneo?',
            text: `Confirmas eliminar "${tematica}". Se borrarán todos los matches y votos asociados.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#0a0f0a',
            color: '#fff',
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${id}/delete`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchData();
                Swal.fire('Eliminado', '', 'success');
            } catch (e) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
        }
    };

    const getStats = (bracket: Bracket) => {
        if (!bracket.matches) return { votes: 0, totalRounds: 1 };
        const votes = bracket.matches.reduce((acc, m) => acc + m.votosA + m.votosB, 0);
        const maxRound = Math.max(...bracket.matches.map(m => m.ronda), 1);
        return { votes, totalRounds: maxRound };
    };

    const filteredBrackets = brackets.filter(b => {
        const matchesSearch = b.tematica.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJuego = selectedJuego === 'all' || b.juegoId === selectedJuego;
        return matchesSearch && matchesJuego;
    });

    return (
        <div className="space-y-8 pb-32">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Torneos y Brackets</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Torneos: {brackets.length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Activos: {brackets.filter(b => b.activa).length}</span>
                        </div>
                    </div>
                </div>
                <Bt
                    onClick={() => { setEditingBracket(null); setShowForm(true); }}
                    icon={<Plus size={18} />}
                    data-testid="new-tournament-button"
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl mx-auto md:mx-0"
                >
                    NUEVO TORNEO
                </Bt>
            </div>

            {/* Global Controls */}
            <div className="bg-[var(--color-card)] p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <Input
                            placeholder="Buscar torneo..."
                            data-testid="search-tournament-input"
                            className="pl-12 h-14 bg-black/20 border-white/5 rounded-2xl focus:ring-[var(--color-primary)]/20 text-center md:text-left"
                            value={searchTerm}
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full lg:w-72">
                        <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <select
                            value={selectedJuego}
                            onChange={(e) => setSelectedJuego(e.target.value)}
                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] appearance-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer outline-none shadow-inner"
                        >
                            <option value="all" className="bg-[#111] text-white">Todos los Juegos</option>
                            {juegos.map(j => (
                                <option key={j.id} value={j.id} className="bg-[#111] text-white">{j.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* List: Final Refactored V8 Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)
                ) : filteredBrackets.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20 italic">No se encontraron torneos.</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredBrackets.map((bracket) => {
                            const { votes, totalRounds } = getStats(bracket);
                            return (
                                <motion.div
                                    layout
                                    key={bracket.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[var(--color-card)] rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all p-3 flex items-center gap-4 group shadow-lg"
                                    data-testid={`bracket-card-${bracket.slug}`}
                                >
                                    {/* Info Section - Expanded since Trophy is gone */}

                                    {/* Middle Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate leading-none">
                                                {bracket.tematica}
                                            </h3>
                                            <select
                                                value={bracket.estado}
                                                onChange={(e) => handleStatusChange(bracket.id, e.target.value as any)}
                                                className={`shrink-0 text-[7px] font-black px-2 py-1 rounded-md border transition-all tracking-widest outline-none cursor-pointer ${bracket.estado === 'ACTIVA'
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : bracket.estado === 'BORRADOR'
                                                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}
                                            >
                                                <option value="BORRADOR" className="bg-[#111] text-white">BORRADOR</option>
                                                <option value="ACTIVA" className="bg-[#111] text-white">ACTIVA</option>
                                                <option value="FINALIZADA" className="bg-[#111] text-white">FINALIZADA</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[2px] truncate">{bracket.juego?.nombre || 'General'}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            {bracket.proximoCierreAt && bracket.estado === 'ACTIVA' && (
                                                <>
                                                    <span className="text-[8px] font-black text-yellow-500/60 uppercase">
                                                        CIERRA: {new Date(bracket.proximoCierreAt).toLocaleString()}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                                </>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-black text-[var(--color-primary)]/60">RONDA {bracket.rondaActual} / {totalRounds}</span>
                                                {bracket.estado === 'ACTIVA' && (
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const res = await Swal.fire({
                                                                title: '¿Avanzar de Ronda?',
                                                                text: 'Se cerrarán los votos actuales y se generarán los nuevos enfrentamientos.',
                                                                icon: 'question',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Sí, avanzar',
                                                                confirmButtonColor: 'var(--color-primary)',
                                                                background: '#0a0f0a',
                                                                color: '#fff'
                                                            });
                                                            if (res.isConfirmed) {
                                                                try { await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${bracket.id}/advance-round`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); fetchData(); } catch (e) { }
                                                            }
                                                        }}
                                                        className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[7px] font-black uppercase rounded border border-[var(--color-primary)]/20 transition-all flex items-center gap-1"
                                                    >
                                                        + ROUND
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Stats */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5" title="Votos Totales">
                                                <Activity size={12} className="text-red-500/60" />
                                                <span className="text-[10px] font-black text-white/40">{votes}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Combates">
                                                <Target size={12} className="text-blue-400 opacity-60" />
                                                <span className="text-[10px] font-black text-white/40">{bracket._count.matches}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Actions Vertical Stack */}
                                    <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => {
                                                    const participantIds = Array.isArray(bracket.matches) ? [...new Set(bracket.matches.flatMap((m: any) => [m.itemAId, m.itemBId]).filter(Boolean))] as string[] : [];
                                                    setEditingBracket({ ...bracket, itemsIds: participantIds }); setShowForm(true);
                                                }}
                                                className="p-2 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                title="Editar Detalles"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(bracket.id, bracket.activa)}
                                                className={`p-2 rounded-lg transition-all ${bracket.activa ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-white/5 text-white/20 hover:text-white'}`}
                                                title={bracket.activa ? "Ocultar de la Web" : "Mostrar en la Web"}
                                            >
                                                {bracket.activa ? <Eye size={14} /> : <EyeOff size={14} />}
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(bracket.id, bracket.tematica)}
                                            className="px-2 py-2 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                        >
                                            ELIMINAR
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl">
                            <BracketForm
                                title={editingBracket ? 'Editar Torneo' : 'Nuevo Torneo'}
                                initialData={editingBracket ? {
                                    tematica: editingBracket.tematica,
                                    slug: editingBracket.slug,
                                    juegoId: editingBracket.juegoId || '',
                                    itemsIds: editingBracket.itemsIds || [],
                                    rondaDuracion: editingBracket.rondaDuracion,
                                    categoriaId: editingBracket.categoriaId || ''
                                } : undefined}
                                juegos={juegos}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingBracket(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
