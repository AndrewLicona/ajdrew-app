'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import Swal from 'sweetalert2';
import { TaskManager } from './TaskManager';
import { CloudinaryUpload } from '@/shared/components/molecules/CloudinaryUpload';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

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
    // Internal fields for date/time picker (not sent to API)
    _date?: string;
    _time?: string;
}

interface SorteoFormProps {
    initialData?: SorteoFormData;
    juegos: Juego[];
    onSubmit: (data: SorteoFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

// Helper: format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

// Helper: format time to HH:MM
const formatTime = (date: Date): string => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Helper: combine date + time to ISO string for API
const combineDateTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return '';
    return `${dateStr}T${timeStr}:00`;
};

// Helper: parse ISO string to date + time parts
const parseDateTime = (isoStr: string) => {
    if (!isoStr) return { date: '', time: '' };
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return { date: '', time: '' };
    return { date: formatDate(d), time: formatTime(d) };
};

export const SorteoForm: React.FC<SorteoFormProps> = ({
    initialData,
    juegos,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<SorteoFormData>(() => {
        if (!initialData) {
            return {
                titulo: '',
                premio: '',
                fechaFin: '',
                juegoId: '',
                numGanadores: 1,
                image: '',
                externalUrl: '',
                tareas: [],
            };
        }
        const { date, time } = parseDateTime(initialData.fechaFin);
        return {
            ...initialData,
            fechaFin: '',
            _date: date,
            _time: time,
        };
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minDate] = useState(() => formatDate(new Date()));
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Sync fechaFin when date or time changes
    useEffect(() => {
        const { _date, _time } = formData;
        if (_date && _time) {
            setFormData(prev => ({ ...prev, fechaFin: combineDateTime(_date, _time) }));
        } else {
            setFormData(prev => ({ ...prev, fechaFin: '' }));
        }
    }, [formData._date, formData._time]);

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
            const cleanedData = {
                ...formData,
                tareas: formData.tareas?.map(({ id, sorteoId, createdAt, updatedAt, ...task }) => task) || [],
            };
            // Remove internal fields
            const { _date, _time, ...submitData } = cleanedData;
            await onSubmit(submitData);
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

    const handleDateChange = (dateStr: string) => {
        setFormData(prev => ({ ...prev, _date: dateStr }));
    };

    const handleTimeChange = (timeStr: string) => {
        setFormData(prev => ({ ...prev, _time: timeStr }));
    };

    const handleDateTimePickerOpen = () => {
        setShowTimePicker(true);
    };

    const handleDateTimePickerClose = () => {
        setShowTimePicker(false);
    };

    // Validation: check if selected datetime is in the past
    const isPast = formData._date && formData._time
        ? new Date(combineDateTime(formData._date, formData._time)) < new Date()
        : false;

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
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide py-2">
                <div>
                    <Label htmlFor="titulo">Título del Sorteo *</Label>
                    <Input
                        id="titulo"
                        name="titulo"
                        data-testid="sorteo-titulo-input"
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
                        data-testid="sorteo-premio-input"
                        value={formData.premio}
                        onChange={handleChange}
                        placeholder="Ej: 50 USD Gift Card"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="fechaFin">Fecha y Hora de Finalización *</Label>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 size-5" />
                                <Input
                                    id="fechaFinDate"
                                    name="_date"
                                    type="date"
                                    min={minDate}
                                    value={formData._date || ''}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    required
                                    className="pl-10"
                                    placeholder="Fecha"
                                />
                            </div>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 size-5" />
                                <Input
                                    id="fechaFinTime"
                                    name="_time"
                                    type="time"
                                    value={formData._time || ''}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    required
                                    className="pl-10"
                                    placeholder="Hora"
                                />
                            </div>
                        </div>
                        <Bt
                            variant="secondary"
                            size="sm"
                            onClick={handleDateTimePickerOpen}
                            className="w-full md:w-auto"
                        >
                            <Calendar className="mr-2 size-4" />
                            Seleccionar fecha y hora completa
                        </Bt>
                        {isPast && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                <AlertCircle className="size-4 flex-shrink-0" />
                                <span>La fecha y hora seleccionada ya pasó</span>
                            </div>
                        )}
                        <p className="text-xs text-white/40">
                            Mínimo: {new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>

                <div>
                    <Label htmlFor="juegoId">Juego Relacionado (Opcional)</Label>
                    <select
                        id="juegoId"
                        name="juegoId"
                        data-testid="sorteo-juego-select"
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
                        data-testid="sorteo-url-input"
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
                        data-testid="sorteo-ganadores-input"
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
