'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    PlayCircle,
    Star,
    Eye,
    EyeOff,
    Youtube,
    Search,
    Gamepad2,
    Layers,
    ChevronDown,
    Loader2,
    CheckSquare,
    Square,
    Activity,
    ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialForm } from '@/modules/tutoriales/components/TutorialForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';

interface Tutorial {
    id: string;
    titulo: string;
    slug: string;
    videoUrl: string;
    descripcion?: string;
    image?: string;
    dificultad: 'FACIL' | 'MEDIO' | 'PRO';
    destacado: boolean;
    activo: boolean;
    juegoId: string;
    categoriaId?: string;
    juego?: { nombre: string };
    categoria?: { nombre: string };
    pasos?: any[];
}

interface Juego {
    id: string;
    nombre: string;
}

export default function TutorialesAdminPage() {
    // Data State
    const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJuego, setSelectedJuego] = useState<string>('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [resTutorials, resJuegos, resCats] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/admin`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`)
            ]);

            const tutorialsData = await resTutorials.json();
            setTutoriales(Array.isArray(tutorialsData) ? tutorialsData : []);
            setJuegos(await resJuegos.json());
            setCategorias(await resCats.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: any) => {
        try {
            const url = editingTutorial
                ? `${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${editingTutorial.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/tutoriales`;

            const method = editingTutorial ? 'PATCH' : 'POST';

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
                setEditingTutorial(null);
                fetchData();
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el tutorial.', 'error');
        }
    };

    const handleToggleBoolean = async (id: string, field: 'activo' | 'destacado', currentValue: boolean) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ [field]: !currentValue })
            });
            // Update local state for immediate feedback
            setTutoriales(prev => prev.map(t => t.id === id ? { ...t, [field]: !currentValue } : t));
        } catch (e) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    const handleDelete = async (id: string, titulo: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Tutorial?',
            text: `Confirmas eliminar "${titulo}".`,
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                if (response.ok) {
                    Swal.fire('Eliminado', '', 'success');
                    fetchData();
                }
            } catch (e) {
                Swal.fire('Error', 'No se pudo eliminar el tutorial.', 'error');
            }
        }
    };

    const filteredTutorials = tutoriales.filter(t => {
        const matchesSearch = t.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJuego = selectedJuego === 'all' || t.juegoId === selectedJuego;
        return matchesSearch && matchesJuego;
    });

    const getYoutubeThumb = (url: string) => {
        const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Gestión de Tutoriales</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Total: {tutoriales.length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <span className="text-blue-500 text-[10px] font-black uppercase tracking-tighter">Destacados: {tutoriales.filter(t => t.destacado).length}</span>
                        </div>
                    </div>
                </div>
                <Bt
                    onClick={() => { setEditingTutorial(null); setShowForm(true); }}
                    icon={<Plus size={18} />}
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl mx-auto md:mx-0"
                >
                    NUEVO TUTORIAL
                </Bt>
            </div>

            {/* Global Controls */}
            <div className="bg-[var(--color-card)] p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <Input
                            placeholder="Buscar tutorial por título..."
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

            {/* Content List: Compact Vertical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse" />)
                ) : filteredTutorials.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-20 italic">No se encontraron tutoriales.</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredTutorials.map((tutorial) => (
                            <motion.div
                                layout
                                key={tutorial.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                                className="bg-[var(--color-card)] rounded-3xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all p-3 flex items-center gap-4 group relative overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-28 sm:w-32 h-20 shrink-0 rounded-2xl overflow-hidden bg-black/40 border border-white/5 group/thumb">
                                    <img
                                        src={tutorial.image || getYoutubeThumb(tutorial.videoUrl)}
                                        alt=""
                                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700 opacity-60 group-hover/thumb:opacity-100"
                                    />

                                    {/* Top Right Star for Featured */}
                                    {tutorial.destacado && (
                                        <div className="absolute top-1 right-1 z-10 p-1 bg-black/60 backdrop-blur-md rounded-lg text-yellow-400 shadow-lg border border-yellow-400/20">
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    )}

                                    {tutorial.videoUrl && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-transparent transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl group-hover/thumb:bg-[var(--color-primary)] group-hover/thumb:border-[var(--color-primary)] transition-all">
                                                <PlayCircle size={14} className="fill-white/20 group-hover/thumb:fill-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border transition-all ${tutorial.dificultad === 'PRO' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                                        tutorial.dificultad === 'MEDIO' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20' :
                                            'bg-green-500/20 text-green-500 border-green-500/20'
                                        }`}>
                                        {tutorial.dificultad}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h3 className="text-xs sm:text-sm font-black text-white uppercase italic tracking-tighter leading-tight">
                                            {tutorial.titulo}
                                        </h3>
                                        {tutorial.videoUrl && (
                                            <Youtube size={12} className="text-red-500 opacity-60 shrink-0" />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        {tutorial.juego?.nombre && (
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                {tutorial.juego.nombre}
                                            </span>
                                        )}
                                        {tutorial.categoria?.nombre && (
                                            <>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[8px] font-black text-[var(--color-primary)]/60 uppercase tracking-widest">
                                                    {tutorial.categoria.nombre}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Stats icons */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <ListChecks size={12} className="text-[var(--color-primary)] opacity-50" />
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                {tutorial.pasos?.length || 0} PASOS
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions vertical stack */}
                                <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => { setEditingTutorial(tutorial); setShowForm(true); }}
                                            className="p-2 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                                            title="Editar Tutorial"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleBoolean(tutorial.id, 'destacado', tutorial.destacado)}
                                            className={`p-2 rounded-xl transition-all border ${tutorial.destacado ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-lg shadow-yellow-500/10' : 'bg-white/5 text-white/20 border-transparent hover:text-white'}`}
                                            title="Destacar"
                                        >
                                            <Star size={14} fill={tutorial.destacado ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => handleToggleBoolean(tutorial.id, 'activo', tutorial.activo)}
                                            className={`p-2 rounded-xl transition-all border ${tutorial.activo ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                            title={tutorial.activo ? "Ocultar" : "Mostrar"}
                                        >
                                            {tutorial.activo ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tutorial.id, tutorial.titulo)}
                                            className="p-2 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
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
                            <TutorialForm
                                title={editingTutorial ? 'Editar Tutorial' : 'Crear Nuevo Tutorial'}
                                initialData={editingTutorial ? {
                                    titulo: editingTutorial.titulo,
                                    slug: editingTutorial.slug,
                                    videoUrl: editingTutorial.videoUrl,
                                    descripcion: editingTutorial.descripcion,
                                    image: editingTutorial.image,
                                    dificultad: editingTutorial.dificultad,
                                    juegoId: editingTutorial.juegoId,
                                    categoriaId: editingTutorial.categoriaId,
                                    destacado: editingTutorial.destacado,
                                    pasos: editingTutorial.pasos
                                } : undefined}
                                juegos={juegos}
                                categorias={categorias}
                                onSubmit={handleSave}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingTutorial(null);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
