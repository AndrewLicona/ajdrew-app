'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FormTemplate } from '@/shared/components/templates/FormTemplate';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Bt } from '@/shared/components/atoms/Button';
import { Youtube, Info, Plus, Trash2 } from 'lucide-react';

interface Juego {
    id: string;
    nombre: string;
}

interface TutorialFormData {
    titulo: string;
    slug: string;
    videoUrl: string;
    descripcion?: string;
    image?: string;
    dificultad: string;
    juegoId: string;
    categoriaId?: string;
    destacado?: boolean;
    pasos?: {
        orden: number;
        titulo: string;
        descripcion?: string;
        image?: string;
    }[];
}

interface TutorialFormProps {
    initialData?: TutorialFormData & { pasos?: any[] };
    juegos: Juego[];
    categorias: { id: string, nombre: string, tipo: string, juegoId?: string | null }[];
    onSubmit: (data: TutorialFormData) => Promise<void>;
    onCancel: () => void;
    title: string;
}

export const TutorialForm: React.FC<TutorialFormProps> = ({
    initialData,
    juegos,
    categorias,
    onSubmit,
    onCancel,
    title
}) => {
    const [formData, setFormData] = useState<TutorialFormData>(initialData || {
        titulo: '',
        slug: '',
        videoUrl: '',
        descripcion: '',
        image: '',
        dificultad: 'MEDIO',
        juegoId: '',
        categoriaId: '',
        destacado: false,
        pasos: []
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            const newData = { ...prev, [name]: finalValue };
            if (name === 'titulo' && !initialData) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleAddStep = () => {
        const newStep = {
            orden: (formData.pasos?.length || 0) + 1,
            titulo: '',
            descripcion: '',
            image: ''
        };
        setFormData(prev => ({
            ...prev,
            pasos: [...(prev.pasos || []), newStep]
        }));
    };

    const handleRemoveStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            pasos: (prev.pasos || []).filter((_, i) => i !== index).map((s, i) => ({ ...s, orden: i + 1 }))
        }));
    };

    const handleStepChange = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newSteps = [...(prev.pasos || [])];
            newSteps[index] = { ...newSteps[index], [field]: value };
            return { ...prev, pasos: newSteps };
        });
    };

    const handleGenericImageUpload = async (file: File, callback: (url: string) => void) => {
        const payload = new FormData();
        payload.append('file', file);

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=tutoriales`, {
                method: 'POST',
                body: payload,
            });
            const data = await response.json();
            if (data.url) {
                callback(data.url);
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStepImageUpload = async (index: number, file: File) => {
        await handleGenericImageUpload(file, (url) => handleStepChange(index, 'image', url));
    };

    const handleCoverImageUpload = async (file: File) => {
        await handleGenericImageUpload(file, (url) => setFormData(prev => ({ ...prev, image: url })));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.videoUrl.trim() || !formData.juegoId) {
            setError('Todos los campos marcados con * son obligatorios.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar el tutorial.');
        } finally {
            setLoading(false);
        }
    };

    // Get YouTube ID for preview
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(formData.videoUrl);

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
                    <Bt type="submit" loading={loading} disabled={!formData.titulo || !formData.videoUrl || !formData.juegoId}>
                        Guardar Tutorial
                    </Bt>
                </>
            }
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                {/* Basic Info Secction */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest border-l-2 border-[var(--color-primary)] pl-3">Información General</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="titulo">Título del Tutorial *</Label>
                            <Input
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                placeholder="Ej: Guía Suprema de Messi"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug / URL Amigable *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="ej: guia-suprema-messi"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="videoUrl">URL de YouTube *</Label>
                        <div className="relative">
                            <Input
                                id="videoUrl"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                                className="pr-10"
                            />
                            <Youtube className="absolute right-3 top-2.5 text-red-500 opacity-60" size={18} />
                        </div>
                        {videoId && (
                            <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Portada del Tutorial (Thumbnail)</Label>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    id="cover-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleCoverImageUpload(file);
                                    }}
                                />
                                <Bt
                                    variant="secondary"
                                    type="button"
                                    className="h-10 text-[10px] px-4 bg-white/5 border-white/10"
                                    onClick={() => document.getElementById('cover-upload')?.click()}
                                >
                                    {formData.image ? 'Cambiar Portada' : 'Subir Portada'}
                                </Bt>
                                {formData.image && (
                                    <p className="text-[10px] text-green-400 font-bold uppercase truncate max-w-[200px]">¡Imagen Cargada!</p>
                                )}
                            </div>

                            {formData.image && (
                                <div className="relative group/cover-preview w-full max-w-sm">
                                    <div className="rounded-2xl overflow-hidden aspect-video bg-black/40 border border-white/10">
                                        <img src={formData.image} alt="Portada" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover/cover-preview:opacity-100 transition-all shadow-xl"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="descripcion">Descripción / Resumen</Label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-white/20 resize-none text-sm"
                            placeholder="Describe brevemente de qué trata este tutorial..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="juegoId">Juego Relacionado *</Label>
                            <select
                                id="juegoId"
                                name="juegoId"
                                value={formData.juegoId}
                                onChange={handleChange}
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
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
                            <Label htmlFor="categoriaId">Categoría (Opcional)</Label>
                            <select
                                id="categoriaId"
                                name="categoriaId"
                                value={formData.categoriaId || ''}
                                onChange={handleChange}
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                            >
                                <option value="" className="bg-gray-900">-- Sin Categoría --</option>
                                {categorias
                                    .filter(c => c.tipo === 'tutorial' && (!formData.juegoId || c.juegoId === formData.juegoId || !c.juegoId))
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-gray-900">
                                            {cat.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dificultad">Dificultad *</Label>
                            <select
                                id="dificultad"
                                name="dificultad"
                                value={formData.dificultad}
                                onChange={handleChange}
                                className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                                required
                            >
                                <option value="FACIL" className="bg-gray-900">Fácil (Beginner)</option>
                                <option value="MEDIO" className="bg-gray-900">Medio (Intermediate)</option>
                                <option value="PRO" className="bg-gray-900">Pro (Advanced)</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end pb-1">
                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5 h-11 px-4">
                                <input
                                    type="checkbox"
                                    id="destacado"
                                    name="destacado"
                                    checked={formData.destacado}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-white/10 bg-black/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all"
                                />
                                <Label htmlFor="destacado" className="mb-0 cursor-pointer text-[10px] uppercase font-black tracking-widest">Destacado</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest border-l-2 border-yellow-500 pl-3">Guía por Pasos (Manual)</h3>
                        <Bt variant="secondary" onClick={handleAddStep} type="button" className="h-8 text-[9px] px-3">
                            <Plus size={14} className="mr-1" /> Añadir Paso
                        </Bt>
                    </div>

                    <div className="space-y-6">
                        {formData.pasos?.map((step, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/5 relative group/step animate-in fade-in slide-in-from-right-2 duration-300">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStep(index)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/step:opacity-100 transition-opacity shadow-lg"
                                >
                                    <Trash2 size={12} />
                                </button>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center font-black text-[10px]">{index + 1}</div>
                                    <input
                                        type="text"
                                        value={step.titulo}
                                        onChange={(e) => handleStepChange(index, 'titulo', e.target.value)}
                                        placeholder="Título del paso..."
                                        className="flex-1 bg-transparent border-none text-white font-bold text-sm outline-none placeholder:text-white/10"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <textarea
                                        value={step.descripcion}
                                        onChange={(e) => handleStepChange(index, 'descripcion', e.target.value)}
                                        rows={2}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white/70 focus:border-yellow-500/40 outline-none transition-all placeholder:text-white/10 text-xs resize-none"
                                        placeholder="Descripción detallada del paso..."
                                    />

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    value={step.image}
                                                    onChange={(e) => handleStepChange(index, 'image', e.target.value)}
                                                    placeholder="URL de la imagen o..."
                                                    className="h-9 text-[11px] pr-10"
                                                />
                                                <div className="absolute right-3 top-2.5 text-white/20">�</div>
                                            </div>
                                            <input
                                                type="file"
                                                id={`step-upload-${index}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleStepImageUpload(index, file);
                                                }}
                                            />
                                            <Bt
                                                variant="secondary"
                                                type="button"
                                                className="h-9 text-[10px] px-3 whitespace-nowrap bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                                                onClick={() => document.getElementById(`step-upload-${index}`)?.click()}
                                            >
                                                Subir Captura
                                            </Bt>
                                        </div>

                                        {step.image && (
                                            <div className="relative group/img-preview">
                                                <div className="rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/5 max-h-40">
                                                    <img src={step.image} alt="" className="w-full h-full object-cover opacity-60 group-hover/img-preview:opacity-100 transition-opacity" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStepChange(index, 'image', '')}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/img-preview:opacity-100 transition-all shadow-lg"
                                                    title="Eliminar imagen"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!formData.pasos || formData.pasos.length === 0) && (
                            <div className="py-10 border border-dashed border-white/10 rounded-2xl text-center">
                                <p className="text-[11px] text-white/20 italic">No has añadido pasos manuales aún. <br /> El tutorial será solo video.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FormTemplate>
    );
};
