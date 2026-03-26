'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
    Filter,
    Clock,
    CalendarClock,
    Timer
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
    imageUrl?: string | null;
    itemsIds?: string[];
    categoriaId?: string;
}

interface Juego {
    id: string;
    nombre: string;
}

// ── Live Countdown ────────────────────────────────────────────────
function useCountdown(targetIso?: string) {
    const [diff, setDiff] = useState<number | null>(null);

    useEffect(() => {
        if (!targetIso) { setDiff(null); return; }
        const update = () => {
            const ms = new Date(targetIso).getTime() - Date.now();
            setDiff(ms > 0 ? ms : 0);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetIso]);

    return diff;
}

function Countdown({ targetIso }: { targetIso?: string }) {
    const ms = useCountdown(targetIso);
    if (ms === null || !targetIso) return null;
    if (ms === 0) return <span className="text-[8px] font-black text-red-400 uppercase">¡Tiempo!</span>;

    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const fmt = h > 0
        ? `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
        : `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;

    return (
        <span className="flex items-center gap-1 text-[9px] font-black text-yellow-400 uppercase tabular-nums">
            <Timer size={9} />
            {fmt}
        </span>
    );
}

export default function VotacionesAdminPage() {
    const [brackets, setBrackets] = useState<Bracket[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBracket, setEditingBracket] = useState<Bracket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJuego, setSelectedJuego] = useState<string>('all');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [slideIndexMap, setSlideIndexMap] = useState<Record<string, number>>({});

    const getSlide = (id: string) => slideIndexMap[id] ?? 0;
    const setSlide = (id: string, idx: number) =>
        setSlideIndexMap(prev => ({ ...prev, [id]: idx }));

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

    const handleScheduleRound = async (id: string, currentSchedule?: string) => {
        const defaultDt = currentSchedule ? new Date(currentSchedule) : new Date(Date.now() + 60 * 60 * 1000);
        const pad = (n: number) => String(n).padStart(2, '0');
        const defaultValue = `${defaultDt.getFullYear()}-${pad(defaultDt.getMonth() + 1)}-${pad(defaultDt.getDate())}T${pad(defaultDt.getHours())}:${pad(defaultDt.getMinutes())}`;

        const { value: datetime, isConfirmed, isDenied } = await Swal.fire({
            title: '⏰ Programar Avance de Ronda',
            html: `
                <p style="color:rgba(255,255,255,0.4);font-size:11px;margin-bottom:16px;">
                  El sistema revisará cada minuto y avanzará la ronda automáticamente cuando llegue esta hora.
                </p>
                <input id="swal-dt" type="datetime-local" value="${defaultValue}"
                  style="width:100%;padding:12px 16px;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;font-weight:bold;outline:none;" />
            `,
            showCancelButton: true,
            showDenyButton: !!currentSchedule,
            confirmButtonText: '✅ Programar',
            denyButtonText: '🗑 Quitar programación',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'var(--color-primary)',
            denyButtonColor: '#dc2626',
            background: '#0a0f0a',
            color: '#fff',
            preConfirm: () => (document.getElementById('swal-dt') as HTMLInputElement)?.value,
        });

        if (isDenied) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ proximoCierreAt: null }),
            });
            Swal.fire({ title: 'Programación eliminada', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, background: '#0a0f0a', color: '#fff' });
            fetchData();
            return;
        }

        if (!isConfirmed || !datetime) return;

        const scheduledAt = new Date(datetime).toISOString();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ proximoCierreAt: scheduledAt }),
        });
        Swal.fire({
            title: '⏰ Ronda programada',
            html: `<span style="color:rgba(255,255,255,0.5);font-size:12px;">Se avanzará el <b style="color:#fff">${new Date(scheduledAt).toLocaleString()}</b></span>`,
            icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 4000, background: '#0a0f0a', color: '#fff',
        });
        fetchData();
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

    const getBracketImages = (bracket: Bracket): string[] => {
        if (!bracket.imageUrl) return [];
        // Check if it's a JSON array of multiple VS images or Cloudinary URLs
        if (bracket.imageUrl.startsWith('[')) {
            try {
                const arr: string[] = JSON.parse(bracket.imageUrl);
                return arr.map(b => b.startsWith('http') || b.startsWith('/') || b.startsWith('data:') ? b : `data:image/png;base64,${b}`);
            } catch { }
        }
        // Single image (legacy or champion)
        if (bracket.imageUrl.startsWith('http') || bracket.imageUrl.startsWith('/')) return [bracket.imageUrl];
        if (bracket.imageUrl.startsWith('data:')) return [bracket.imageUrl];
        return [`data:image/png;base64,${bracket.imageUrl}`];
    };

    const filteredBrackets = brackets.filter(b => {
        const matchesSearch = b.tematica.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJuego = selectedJuego === 'all' || b.juegoId === selectedJuego;
        return matchesSearch && matchesJuego;
    });

    return (
        <div className="space-y-8 pb-32">
            {/* Header section */}
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

            {/* Filters */}
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

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)
                ) : filteredBrackets.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20 italic">No se encontraron torneos.</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredBrackets.map((bracket) => {
                            const { votes, totalRounds } = getStats(bracket);
                            const imgs = getBracketImages(bracket);
                            const slide = getSlide(bracket.id);
                            const imgSrc = imgs[slide] ?? null;

                            return (
                                <motion.div
                                    layout
                                    key={bracket.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[var(--color-card)] rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all shadow-lg"
                                    data-testid={`bracket-card-${bracket.slug}`}
                                >
                                    <div className="p-3 flex items-center gap-3">
                                        {/* VS image mini-carousel */}
                                        {imgs.length > 0 && (
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                                <button
                                                    onClick={() => setExpandedImage(imgSrc!)}
                                                    className="w-full h-full block group"
                                                    title="Ver imagen VS"
                                                >
                                                    <img src={imgSrc!} alt="" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                                        <span className="opacity-0 group-hover:opacity-100 text-white text-[8px] font-black uppercase tracking-wider transition-opacity">VER</span>
                                                    </div>
                                                </button>
                                                {imgs.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setSlide(bracket.id, (slide - 1 + imgs.length) % imgs.length); }}
                                                            className="absolute left-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-black/70 rounded-full text-white/80 hover:text-white flex items-center justify-center text-[8px] z-10 transition-all"
                                                        >‹</button>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setSlide(bracket.id, (slide + 1) % imgs.length); }}
                                                            className="absolute right-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-black/70 rounded-full text-white/80 hover:text-white flex items-center justify-center text-[8px] z-10 transition-all"
                                                        >›</button>
                                                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                            {imgs.map((_, i) => (
                                                                <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === slide ? 'bg-[var(--color-primary)]' : 'bg-white/30'}`} />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

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

                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[2px] truncate">{bracket.juego?.nombre || 'General'}</span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black text-[var(--color-primary)]/60">RONDA {bracket.rondaActual} / {totalRounds}</span>
                                                    {bracket.estado === 'ACTIVA' && (
                                                        <div className="flex items-center gap-1">
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
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleScheduleRound(bracket.id, bracket.proximoCierreAt); }}
                                                                title={bracket.proximoCierreAt ? `Programado: ${new Date(bracket.proximoCierreAt).toLocaleString()}` : 'Programar avance automático'}
                                                                className={`p-0.5 rounded border text-[7px] font-black transition-all flex items-center gap-0.5 ${bracket.proximoCierreAt
                                                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30'
                                                                    : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-white'
                                                                    }`}
                                                            >
                                                                <CalendarClock size={11} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Live countdown */}
                                            {bracket.estado === 'ACTIVA' && bracket.proximoCierreAt && (
                                                <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-yellow-500/5 rounded-lg border border-yellow-500/15 w-fit">
                                                    <Countdown targetIso={bracket.proximoCierreAt} />
                                                </div>
                                            )}

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

                                        {/* Actions */}
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
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Image lightbox */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedImage(null)}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-2xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={expandedImage} alt="Imagen del torneo" className="w-full rounded-2xl shadow-2xl" />
                            <button
                                onClick={() => setExpandedImage(null)}
                                className="absolute -top-4 -right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
