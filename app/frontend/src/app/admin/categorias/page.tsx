'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    Tag,
    CheckCircle,
    XCircle,
    Search,
    Layers,
    Vote,
    PlayCircle,
    Package,
    Gamepad2,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoriaForm } from '@/shared/components/organisms/CategoriaForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';

interface Categoria {
    id: string;
    nombre: string;
    tipo: string;
    activa: boolean;
    juegoId: string | null;
    juego?: { nombre: string };
    createdAt: string;
    _count: {
        items: number;
        votaciones: number;
        tutoriales: number;
    }
}

interface Juego {
    id: string;
    nombre: string;
}

export default function CategoriasAdminPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    const fetchData = async () => {
        try {
            const [resCats, resJuegos] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
            ]);
            setCategorias(await resCats.json());
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
            const url = editingCategoria
                ? `${process.env.NEXT_PUBLIC_API_URL}/categorias/${editingCategoria.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

            const method = editingCategoria ? 'PATCH' : 'POST';

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
                    title: '¡Guardada!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
                setShowForm(false);
                setEditingCategoria(null);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire('Error', 'No se pudo guardar la categoría.', 'error');
        }
    };

    const handleDelete = async (id: string, nombre: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Categoría?',
            text: `Confirmas eliminar "${nombre}". Se desvincularán los ítems asociados.`,
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
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchData();
                Swal.fire('Eliminada', '', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ activa: !currentStatus }),
            });
            fetchData();
        } catch (error) {
            console.error('Error toggling status');
        }
    };

    const filteredCats = categorias.filter(c => {
        const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || (c.tipo && c.tipo.toLowerCase() === filterType.toLowerCase());
        const matchesStatus = filterStatus === 'ALL'
            ? true
            : filterStatus === 'ACTIVE' ? c.activa : !c.activa;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-32">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Categorías</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Total: {categorias.length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <span className="text-blue-500 text-[10px] font-black uppercase tracking-tighter">Globales: {categorias.filter(c => !c.juegoId).length}</span>
                        </div>
                    </div>
                </div>
                <Bt
                    onClick={() => {
                        setEditingCategoria(null);
                        setShowForm(true);
                    }}
                    icon={<Plus size={18} />}
                    data-testid="new-categoria-button"
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl mx-auto md:mx-0"
                >
                    NUEVA CATEGORÍA
                </Bt>
            </div>

            {/* Global Controls - Centered */}
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <Input
                        placeholder="Buscar categoría..."
                        data-testid="search-categoria-input"
                        className="pl-12 h-12 bg-[var(--color-card)] border-white/5 rounded-2xl focus:ring-[var(--color-primary)]/30 text-center"
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <div className="flex bg-[var(--color-card)] p-1 rounded-2xl border border-white/5">
                        {['all', 'calificacion', 'votacion', 'tutorial'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${filterType === type ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
                            >
                                {type === 'all' ? 'Todas' : type.slice(0, 3)}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-[var(--color-card)] p-1 rounded-2xl border border-white/5">
                        {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === s ? 'bg-blue-500 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
                            >
                                {s === 'ALL' ? 'Status' : s === 'ACTIVE' ? 'ON' : 'OFF'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content List: Small Horizontal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                    ))
                ) : filteredCats.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20">
                        <Tag size={48} className="mx-auto mb-4" />
                        <p className="italic">No se encontraron categorías.</p>
                    </div>
                ) : filteredCats.map((cat) => (
                    <motion.div
                        layout
                        key={cat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[var(--color-card)] rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all p-4 flex items-center gap-4 group shadow-lg"
                        data-testid={`categoria-card-${cat.id}`}
                    >
                        {/* Info Section */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 cursor-default">
                                <h3 className="text-xs font-black text-white uppercase italic tracking-tighter truncate leading-none">
                                    {cat.nombre}
                                </h3>
                                <button
                                    onClick={() => toggleStatus(cat.id, cat.activa)}
                                    className={`shrink-0 text-[7px] font-black px-2 py-0.5 rounded-md border transition-all tracking-widest ${cat.activa
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}
                                >
                                    {cat.activa ? 'ACTIVADO' : 'DESACTIVADO'}
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <Gamepad2 size={10} className="text-white/20" />
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[2px]">
                                        {cat.juego?.nombre || 'Global'}
                                    </span>
                                </div>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${cat.tipo.toLowerCase() === 'calificacion' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                    cat.tipo.toLowerCase() === 'votacion' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    } uppercase tracking-tighter`}>
                                    {cat.tipo}
                                </span>
                            </div>

                            {/* Clean KPIs */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5" title="Items">
                                    <Package size={14} className="text-[var(--color-primary)] opacity-80" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {cat._count?.items || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Votaciones">
                                    <Vote size={14} className="text-purple-400 opacity-80" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {cat._count?.votaciones || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Tutoriales">
                                    <PlayCircle size={14} className="text-blue-400 opacity-80" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                        {cat._count?.tutoriales || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Stack */}
                        <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                            <button
                                onClick={() => { setEditingCategoria(cat); setShowForm(true); }}
                                className="flex items-center justify-between gap-3 px-2 py-1.5 bg-white/5 text-white/30 hover:text-white hover:bg-[var(--color-primary)]/20 rounded-lg transition-all border border-transparent hover:border-[var(--color-primary)]/30 group/btn"
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest">EDITAR</span>
                                <Edit2 size={12} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id, cat.nombre)}
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
                            <CategoriaForm
                                title={editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                                initialData={editingCategoria || undefined}
                                juegos={juegos}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingCategoria(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
