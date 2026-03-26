'use client';

import React, { useState } from 'react';
import { FormTemplate } from '../templates/FormTemplate';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Bt } from '../atoms/Button';
import { CloudinaryUpload } from '../molecules/CloudinaryUpload';

interface JuegoFormData {
    nombre: string;
    slug: string;
    descripcion: string;
    image: string;
}

interface JuegoFormProps {
    initialData?: JuegoFormData;
    onSubmit: (data: JuegoFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const JuegoForm: React.FC<JuegoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<JuegoFormData>(initialData || {
        nombre: '',
        slug: '',
        descripcion: '',
        image: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Name and Image are required
        if (!formData.nombre.trim()) {
            setError('El nombre del juego es obligatorio.');
            return;
        }
        if (!formData.image) {
            setError('Debes subir una portada para el juego.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch {
            setError('Error al procesar el formulario. Revisa los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug if name changes and we are not editing (or user hasn't manualy edited slug yet)
            if (name === 'nombre' && !initialData) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
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
                    <Bt type="submit" loading={loading} disabled={!formData.nombre || !formData.image}>
                        Guardar Juego
                    </Bt>
                </>
            }
        >
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 scrollbar-hide py-2">
                <div>
                    <Label htmlFor="nombre">Nombre del Juego *</Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        data-testid="juego-nombre-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: EAFC 25"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                        id="slug"
                        name="slug"
                        data-testid="juego-slug-input"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="ej: eafc-25"
                        required
                    />
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 opacity-60">Se genera automáticamente del nombre.</p>
                </div>

                <div>
                    <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                    <Input
                        id="descripcion"
                        name="descripcion"
                        data-testid="juego-descripcion-input"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Corta descripción del juego..."
                    />
                </div>

                <div className="pt-2">
                    <Label>Portada del Juego *</Label>
                    <CloudinaryUpload
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        label=""
                        folder="juegos"
                    />
                    {!formData.image && <p className="text-[10px] text-[var(--color-danger)] mt-1 italic">La imagen es obligatoria para guardar.</p>}
                </div>
            </div>
        </FormTemplate>
    );
};
