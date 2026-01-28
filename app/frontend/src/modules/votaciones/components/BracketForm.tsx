'use client';

import React, { useState, useEffect } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import { Search, Plus, X, Loader2, Activity, Edit2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudinaryUpload } from '@/shared/components/molecules/CloudinaryUpload';

interface Juego {
    id: string;
    nombre: string;
}

interface Item {
    id: string;
    nombre: string;
    image?: string;
    categoria?: { nombre: string };
}

interface BracketFormData {
    tematica: string;
    slug: string;
    juegoId: string;
    categoriaId?: string;
    itemsIds: string[];
    rondaDuracion?: number;
}

interface BracketFormProps {
    initialData?: BracketFormData;
    juegos: Juego[];
    onSubmit: (data: BracketFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const BracketForm: React.FC<BracketFormProps> = ({
    initialData,
    juegos,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<BracketFormData>(initialData || {
        tematica: '',
        slug: '',
        juegoId: '',
        categoriaId: '',
        itemsIds: [],
        rondaDuracion: 0,
    });
    const [categories, setCategories] = useState<{ id: string, nombre: string, tipo: string }[]>([]);
    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    // Quick Add Item State
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState('');
    const [creatingItem, setCreatingItem] = useState(false);

    // Batch Upload State
    const [batchItems, setBatchItems] = useState<{ id: string, image: string, nombre: string, uploading: boolean }[]>([]);

    // Item Edit State
    const [editingItem, setEditingItem] = useState<{ id: string, nombre: string, image: string } | null>(null);

    // Fetch items when juegoId changes
    useEffect(() => {
        if (!formData.juegoId) return;

        const fetchItems = async () => {
            setLoadingItems(true);
            try {
                // Fetch Categories for the game first
                const resJuego = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos/${formData.juegoId}`);
                if (!resJuego.ok) throw new Error('Error al cargar juego');
                const juegoData = await resJuego.json();

                // Fetch ALL items for the game (global picker)
                const resAllItems = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables?juegoId=${formData.juegoId}`);
                const itemsData = await resAllItems.json();

                if (juegoData.categorias) {
                    const votacionCategories = juegoData.categorias.filter((cat: any) =>
                        cat.tipo.toLowerCase() === 'votacion' || cat.tipo.toLowerCase() === 'bracket'
                    );
                    setCategories(votacionCategories);
                }

                if (Array.isArray(itemsData.items)) {
                    setAvailableItems(itemsData.items);
                } else if (Array.isArray(itemsData)) {
                    setAvailableItems(itemsData);
                }
            } catch (err) {
                console.error(err);
                setError('Error al cargar ítems del juego.');
            } finally {
                setLoadingItems(false);
            }
        };

        fetchItems();
    }, [formData.juegoId]);

    const handleUpdateItem = async () => {
        if (!editingItem) return;
        setCreatingItem(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables/${editingItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    nombre: editingItem.nombre,
                    image: editingItem.image
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setAvailableItems(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i));
                setEditingItem(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCreatingItem(false);
        }
    };

    const handleQuickAddItem = async () => {
        if (!newItemName.trim() || !formData.categoriaId) return;

        setCreatingItem(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    nombre: newItemName,
                    image: newItemImage,
                    categoriaId: formData.categoriaId
                })
            });

            if (response.ok) {
                const newItem = await response.json();
                const cat = categories.find(c => c.id === formData.categoriaId);
                const enrichedItem = { ...newItem, categoria: cat };

                setAvailableItems(prev => [enrichedItem, ...prev]);
                setFormData(prev => ({
                    ...prev,
                    itemsIds: [...prev.itemsIds, newItem.id]
                }));

                // Reset quick add form
                setNewItemName('');
                setNewItemImage('');
                setShowQuickAdd(false);
            } else {
                setError('No se pudo crear el ítem personalizado.');
            }
        } catch (e) {
            console.error(e);
            setError('Error de red al crear el ítem.');
        } finally {
            setCreatingItem(false);
        }
    };

    const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newBatchItems = Array.from(files).map((file, index) => ({
            id: `batch-${Date.now()}-${index}`,
            file,
            image: '',
            nombre: file.name.split('.')[0], // Default name from filename
            uploading: true
        }));

        setBatchItems(prev => [...prev, ...newBatchItems as any]);

        // Upload each file
        for (const item of newBatchItems) {
            const batchFormData = new FormData();
            batchFormData.append('file', (item as any).file);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=items`, {
                    method: 'POST',
                    body: batchFormData,
                });
                const data = await response.json();
                if (data.url) {
                    setBatchItems(prev => prev.map(bi => bi.id === item.id ? { ...bi, image: data.url, uploading: false } : bi));
                }
            } catch (error) {
                console.error('Error uploading batch file:', error);
                setBatchItems(prev => prev.map(bi => bi.id === item.id ? { ...bi, uploading: false } : bi));
            }
        }
    };

    const handleSaveBatchItems = async () => {
        if (!formData.categoriaId) return;

        setCreatingItem(true);
        const createdIds: string[] = [];
        const newAvailableItems: Item[] = [];

        try {
            for (const item of batchItems) {
                if (!item.nombre.trim() || item.uploading || !item.image) continue;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        nombre: item.nombre,
                        image: item.image,
                        categoriaId: formData.categoriaId
                    })
                });

                if (response.ok) {
                    const newItem = await response.json();
                    createdIds.push(newItem.id);
                    const cat = categories.find(c => c.id === formData.categoriaId);
                    newAvailableItems.push({ ...newItem, categoria: cat });
                }
            }

            setAvailableItems(prev => [...newAvailableItems, ...prev]);
            setFormData(prev => ({
                ...prev,
                itemsIds: [...prev.itemsIds, ...createdIds].slice(0, 16) // Max 16
            }));

            // Reset batch
            setBatchItems([]);
            setIsBatchMode(false);
            setShowQuickAdd(false);
        } catch (e) {
            console.error(e);
        } finally {
            setCreatingItem(false);
        }
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const val = name === 'rondaDuracion' ? parseInt(value) || 0 : value;
            const newData = { ...prev, [name]: val };
            if (name === 'tematica' && !initialData) {
                newData.slug = generateSlug(value);
            }
            if (name === 'juegoId') {
                newData.categoriaId = '';
                newData.itemsIds = [];
            }
            if (name === 'categoriaId') {
                newData.itemsIds = [];
            }
            return newData;
        });
    };

    const toggleItem = (itemId: string) => {
        setFormData(prev => {
            const currentIds = prev.itemsIds;
            if (currentIds.includes(itemId)) {
                return { ...prev, itemsIds: currentIds.filter(id => id !== itemId) };
            } else {
                if (currentIds.length >= 16) return prev;
                return { ...prev, itemsIds: [...currentIds, itemId] };
            }
        });
    };

    const handleBulkSelect = (count: number) => {
        const availableFiltered = filteredItems.map(i => i.id);
        const newSelection = availableFiltered.slice(0, count);
        setFormData(prev => ({
            ...prev,
            itemsIds: newSelection
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tematica.trim()) {
            setError('La temática es obligatoria.');
            return;
        }
        if (!formData.juegoId) {
            setError('Debes seleccionar un juego.');
            return;
        }
        const allowedSizes = [2, 4, 8, 16];
        if (!allowedSizes.includes(formData.itemsIds.length)) {
            setError('El número de participantes debe ser exactamente 2, 4, 8 o 16.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el bracket.');
        } finally {
            setLoading(false);
        }
    };

    const filteredBySearch = availableItems.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let filteredItems = formData.categoriaId
        ? filteredBySearch.filter(item => (item as any).categoriaId === formData.categoriaId || (item as any).categoria?.id === formData.categoriaId)
        : filteredBySearch;

    if (showSelectedOnly) {
        filteredItems = filteredItems.filter(item => formData.itemsIds.includes(item.id));
    }

    const allowedSizes = [2, 4, 8, 16];
    const isCountValid = allowedSizes.includes(formData.itemsIds.length);

    return (
        <FormTemplate
            title={title}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            className="w-full max-w-none shadow-2xl border border-white/5"
            actions={
                <>
                    <Bt variant="secondary" onClick={onCancel} disabled={loading} type="button">
                        Cancelar
                    </Bt>
                    <Bt type="submit" loading={loading} disabled={!formData.tematica || !isCountValid}>
                        Generar Bracket ({formData.itemsIds.length} Ítems)
                    </Bt>
                </>
            }
        >
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 md:pr-4 scrollbar-hide py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="tematica">Temática / Título *</Label>
                        <Input
                            id="tematica"
                            name="tematica"
                            value={formData.tematica}
                            onChange={handleChange}
                            placeholder="Ej: Mejor Delantero 2024"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="ej: mejor-delantero-2024"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="juegoId">Juego Base *</Label>
                        <select
                            id="juegoId"
                            name="juegoId"
                            value={formData.juegoId}
                            onChange={handleChange}
                            className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-white/20"
                            required
                        >
                            <option value="">-- Seleccionar Juego --</option>
                            {juegos.map(juego => (
                                <option key={juego.id} value={juego.id} className="bg-gray-900">
                                    {juego.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="categoriaId">Categoría de Votación *</Label>
                        <select
                            id="categoriaId"
                            name="categoriaId"
                            value={formData.categoriaId}
                            onChange={handleChange}
                            disabled={!formData.juegoId}
                            className={`w-full h-11 bg-black/20 border rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all disabled:opacity-40 ${!formData.categoriaId ? 'border-yellow-500/30' : 'border-white/10'}`}
                            required
                        >
                            <option value="">-- Seleccionar Categoría --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-900">
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && formData.juegoId && (
                            <p className="text-[10px] text-yellow-500 mt-1 italic">Este juego no tiene categorías de tipo "Votación".</p>
                        )}
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <Label htmlFor="rondaDuracion" className="flex items-center gap-2">
                        <Activity size={14} className="text-[var(--color-primary)]" />
                        DURACIÓN AUTOMÁTICA (HORAS)
                    </Label>
                    <Input
                        id="rondaDuracion"
                        name="rondaDuracion"
                        type="number"
                        min="0"
                        value={formData.rondaDuracion}
                        onChange={handleChange}
                        placeholder="Ej: 24 (0 para avance manual)"
                        className="h-10 mt-1"
                    />
                    <p className="text-[9px] text-white/30 mt-1.5 italic leading-tight">
                        Define cada cuánto se avanzará de ronda. <span className="text-[var(--color-primary)]/60">0 = El administrador debe avanzar manualmente.</span>
                    </p>
                </div>

                {/* Item Selection Area */}
                <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <Label className="uppercase tracking-widest text-[var(--color-text-secondary)]">Participantes ({formData.itemsIds.length})</Label>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                                className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase italic transition-all border ${showSelectedOnly
                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {showSelectedOnly ? 'Ver Todos' : 'Ver Seleccionados'}
                            </button>
                            <div className="relative w-32">
                                <Search className="absolute left-2 top-2 text-white/40" size={12} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>

                            <Bt
                                size="sm"
                                variant="primary"
                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                icon={showQuickAdd ? <X size={14} /> : <Plus size={14} />}
                                disabled={!formData.categoriaId}
                            >
                                {showQuickAdd ? 'Cerrar' : 'Agregar'}
                            </Bt>
                        </div>
                    </div>

                    {/* Bulk Select Options */}
                    {!showQuickAdd && formData.categoriaId && filteredItems.length > 0 && (
                        <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase italic tracking-tighter">Selección Rápida:</span>
                            <button
                                type="button"
                                onClick={() => handleBulkSelect(8)}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-all uppercase italic"
                            >
                                Auto-seleccionar 8
                            </button>
                            <button
                                type="button"
                                onClick={() => handleBulkSelect(16)}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-all uppercase italic"
                            >
                                Auto-seleccionar 16
                            </button>
                        </div>
                    )}

                    {/* Quick Add Form */}
                    {showQuickAdd && (
                        <div className="mb-6 p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-black text-white uppercase italic tracking-tighter">Gestionar Items Personalizados</h4>
                                <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setIsBatchMode(false)}
                                        className={`px-4 py-2 text-[10px] whitespace-nowrap font-black uppercase italic rounded-lg transition-all ${!isBatchMode ? 'bg-[var(--color-primary)] text-white shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'text-white/40 hover:text-white/60'}`}
                                    >
                                        Uno a Uno
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsBatchMode(true)}
                                        className={`px-4 py-2 text-[10px] whitespace-nowrap font-black uppercase italic rounded-lg transition-all ${isBatchMode ? 'bg-[var(--color-primary)] text-white shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'text-white/40 hover:text-white/60'}`}
                                    >
                                        Carga Masiva
                                    </button>
                                </div>
                            </div>

                            {!isBatchMode ? (
                                <div className="flex flex-col md:flex-row gap-4 items-start animate-in fade-in duration-300">
                                    <div className="flex-1 w-full space-y-3">
                                        <Input
                                            placeholder="Nombre del ítem (ej: Messi Prime)"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                        <CloudinaryUpload
                                            value={newItemImage}
                                            onChange={setNewItemImage}
                                            label="Imagen (Opcional)"
                                            folder="items"
                                        />
                                        <Bt
                                            size="sm"
                                            className="w-full"
                                            onClick={handleQuickAddItem}
                                            loading={creatingItem}
                                            disabled={!newItemName.trim()}
                                        >
                                            Crear y Seleccionar
                                        </Bt>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    {batchItems.length === 0 ? (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-primary)]/20 rounded-xl cursor-pointer hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40 transition-all group">
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <Plus className="w-8 h-8 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors mb-2" />
                                                <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase italic">Seleccionar Varios Archivos</p>
                                                <p className="text-[9px] text-[var(--color-text-secondary)] opacity-50 mt-1 uppercase">Sube todas las imágenes de una vez</p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleBatchFileSelect}
                                            />
                                        </label>
                                    ) : (
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                            {batchItems.map((item, idx) => (
                                                <div key={item.id} className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                                                        {item.uploading ? (
                                                            <div className="flex items-center justify-center h-full">
                                                                <Loader2 size={16} className="text-[var(--color-primary)] animate-spin" />
                                                            </div>
                                                        ) : (
                                                            <Image src={item.image || '/LOGO-AJDREW.png'} alt="Batch" fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Nombre del ítem..."
                                                            value={item.nombre}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setBatchItems(prev => prev.map(bi => bi.id === item.id ? { ...bi, nombre: val } : bi));
                                                            }}
                                                            className="h-8 text-[11px] bg-black/40 border-white/10"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => setBatchItems(prev => prev.filter(bi => bi.id !== item.id))}
                                                        className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="flex gap-2 sticky bottom-0 bg-[var(--color-bg)] pt-2">
                                                <Bt
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1"
                                                    onClick={() => setBatchItems([])}
                                                >
                                                    Limpiar
                                                </Bt>
                                                <Bt
                                                    size="sm"
                                                    className="flex-[2]"
                                                    onClick={handleSaveBatchItems}
                                                    loading={creatingItem}
                                                    disabled={batchItems.some(bi => bi.uploading || !bi.image)}
                                                >
                                                    Guardar {batchItems.length} Items e Incluir
                                                </Bt>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!formData.juegoId ? (
                        <p className="text-sm text-white/40 italic text-center py-8">Selecciona un juego primero.</p>
                    ) : loadingItems ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <Loader2 className="text-[var(--color-primary)] animate-spin" size={24} />
                            <p className="text-xs text-white/40 italic">Cargando ítems...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                            {filteredItems.map(item => {
                                const isSelected = formData.itemsIds.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`group/item rounded-xl p-2 border transition-all flex flex-col items-center gap-2 text-center relative h-32 ${isSelected
                                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                            : 'bg-black/20 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div onClick={() => toggleItem(item.id)} className="cursor-pointer w-full flex flex-col items-center gap-2">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5">
                                                <Image
                                                    src={item.image || '/LOGO-AJDREW.png'}
                                                    alt={item.nombre}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-white leading-tight line-clamp-2 w-full uppercase italic px-1">{item.nombre}</span>
                                        </div>

                                        {/* Quick Edit Overlay */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingItem({ id: item.id, nombre: item.nombre, image: item.image || '' });
                                            }}
                                            className="absolute top-1 left-1 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-[var(--color-primary)]"
                                        >
                                            <Edit2 size={10} />
                                        </button>

                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-xs text-white/30 italic">No hay ítems en esta categoría. {formData.categoriaId && "¡Agrega el primero!"}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-[9px] text-[var(--color-text-secondary)] opacity-60 italic">* El bracket debe tener 2, 4, 8 o 16 participantes.</p>
                        {formData.itemsIds.length > 0 && !isCountValid && (
                            <span className="text-[10px] text-yellow-500 font-bold uppercase italic animate-pulse">
                                Falta {Math.min(...allowedSizes.filter(s => s > formData.itemsIds.length)) - formData.itemsIds.length} para el siguiente tamaño
                            </span>
                        )}
                    </div>
                    {/* Edit Item Modal */}
                    <AnimatePresence>
                        {editingItem && (
                            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#0a0f0a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                                    <h3 className="text-xs font-black text-[var(--color-primary)] uppercase italic tracking-tighter mb-4">Editar Datos del Item</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px]">Nombre del Item</Label>
                                            <Input
                                                value={editingItem.nombre}
                                                onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
                                                className="h-9 text-xs"
                                            />
                                        </div>
                                        <CloudinaryUpload
                                            value={editingItem.image}
                                            onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                                            label="Cambiar Imagen"
                                            folder="items"
                                        />
                                        <div className="flex gap-2 pt-2">
                                            <Bt variant="secondary" className="flex-1" size="sm" onClick={() => setEditingItem(null)}>Cancelar</Bt>
                                            <Bt className="flex-1" size="sm" onClick={handleUpdateItem} loading={creatingItem}>Actualizar</Bt>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </FormTemplate>
    );
};
