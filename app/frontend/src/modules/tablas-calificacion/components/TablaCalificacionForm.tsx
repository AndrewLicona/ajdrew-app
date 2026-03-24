'use client';

import React, { useState, useEffect } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { CloudinaryUpload } from '@/shared/components/molecules/CloudinaryUpload';

interface Juego {
    id: string;
    nombre: string;
}

interface Item {
    id: string;
    nombre: string;
    image?: string;
}

interface TablaFormData {
    nombre: string;
    slug: string;
    descripcion: string;
    image: string;
    juegoId: string;
    categoriaId?: string;
    itemsIds: string[];
}

interface TablaCalificacionFormProps {
    initialData?: TablaFormData;
    juegos: Juego[];
    onSubmit: (data: TablaFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const TablaCalificacionForm: React.FC<TablaCalificacionFormProps> = ({
    initialData,
    juegos,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<TablaFormData>(initialData || {
        nombre: '',
        slug: '',
        descripcion: '',
        image: '',
        juegoId: '',
        categoriaId: '',
        itemsIds: [],
    });
    
    const [categories, setCategories] = useState<{ id: string, nombre: string, tipo: string }[]>([]);
    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    // Fetch items when juegoId changes
    useEffect(() => {
        if (!formData.juegoId) return;

        const fetchItems = async () => {
            setLoadingItems(true);
            try {
                // Fetch categories and items in parallel
                const [resCats, resAllItems] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?juegoId=${formData.juegoId}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/items-calificables?juegoId=${formData.juegoId}&limit=500`)
                ]);

                const catsData = await resCats.json();
                const itemsData = await resAllItems.json();

                if (Array.isArray(catsData)) {
                    const rankingCategories = catsData.filter((cat: any) =>
                        ['calificacion', 'ranking', 'votacion'].includes(cat.tipo?.toLowerCase())
                    );
                    setCategories(rankingCategories);
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

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'nombre' && !initialData) {
                newData.slug = generateSlug(value);
            }
            if (name === 'juegoId') {
                newData.categoriaId = '';
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
                return { ...prev, itemsIds: [...currentIds, itemId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre.trim()) {
            setError('El nombre de la tabla es obligatorio.');
            return;
        }
        if (!formData.juegoId) {
            setError('Debes seleccionar un juego.');
            return;
        }
        if (formData.itemsIds.length === 0) {
            setError('Debes seleccionar al menos un participante para la tabla.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar la tabla.');
        } finally {
            setLoading(false);
        }
    };

    const filteredBySearch = availableItems.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let filteredItems = filteredBySearch;
    if (showSelectedOnly) {
        filteredItems = filteredItems.filter(item => formData.itemsIds.includes(item.id));
    }

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
                    <Bt type="submit" loading={loading} disabled={!formData.nombre || formData.itemsIds.length === 0}>
                        Guardar Tabla ({formData.itemsIds.length} Ítems)
                    </Bt>
                </>
            }
        >
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 md:pr-4 scrollbar-hide py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="nombre">Nombre de la Tabla *</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Mejores Armas 2026"
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
                            placeholder="ej: mejores-armas-2026"
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
                        <Label htmlFor="categoriaId">Categoría de Sección (Opcional)</Label>
                        <select
                            id="categoriaId"
                            name="categoriaId"
                            value={formData.categoriaId || ''}
                            onChange={handleChange}
                            disabled={!formData.juegoId}
                            className={`w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all disabled:opacity-40`}
                        >
                            <option value="">-- Sin Categoría Específica --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-900">
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                    <textarea 
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion || ''}
                        onChange={handleChange}
                        className="w-full min-h-24 p-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm"
                        placeholder="Descripción de lo que se va a calificar aquí..."
                    ></textarea>
                </div>
                
                <div className="space-y-1">
                    <Label>Imagen Promocional (Opcional)</Label>
                    <CloudinaryUpload 
                        folder="tablas"
                        label=""
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({...prev, image: url}))}
                    />
                </div>

                {/* Item Selection Area */}
                <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-col flex-wrap justify-between items-start sm:items-center gap-3 mb-4">
                        <Label className="uppercase tracking-widest text-[var(--color-text-secondary)]">Participantes ({formData.itemsIds.length})</Label>

                        <div className="flex items-center gap-2">
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
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-2 text-white/40" size={12} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    {!formData.juegoId ? (
                        <p className="text-sm text-white/40 italic text-center py-8">Selecciona un juego primero para cargar los participantes.</p>
                    ) : loadingItems ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <Loader2 className="text-[var(--color-primary)] animate-spin" size={24} />
                            <p className="text-xs text-white/40 italic">Cargando ítems...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto pr-1 no-scrollbar p-2 bg-black/20 rounded-xl border border-white/5">
                            {filteredItems.map(item => {
                                const isSelected = formData.itemsIds.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={`cursor-pointer group/item rounded-xl p-2 border transition-all flex flex-col items-center gap-2 text-center relative h-32 ${isSelected
                                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                            : 'bg-black/40 border-white/5 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5'
                                            }`}
                                    >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5">
                                            <Image
                                                src={item.image || '/LOGO-AJDREW.png'}
                                                alt={item.nombre}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-white leading-tight line-clamp-2 w-full uppercase italic px-1">{item.nombre}</span>

                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"></div>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-xs text-white/30 italic">No hay ítems registrados bajo este juego. ¡Agrega tus ítems en la tabla general primero!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </FormTemplate>
    );
};
