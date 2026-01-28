'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    Gift,
    Calendar,
    Users,
    Trophy,
    Search,
    Gamepad2,
    ChevronDown,
    Activity,
    Youtube,
    UserCircle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SorteoForm } from '@/modules/sorteos/components/SorteoForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';

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

interface Juego {
    id: string;
    nombre: string;
}

export default function SorteosAdminPage() {
    // Data State
    const [sorteos, setSorteos] = useState<Sorteo[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [selectedForManual, setSelectedForManual] = useState<Sorteo | null>(null);
    const [manualWinners, setManualWinners] = useState<{ nombreManual: string, emailManual: string }[]>([]);

    const [editingSorteo, setEditingSorteo] = useState<Sorteo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJuego, setSelectedJuego] = useState<string>('all');
    const [selectedEstado, setSelectedEstado] = useState<string>('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resSorteos, resJuegos] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
            ]);
            setSorteos(await resSorteos.json());
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
            const url = editingSorteo ? `${process.env.NEXT_PUBLIC_API_URL}/sorteos/${editingSorteo.id}` : `${process.env.NEXT_PUBLIC_API_URL}/sorteos`;
            const method = editingSorteo ? 'PATCH' : 'POST';
            if (!data.juegoId) delete data.juegoId;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire({ title: '¡Guardado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                setShowForm(false);
                setEditingSorteo(null);
                fetchData();
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error del servidor al guardar');
            }
        } catch (error: any) {
            Swal.fire('Error', error.message || 'No se pudo guardar el sorteo.', 'error');
        }
    };

    const handleFinalize = async (id: string, titulo: string) => {
        const result = await Swal.fire({
            title: '¿Realizar sorteo?',
            text: `Se elegirán los ganadores para "${titulo}" de forma aleatoria basándose en los participantes de la web.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sí, sortear ahora',
            confirmButtonColor: 'var(--color-primary)',
            background: '#0a0f0a',
            color: '#fff',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${id}/elegir-ganadores`, {
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
        }
    };

    const handleManualFinalizeSubmit = async () => {
        if (!selectedForManual) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${selectedForManual.id}/finalizar-manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(manualWinners),
            });

            if (response.ok) {
                Swal.fire('Sorteo Cerrado', 'Los ganadores manuales han sido registrados.', 'success');
                setShowManualModal(false);
                setSelectedForManual(null);
                setManualWinners([]);
                fetchData();
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo cerrar el sorteo manualmente.', 'error');
        }
    };

    const handleDelete = async (id: string, titulo: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Sorteo?',
            text: `Confirmas eliminar "${titulo}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            background: '#0a0f0a',
            color: '#fff',
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchData();
                Swal.fire('Eliminado', '', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const filteredSorteos = sorteos.filter(s => {
        const matchesSearch = s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || s.premio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJuego = selectedJuego === 'all' || s.juegoId === selectedJuego;
        const matchesEstado = selectedEstado === 'all' || s.estado === selectedEstado;
        return matchesSearch && matchesJuego && matchesEstado;
    });

    return (
        <div className="space-y-8 pb-32">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Gestión de Sorteos</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Eventos: {sorteos.length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Activos: {sorteos.filter(s => s.estado === 'ACTIVO').length}</span>
                        </div>
                    </div>
                </div>
                <Bt
                    onClick={() => { setEditingSorteo(null); setShowForm(true); }}
                    icon={<Plus size={18} />}
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl mx-auto md:mx-0"
                >
                    NUEVO SORTEO
                </Bt>
            </div>

            {/* Global Controls */}
            <div className="bg-[var(--color-card)] p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <Input
                            placeholder="Buscar sorteo o premio..."
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

                <div className="flex justify-center pt-2">
                    <div className="flex bg-[var(--color-card)] p-1 rounded-2xl border border-white/5 w-auto overflow-x-auto scrollbar-hide">
                        {(['all', 'ACTIVO', 'CERRADO'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSelectedEstado(s)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${selectedEstado === s
                                    ? 'bg-[var(--color-primary)] text-black shadow-lg shadow-[var(--color-primary)]/20'
                                    : 'text-white/30 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {s === 'all' ? 'Todos' : s === 'ACTIVO' ? 'Activos' : 'Finalizados'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)
                ) : filteredSorteos.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20 italic">No se encontraron sorteos registrados.</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredSorteos.map((sorteo) => (
                            <motion.div
                                layout
                                key={sorteo.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                                className="bg-[var(--color-card)] rounded-3xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all p-3 flex flex-col gap-4 group relative overflow-hidden shadow-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-20 h-20 shrink-0 relative flex items-center justify-center rounded-2xl border border-white/5 shadow-inner transition-all group-hover:scale-105 duration-500 ${sorteo.estado === 'ACTIVO' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-red-500/5 text-red-500/20'}`}>
                                        {sorteo.image ? (
                                            <img src={sorteo.image} alt="" className="w-full h-full object-cover rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <Gift size={32} className={sorteo.estado === 'ACTIVO' ? 'opacity-80' : 'opacity-20'} />
                                        )}
                                        <div className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${sorteo.estado === 'ACTIVO' ? 'bg-green-500 text-white border-green-400/20 shadow-lg shadow-green-500/20' : 'bg-red-500/20 text-red-500 border-red-500/20'}`}>
                                            {sorteo.estado === 'ACTIVO' ? 'ACTIVO' : 'CERRADO'}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate leading-none mb-1.5 pr-2">
                                            {sorteo.titulo}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[2px] truncate">
                                                {sorteo.juego?.nombre || 'Global'}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={10} className="text-white/20" />
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                                                    {new Date(sorteo.fechaFin).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5" title="Inscritos">
                                                <Users size={12} className="text-[var(--color-primary)] opacity-50" />
                                                <span className="text-[10px] font-black text-white/40">{sorteo._count?.participantes || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Ganadores">
                                                <span className="text-[8px] font-black text-yellow-500/40 uppercase tracking-tighter">Gands:</span>
                                                <span className="text-[10px] font-black text-white/40">{sorteo.numGanadores}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 truncate" title="Premio">
                                                <Gift size={12} className="text-purple-400 opacity-50" />
                                                <span className="text-[9px] font-black text-white/30 uppercase truncate max-w-[80px]">{sorteo.premio}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => { setEditingSorteo(sorteo); setShowForm(true); }}
                                                className="p-2 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sorteo.id, sorteo.titulo)}
                                                className="p-2 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {sorteo.estado === 'CERRADO' && (
                                    <div className="mt-1 pt-3 border-t border-white/5 bg-black/20 -mx-3 -mb-3 p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy size={14} className="text-yellow-500" />
                                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">GANADORES:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {sorteo.ganadores && sorteo.ganadores.length > 0 ? (
                                                sorteo.ganadores.map((g, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                                        <UserCircle size={10} className="text-yellow-500" />
                                                        <span className="text-[9px] font-bold text-white/80">{g.usuario?.nombre || g.nombreManual}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-[10px] italic text-white/20">Resultados no registrados.</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {sorteo.estado === 'ACTIVO' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFinalize(sorteo.id, sorteo.titulo)}
                                            disabled={!sorteo._count?.participantes}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-lg shadow-[var(--color-primary)]/10"
                                        >
                                            <Trophy size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">SORTEO WEB</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedForManual(sorteo);
                                                setManualWinners(Array(sorteo.numGanadores).fill({ nombreManual: '', emailManual: '' }));
                                                setShowManualModal(true);
                                            }}
                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl border border-white/5 transition-all text-[9px] font-black uppercase tracking-widest"
                                        >
                                            MANUAL / YT
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-[var(--color-bg)] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <SorteoForm
                                title={editingSorteo ? 'Editar Sorteo' : 'Nuevo Sorteo'}
                                initialData={editingSorteo ? {
                                    titulo: editingSorteo.titulo,
                                    premio: editingSorteo.premio,
                                    fechaFin: editingSorteo.fechaFin ? new Date(editingSorteo.fechaFin).toISOString().slice(0, 16) : '',
                                    juegoId: editingSorteo.juegoId || '',
                                    numGanadores: editingSorteo.numGanadores || 1,
                                    image: editingSorteo.image || '',
                                    externalUrl: editingSorteo.externalUrl || '',
                                    tareas: (editingSorteo as any).tareas || []
                                } : undefined}
                                juegos={juegos}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingSorteo(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Manual Winner Modal */}
            <AnimatePresence>
                {showManualModal && selectedForManual && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManualModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-[var(--color-card)] rounded-[2rem] border border-white/10 p-6 shadow-3xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Ganadores Manuales</h2>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{selectedForManual.titulo}</p>
                                </div>
                                <button onClick={() => setShowManualModal(false)} className="p-2 text-white/20 hover:text-white transition-colors"><X size={20} /></button>
                            </div>

                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                                {manualWinners.map((winner, idx) => (
                                    <div key={idx} className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px] font-black">
                                                {idx + 1}
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ganador {idx + 1}</span>
                                        </div>
                                        <div>
                                            <Label className="text-[9px] mb-1 opacity-50">Nombre / Alias</Label>
                                            <Input
                                                value={winner.nombreManual}
                                                onChange={(e: any) => {
                                                    const newWinners = [...manualWinners];
                                                    newWinners[idx] = { ...newWinners[idx], nombreManual: e.target.value };
                                                    setManualWinners(newWinners);
                                                }}
                                                placeholder="Ej: @JuanitoYouTube"
                                                className="bg-black/40 border-white/5 h-10 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[9px] mb-1 opacity-50">Email (Opcional)</Label>
                                            <Input
                                                value={winner.emailManual}
                                                onChange={(e: any) => {
                                                    const newWinners = [...manualWinners];
                                                    newWinners[idx] = { ...newWinners[idx], emailManual: e.target.value };
                                                    setManualWinners(newWinners);
                                                }}
                                                placeholder="usuario@ejemplo.com"
                                                className="bg-black/40 border-white/5 h-10 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex gap-3">
                                <Bt variant="secondary" className="flex-1" onClick={() => setShowManualModal(false)}>Cancelar</Bt>
                                <Bt
                                    className="flex-1"
                                    onClick={handleManualFinalizeSubmit}
                                    disabled={manualWinners.some(w => !w.nombreManual.trim())}
                                >
                                    Guardar y Cerrar
                                </Bt>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
