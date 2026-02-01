'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Search,
    Gamepad,
    Layers,
    Vote,
    PlayCircle,
    ArrowUpRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { JuegoForm } from '@/shared/components/organisms/JuegoForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';

interface Juego {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    image: string;
    activo: boolean;
    _count: {
        categorias: number;
        votaciones: number;
        tutoriales: number;
    }
}

export default function JuegosAdminPage() {
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingJuego, setEditingJuego] = useState<Juego | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    const fetchJuegos = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`);
            const data = await response.json();
            setJuegos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching juegos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJuegos();
    }, []);

    const handleSave = async (data: any) => {
        try {
            const url = editingJuego
                ? `${process.env.NEXT_PUBLIC_API_URL}/juegos/${editingJuego.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/juegos`;

            const method = editingJuego ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Guardado!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
                setShowForm(false);
                setEditingJuego(null);
                fetchJuegos();
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el juego.', 'error');
        }
    };

    const handleDelete = async (id: string, nombre: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Juego?',
            text: `Esta acción no se puede deshacer. Se eliminará "${nombre}".`,
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
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchJuegos();
                Swal.fire('Eliminado', 'El juego ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el juego.', 'error');
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ activo: !currentStatus }),
            });
            fetchJuegos();
        } catch (error) {
            console.error('Error toggling status');
        }
    };

    const filteredJuegos = juegos.filter(j => {
        const matchesSearch = j.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL'
            ? true
            : filterStatus === 'ACTIVE' ? j.activo : !j.activo;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: juegos.length,
        active: juegos.filter(j => j.activo).length
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Gestión de Juegos</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Total: {stats.total}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-tighter">Activos: {stats.active}</span>
                        </div>
                    </div>
                </div>
                <Bt
                    onClick={() => {
                        setEditingJuego(null);
                        setShowForm(true);
                    }}
                    icon={<Plus size={18} />}
                    data-testid="new-juego-button"
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl mx-auto md:mx-0"
                >
                    AÑADIR JUEGO
                </Bt>
            </div>

            {/* Global Controls - Centered */}
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <Input
                        placeholder="Buscar por nombre..."
                        data-testid="search-juego-input"
                        className="pl-12 h-12 bg-[var(--color-card)] border-white/5 rounded-2xl focus:ring-[var(--color-primary)]/30 text-center"
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-[var(--color-card)] p-1 rounded-2xl border border-white/5 w-auto overflow-x-auto scrollbar-hide">
                    {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filterStatus === s
                                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                : 'text-white/30 hover:text-white'
                                }`}
                        >
                            {s === 'ALL' ? 'Todos' : s === 'ACTIVE' ? 'Activos' : 'Inactivos'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Juegos - Ultra Compact & Efficient */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                    ))
                ) : filteredJuegos.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <Gamepad size={48} className="mx-auto text-white/10 mb-4" />
                        <p className="text-[var(--color-text-secondary)] italic">No se encontraron juegos.</p>
                    </div>
                ) : filteredJuegos.map((juego) => (
                    <motion.div
                        layout
                        key={juego.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[var(--color-card)] rounded-xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all p-3 flex items-center gap-4 group shadow-lg"
                        data-testid={`juego-card-${juego.slug}`}
                    >
                        {/* Thumbnail - Slightly larger for clarity */}
                        <div className="w-16 h-16 shrink-0 relative bg-black/40 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                            <Image
                                src={juego.image || '/LOGO-AJDREW.png'}
                                alt={juego.nombre}
                                fill
                                className="object-contain p-2"
                            />
                        </div>

                        {/* Middle Section: Name, Status & Stats */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate leading-none">
                                    {juego.nombre}
                                </h3>
                                <button
                                    onClick={() => toggleStatus(juego.id, juego.activo)}
                                    data-testid="toggle-active-juego-btn"
                                    className={`shrink-0 text-[7px] font-black px-2 py-1 rounded-md border transition-all tracking-widest ${juego.activo
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}
                                >
                                    {juego.activo ? 'ACTIVADO' : 'DESACTIVADO'}
                                </button>
                            </div>

                            {/* Clean KPIs - Just icons and numbers */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5" title="Categorías">
                                    <Layers size={14} className="text-[var(--color-primary)] opacity-80" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {juego._count.categorias}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Votaciones">
                                    <span className="text-[8px] font-black text-[var(--color-primary)]/40 uppercase tracking-tighter">Vots:</span>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {juego._count.votaciones}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Tutoriales">
                                    <PlayCircle size={14} className="text-blue-400 opacity-80" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {juego._count.tutoriales}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Stack: Integrated Labels */}
                        <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                            <button
                                onClick={() => { setEditingJuego(juego); setShowForm(true); }}
                                className="flex items-center justify-between gap-3 px-2 py-1.5 bg-white/5 text-white/30 hover:text-white hover:bg-[var(--color-primary)]/20 rounded-lg transition-all border border-transparent hover:border-[var(--color-primary)]/30 group/btn"
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest">EDITAR</span>
                                <Edit2 size={12} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleDelete(juego.id, juego.nombre)}
                                className="flex items-center justify-between gap-3 px-2 py-1.5 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30 group/btn"
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest">ELIM</span>
                                <Trash2 size={12} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl"
                        >
                            <JuegoForm
                                title={editingJuego ? 'Editar Juego' : 'Nuevo Juego'}
                                initialData={editingJuego || undefined}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingJuego(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
