'use client';

import React, { useState } from 'react';
import { FormTemplate } from '../templates/FormTemplate';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Bt } from '../atoms/Button';

interface CategoriaFormData {
    nombre: string;
    tipo: string;
    juegoId: string | null;
    activa?: boolean;
}

interface CategoriaFormProps {
    initialData?: CategoriaFormData;
    juegos: { id: string, nombre: string }[];
    onSubmit: (data: CategoriaFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
    initialData,
    juegos,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<CategoriaFormData>(() => {
        if (initialData) {
            return {
                ...initialData,
                tipo: initialData.tipo.toLowerCase()
            };
        }
        return {
            nombre: '',
            tipo: 'calificacion',
            juegoId: null,
            activa: true,
        };
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre.trim()) {
            setError('El nombre de la categoría es obligatorio.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Error al procesar la categoría. Revisa los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'juegoId' ? (value === '' ? null : value) : value
        }));
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
                    <Bt type="submit" loading={loading} disabled={!formData.nombre.trim()}>
                        Guardar Categoría
                    </Bt>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="nombre">Nombre de la Categoría *</Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        data-testid="categoria-nombre-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Personajes, Tutoriales, etc."
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="tipo">Tipo de Categoría *</Label>
                    <select
                        id="tipo"
                        name="tipo"
                        data-testid="categoria-tipo-select"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                        required
                    >
                        <option value="calificacion" className="bg-gray-900 text-white">Calificación / Rankings</option>
                        <option value="votacion" className="bg-gray-900 text-white">Votación / Brackets</option>
                        <option value="tutorial" className="bg-gray-900 text-white">Tutorial</option>
                    </select>
                </div>

                <div>
                    <Label htmlFor="juegoId">Juego Asociado (Opcional)</Label>
                    <select
                        id="juegoId"
                        name="juegoId"
                        data-testid="categoria-juego-select"
                        value={formData.juegoId || ''}
                        onChange={handleChange}
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                    >
                        <option value="" className="bg-gray-900 text-white">🌎 Global (Sin juego específico)</option>
                        {juegos.map(juego => (
                            <option key={juego.id} value={juego.id} className="bg-gray-900 text-white">{juego.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>
        </FormTemplate>
    );
};
