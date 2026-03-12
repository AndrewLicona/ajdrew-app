'use client';

import React, { useState, useEffect } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import { CloudinaryUpload } from '@/shared/components/molecules/CloudinaryUpload';

interface Category {
    id: string;
    nombre: string;
}

interface ItemFormData {
    nombre: string;
    image: string;
    categoriaId: string;
}

interface ItemFormProps {
    initialData?: ItemFormData;
    categories: Category[];
    onSubmit: (data: ItemFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const ItemForm: React.FC<ItemFormProps> = ({
    initialData,
    categories,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<ItemFormData>(initialData || {
        nombre: '',
        image: '',
        categoriaId: categories.length > 0 ? categories[0].id : '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize category if not set and categories available
    useEffect(() => {
        if (!formData.categoriaId && categories.length > 0) {
            setFormData(prev => ({ ...prev, categoriaId: categories[0].id }));
        }
    }, [categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio.');
            return;
        }
        if (!formData.categoriaId) {
            setError('Debes seleccionar una categoría.');
            return;
        }
        if (!formData.image) {
            setError('La imagen es obligatoria.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el ítem.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                    <Bt type="submit" loading={loading} disabled={!formData.nombre || !formData.image || !formData.categoriaId}>
                        Guardar Ítem
                    </Bt>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="nombre">Nombre del Ítem *</Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        data-testid="item-nombre-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Messi, Real Madrid, etc."
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="categoriaId">Categoría *</Label>
                    <select
                        id="categoriaId"
                        name="categoriaId"
                        data-testid="item-categoria-select"
                        value={formData.categoriaId}
                        onChange={handleChange}
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-white/20"
                        required
                    >
                        <option value="" disabled>Seleccionar Categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-gray-900">
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pt-2">
                    <Label>Imagen *</Label>
                    <CloudinaryUpload
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        label=""
                        folder="items"
                    />
                    {!formData.image && <p className="text-[10px] text-[var(--color-danger)] mt-1 italic">La imagen es obligatoria.</p>}
                </div>
            </div>
        </FormTemplate>
    );
};
