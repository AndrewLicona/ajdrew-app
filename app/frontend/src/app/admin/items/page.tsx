'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    Search,
    Star,
    Users,
    Tag,
    ChevronDown,
    Filter,
    ArrowUpDown,
    CheckSquare,
    Square,
    Trash,
    Loader2,
    X
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemForm } from '@/modules/items/components/ItemForm';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';

interface Item {
    id: string;
    nombre: string;
    image: string;
    categoriaId: string;
    categoria?: { id: string, nombre: string };
    averageRating: number;
    ratingCount: number;
}

interface Categoria {
    id: string;
    nombre: string;
}

export default function ItemsAdminPage() {
    // Data State
    const [items, setItems] = useState<Item[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    // UI State
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const [limit] = useState(24);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
            setCategorias(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchItems = useCallback(async (isLoadMore = false) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy,
                order,
                ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
                ...(debouncedSearch && { search: debouncedSearch })
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables?${query}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'API Error');

            const loadedItems = Array.isArray(data.items) ? data.items : [];
            const loadedTotal = typeof data.total === 'number' ? data.total : 0;

            if (isLoadMore) {
                setItems(prev => [...prev, ...loadedItems]);
            } else {
                setItems(loadedItems);
                setTotalItems(loadedTotal);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, order, selectedCategory, debouncedSearch]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPage(1); // Reset to first page on filter change
    }, [selectedCategory, debouncedSearch, sortBy, order]);

    useEffect(() => {
        fetchItems(page > 1);
    }, [page, sortBy, order, selectedCategory, debouncedSearch, fetchItems]);

    const handleSave = async (data: any) => {
        try {
            const url = editingItem
                ? `${process.env.NEXT_PUBLIC_API_URL}/items-calificables/${editingItem.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/items-calificables`;

            const method = editingItem ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire({ title: '¡Guardado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                setShowForm(false);
                setEditingItem(null);
                setPage(1);
                fetchItems();
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar.', 'error');
        }
    };

    const handleDelete = async (id: string, nombre: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar?',
            text: `Confirmas eliminar "${nombre}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            background: '#0a0f0a',
            color: '#fff',
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchItems();
                Swal.fire('Eliminado', '', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: `¿Eliminar ${selectedItems.length} ítems?`,
            text: "Esta acción eliminará todos los ítems seleccionados de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar lote',
            background: '#0a0f0a',
            color: '#fff',
        });

        if (result.isConfirmed) {
            try {
                // In a production environment, you'd have a bulk delete endpoint.
                // For now, we simulate with individual calls to stay compatible with current backend logic.
                await Promise.all(selectedItems.map(id =>
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    })
                ));
                setSelectedItems([]);
                fetchItems();
                Swal.fire('Eliminados', 'El lote ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Algunos ítems no pudieron eliminarse.', 'error');
            }
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (!items) return;
        if (selectedItems.length === items.length) setSelectedItems([]);
        else setSelectedItems(items.map(i => i.id));
    };

    return (
        <div className="space-y-8 pb-32">
            {/* 1. Premium Header with global stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Ítems de Categoría</h1>
                    <div className="flex justify-center md:justify-start gap-4 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-tighter">Total items: {totalItems}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">Página: {page} de {Math.ceil(totalItems / limit)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mx-auto md:mx-0">
                    <Bt
                        onClick={() => { setEditingItem(null); setShowForm(true); }}
                        icon={<Plus size={18} />}
                        className="shadow-xl shadow-[var(--color-primary)]/20 px-8 py-3 rounded-2xl"
                    >
                        AÑADIR ÍTEM
                    </Bt>
                </div>
            </div>

            {/* 2. Advanced Controls (Search, Sort, Bulk) */}
            <div className="bg-[var(--color-card)] p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4 md:space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                                <X size={16} />
                            </button>
                        )}
                        <Input
                            placeholder="Buscar por nombre o categoría..."
                            className="pl-12 h-14 bg-black/20 border-white/5 rounded-2xl focus:ring-[var(--color-primary)]/20 text-center md:text-left"
                            value={searchTerm}
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Selector (Searchable style) */}
                    <div className="relative w-full lg:w-72">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] appearance-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer outline-none shadow-inner"
                        >
                            <option value="all" className="bg-[#111] text-white">Todas las Categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#111] text-white">{cat.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                    </div>

                    {/* Sorting */}
                    <div className="relative w-full lg:w-48">
                        <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <select
                            value={`${sortBy}-${order}`}
                            onChange={(e) => {
                                const [newSort, newOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                                setSortBy(newSort);
                                setOrder(newOrder);
                            }}
                            className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer outline-none shadow-inner"
                        >
                            <option value="createdAt-desc" className="bg-[#111] text-white">Recientes</option>
                            <option value="nombre-asc" className="bg-[#111] text-white">Nombre A-Z</option>
                            <option value="averageRating-desc" className="bg-[#111] text-white">Mejor Valorados</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedItems.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex items-center justify-between p-4 bg-[var(--color-primary)]/10 rounded-2xl border border-[var(--color-primary)]/20 overflow-hidden"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                                    {selectedItems.length} seleccionados
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedItems([])}
                                    className="px-4 py-2 text-[8px] font-black text-white/40 hover:text-white uppercase transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-[8px] font-black uppercase rounded-lg shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                                >
                                    <Trash size={12} /> Eliminar Lote
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Result Grid: Compact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Header for the grid (Select All) */}
                <div className="col-span-full flex items-center justify-between mb-2 px-4">
                    <button
                        onClick={selectAll}
                        className="flex items-center gap-2 text-[9px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
                    >
                        {(selectedItems.length === (items?.length || 0)) && (items?.length || 0) > 0 ? <CheckSquare size={14} className="text-[var(--color-primary)]" /> : <Square size={14} />}
                        {(selectedItems.length === (items?.length || 0)) && (items?.length || 0) > 0 ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                    </button>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{(items?.length || 0)} mostrados</span>
                </div>

                <AnimatePresence mode="popLayout">
                    {(items?.length || 0) === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full py-20 text-center opacity-20 italic"
                        >
                            No se encontraron ítems para estos filtros.
                        </motion.div>
                    )}

                    {items?.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                                layout: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className={`bg-[var(--color-card)] rounded-2xl border transition-all p-3 flex items-center gap-4 group relative ${selectedItems.includes(item.id) ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30' : 'border-white/5 hover:border-[var(--color-primary)]/20 shadow-lg'
                                }`}
                        >
                            {/* Selector checkbox */}
                            <button
                                onClick={() => toggleSelect(item.id)}
                                className={`absolute -top-1 -left-1 z-10 p-1.5 rounded-lg border transition-all ${selectedItems.includes(item.id) ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg' : 'bg-black/60 border-white/10 text-white/20 opacity-0 group-hover:opacity-100'
                                    }`}
                            >
                                {selectedItems.includes(item.id) ? <CheckSquare size={12} /> : <Square size={12} />}
                            </button>

                            {/* Thumbnail */}
                            <div className="w-16 h-16 shrink-0 relative bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                <Image
                                    src={item.image || '/placeholder.png'}
                                    alt={item.nombre}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Middle Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-black text-white uppercase italic tracking-tighter truncate mb-1">
                                    {item.nombre}
                                </h3>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Tag size={10} className="text-[var(--color-primary)] opacity-40" />
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[2px] truncate">
                                        {item.categoria?.nombre || 'General'}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={12} className="text-yellow-500/80" />
                                        <span className="text-[10px] font-black text-white/50">{item.averageRating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={12} className="text-blue-400 opacity-60" />
                                        <span className="text-[10px] font-black text-white/50">{item.ratingCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1.5 border-l border-white/5 pl-3 shrink-0">
                                <button
                                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                                    className="flex items-center justify-between gap-3 px-2 py-1.5 bg-white/5 text-white/30 hover:text-white hover:bg-[var(--color-primary)]/20 rounded-lg transition-all border border-transparent hover:border-[var(--color-primary)]/30 group/btn"
                                >
                                    <span className="text-[7px] font-black uppercase tracking-widest">EDITAR</span>
                                    <Edit2 size={12} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.nombre)}
                                    className="flex items-center justify-between gap-3 px-2 py-1.5 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30 group/btn"
                                >
                                    <span className="text-[7px] font-black uppercase tracking-widest">ELIM</span>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination / Load More */}
            {items.length < totalItems && (
                <div className="flex justify-center pt-10">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        className="flex items-center gap-2 px-10 py-4 bg-white/5 hover:bg-white/10 text-[var(--color-primary)] font-black text-[10px] uppercase tracking-[4px] rounded-2xl border border-white/5 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Cargar más Ítems'}
                    </button>
                </div>
            )}

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
                            <ItemForm
                                title={editingItem ? 'Editar Ítem' : 'Nuevo Ítem'}
                                initialData={editingItem ? {
                                    nombre: editingItem.nombre,
                                    image: editingItem.image,
                                    categoriaId: editingItem.categoriaId
                                } : undefined}
                                categories={categorias}
                                onSubmit={handleSave}
                                onCancel={() => { setShowForm(false); setEditingItem(null); }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
