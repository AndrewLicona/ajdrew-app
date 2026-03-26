'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, Edit2, Trash2, ListOrdered, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bt } from '@/shared/components/atoms/Button';
import { TablaCalificacionForm } from '@/modules/tablas-calificacion/components/TablaCalificacionForm';

interface TablaCalificacion {
    id: string;
    nombre: string;
    slug: string;
    image: string | null;
    estado: string;
    juegoId: string;
    categoriaId: string | null;
    juego: { nombre: string; id: string };
    categoria: { nombre: string; id: string } | null;
    items?: any[];
    _count?: { items: number };
}

interface Juego {
    id: string;
    nombre: string;
}

function getImgSrc(img: string | null): string | null {
    if (!img) return null;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    if (img.startsWith('data:')) return img;
    return `data:image/png;base64,${img}`;
}

export default function TablasCalificacionesAdminPage() {
    const [tablas, setTablas] = useState<TablaCalificacion[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTabla, setEditingTabla] = useState<TablaCalificacion | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [juegosRes, tablasRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion`)
            ]);
            setJuegos(await juegosRes.json());
            setTablas(await tablasRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (data: any) => {
        try {
            const payload = { ...data };
            if (!payload.categoriaId) delete payload.categoriaId;
            const url = editingTabla
                ? `${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion/${editingTabla.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion`;
            const method = editingTabla ? 'PATCH' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                Swal.fire({ title: '¡Guardado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                setShowForm(false);
                setEditingTabla(null);
                fetchData();
            } else {
                const err = await response.json();
                Swal.fire('Error', err.message || 'No se pudo guardar la tabla', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar Tabla?',
            text: `Confirmas eliminar la tabla "${name}". Los ítems globales NO se borrarán.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            background: '#0a0f0a',
            color: '#fff',
        });
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) { Swal.fire('Eliminada', '', 'success'); fetchData(); }
                else Swal.fire('Error', 'No se pudo eliminar.', 'error');
            } catch (error) { Swal.fire('Error', 'Error de conexión.', 'error'); }
        }
    };

    const handleEditClick = async (tabla: TablaCalificacion) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tablas-calificacion/${tabla.slug}`);
            if (res.ok) {
                const detailed = await res.json();
                const itemIds = detailed.items ? detailed.items.map((ti: any) => ti.itemId) : [];
                setEditingTabla({ ...detailed, itemsIds: itemIds });
                setShowForm(true);
            }
        } catch (e) { Swal.fire('Error', 'No se pudo cargar el detalle.', 'error'); }
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Tablas de Calificaciones</h1>
                    <p className="text-white/40 text-sm mt-2">Crea tableros personalizados de calificación agrupando ítems.</p>
                </div>
                <Bt
                    onClick={() => { setEditingTabla(null); setShowForm(true); }}
                    icon={<Plus size={18} />}
                    className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl"
                >
                    NUEVA TABLA
                </Bt>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
                </div>
            ) : tablas.length === 0 ? (
                <div className="bg-[var(--color-card)] rounded-[2rem] border border-white/5 p-12 text-center text-white/40">
                    <ListOrdered className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No has creado ninguna Tabla de Calificaciones aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tablas.map((tabla) => {
                        const imgSrc = getImgSrc(tabla.image);
                        return (
                            <div key={tabla.id} className="bg-[var(--color-card)] rounded-3xl border border-white/5 p-6 flex items-start gap-4 shadow-xl hover:border-[var(--color-primary)]/20 transition-all">

                                {/* Thumbnail cuadrado clicable */}
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative">
                                    {imgSrc ? (
                                        <button
                                            onClick={() => setExpandedImage(imgSrc)}
                                            className="w-full h-full block group"
                                            title="Ver imagen generada"
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={tabla.nombre}
                                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 text-white text-[9px] font-black uppercase tracking-wider transition-opacity">VER</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-white/20">
                                            <ListOrdered size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{tabla.nombre}</h3>
                                    <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest mt-1">{tabla.juego.nombre}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-black uppercase text-white/40 border border-white/5">
                                            {tabla._count?.items || 0} Ítems
                                        </span>
                                        {tabla.categoria && (
                                            <span className="px-2 py-1 bg-[var(--color-primary)]/10 rounded text-[9px] font-black uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                                                {tabla.categoria.nombre}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-white/30 truncate mt-2">/{tabla.slug}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEditClick(tabla)}
                                        className="p-3 bg-white/5 hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] text-white/50 rounded-xl transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tabla.id, tabla.nombre)}
                                        className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-white/50 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedImage(null)}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/92 backdrop-blur-sm cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.88 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.88 }}
                            className="relative max-w-xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={expandedImage} alt="Imagen generada" className="w-full rounded-2xl shadow-2xl" />
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
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl"
                        >
                            <TablaCalificacionForm
                                title={editingTabla ? 'Editar Tabla' : 'Nueva Tabla'}
                                initialData={editingTabla ? {
                                    nombre: editingTabla.nombre,
                                    slug: editingTabla.slug,
                                    descripcion: (editingTabla as any).descripcion || '',
                                    image: editingTabla.image || '',
                                    juegoId: editingTabla.juegoId,
                                    categoriaId: editingTabla.categoriaId || '',
                                    itemsIds: (editingTabla as any).itemsIds || []
                                } : undefined}
                                juegos={juegos}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingTabla(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
