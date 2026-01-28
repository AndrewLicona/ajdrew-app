'use client';

import React, { useState, useEffect } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import Swal from 'sweetalert2';
import { TaskManager } from './TaskManager';
import { CloudinaryUpload } from '@/shared/components/molecules/CloudinaryUpload';

interface Juego {
    id: string;
    nombre: string;
}

interface SorteoFormData {
    titulo: string;
    premio: string;
    fechaFin: string;
    juegoId: string;
    numGanadores: number;
    image?: string;
    externalUrl?: string;
    tareas?: any[];
}

interface SorteoFormProps {
    initialData?: SorteoFormData;
    juegos: Juego[];
    onSubmit: (data: SorteoFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const SorteoForm: React.FC<SorteoFormProps> = ({
    initialData,
    juegos,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<SorteoFormData>(initialData || {
        titulo: '',
        premio: '',
        fechaFin: '',
        juegoId: '',
        numGanadores: 1,
        image: '',
        externalUrl: '',
        tareas: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!formData.titulo.trim() || !formData.premio.trim() || !formData.fechaFin) {
            setError('Todos los campos son obligatorios (excepto Juego).');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Deep clean tasks: remove id and technical fields Prisma doesn't want in nested creates
            const cleanedData = {
                ...formData,
                tareas: formData.tareas?.map(({ id, sorteoId, createdAt, updatedAt, ...task }) => task) || []
            };

            await onSubmit(cleanedData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el sorteo');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'numGanadores' ? parseInt(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
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
                    <Bt type="submit" loading={loading} disabled={!formData.titulo || !formData.premio || !formData.fechaFin}>
                        Guardar Sorteo
                    </Bt>
                </>
            }
        >
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 scrollbar-hide py-2">
                <div>
                    <Label htmlFor="titulo">Título del Sorteo *</Label>
                    <Input
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        placeholder="Ej: Sorteo de Navidad"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="premio">Premio *</Label>
                    <Input
                        id="premio"
                        name="premio"
                        value={formData.premio}
                        onChange={handleChange}
                        placeholder="Ej: 50 USD Gift Card"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="fechaFin">Fecha y Hora de Finalización *</Label>
                    <Input
                        id="fechaFin"
                        name="fechaFin"
                        type="datetime-local"
                        value={formData.fechaFin}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="juegoId">Juego Relacionado (Opcional)</Label>
                    <select
                        id="juegoId"
                        name="juegoId"
                        value={formData.juegoId}
                        onChange={handleChange}
                        className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-white/20"
                    >
                        <option value="">-- General / Ninguno --</option>
                        {juegos.map(juego => (
                            <option key={juego.id} value={juego.id} className="bg-gray-900">
                                {juego.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label htmlFor="externalUrl">Link del Sorteo Externo (YouTube/Twitch)</Label>
                    <Input
                        id="externalUrl"
                        name="externalUrl"
                        value={formData.externalUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/live/..."
                    />
                </div>

                <div>
                    <Label htmlFor="numGanadores">Número de Ganadores *</Label>
                    <Input
                        id="numGanadores"
                        name="numGanadores"
                        type="number"
                        min="1"
                        value={formData.numGanadores}
                        onChange={handleChange}
                        required
                    />
                </div>

                <CloudinaryUpload
                    label="Imagen del Sorteo (Opcional)"
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    folder="sorteos"
                />

                <div className="pt-6 border-t border-white/10">
                    <TaskManager
                        tasks={formData.tareas || []}
                        onChange={(tasks) => setFormData(prev => ({ ...prev, tareas: tasks }))}
                    />
                </div>
            </div>
        </FormTemplate>
    );
};
