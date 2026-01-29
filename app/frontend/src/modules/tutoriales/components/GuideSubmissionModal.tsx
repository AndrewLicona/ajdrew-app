'use client';

import React, { useState } from 'react';
import { X, Youtube, Gamepad2, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import Swal from 'sweetalert2';

interface GuideSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    juegos: { id: string; nombre: string }[];
}

export default function GuideSubmissionModal({ isOpen, onClose, juegos }: GuideSubmissionModalProps) {
    const [formData, setFormData] = useState<{
        titulo: string;
        videoUrl: string;
        juegoId: string;
        descripcion: string;
        autor?: string;
        autorUrl?: string;
        imageCover?: string;
        pasos?: { titulo: string; descripcion: string; image?: string }[];
    }>({
        titulo: '',
        videoUrl: '',
        juegoId: '',
        descripcion: '',
        autor: '',
        autorUrl: '',
        imageCover: '',
        pasos: []
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/sugerir`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Enviado!',
                    text: 'Tu guía ha sido enviada para revisión. Gracias por contribuir.',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#22c55e'
                });
                onClose();
                setFormData({ titulo: '', videoUrl: '', juegoId: '', descripcion: '' });
            } else {
                throw new Error('Error al enviar');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar tu guía. Inténtalo de nuevo.',
                background: '#1a1a1a',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg bg-[#0d0d0d] border-x-0 border-y-0 md:border border-white/10 rounded-none md:rounded-3xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 overflow-y-auto custom-scrollbar">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-2">
                                <Zap size={12} className="animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Colaboración</span>
                            </div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                Enviar mi <span className="text-[var(--color-primary)]">Guía</span>
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1 opacity-60 font-medium">Ayuda a la comunidad compartiendo tu conocimiento.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Título del Video</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Trucos para subir a Rango Oro"
                                value={formData.titulo}
                                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/20"
                            />
                        </div>

                        {/* YouTube URL */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Link de YouTube</label>
                            <div className="relative">
                                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="url"
                                    required
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.videoUrl}
                                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* Game Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Juego</label>
                            <div className="relative">
                                <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <select
                                    required
                                    value={formData.juegoId}
                                    onChange={e => setFormData({ ...formData, juegoId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#0d0d0d] text-white/50">Selecciona un juego</option>
                                    {juegos.map(j => (
                                        <option key={j.id} value={j.id} className="bg-[#0d0d0d] text-white">
                                            {j.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description (Optional) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Breve Descripción (Opcional)</label>
                            <textarea
                                rows={3}
                                placeholder="Cuéntanos de qué trata tu guía..."
                                value={formData.descripcion}
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/20 resize-none"
                            />
                        </div>

                        {/* Author Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Tu Nombre / Nick</label>
                                <input
                                    type="text"
                                    placeholder="Ej: AJDrew"
                                    value={formData.autor || ''}
                                    onChange={e => setFormData({ ...formData, autor: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Canal / Red Social (Opcional)</label>
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/..."
                                    value={formData.autorUrl || ''}
                                    onChange={e => setFormData({ ...formData, autorUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Imagen de Portada (Opcional)</label>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        id="cover-upload-modal"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                try {
                                                    setLoading(true);
                                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=tutoriales`, {
                                                        method: 'POST',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.url) setFormData(prev => ({ ...prev, imageCover: data.url }));
                                                } catch (error) {
                                                    console.error(error);
                                                    Swal.fire('Error', 'No se pudo subir la imagen', 'error');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('cover-upload-modal')?.click()}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white font-bold transition-all"
                                    >
                                        {formData.imageCover ? 'Cambiar Imagen' : 'Subir Imagen'}
                                    </button>
                                    {formData.imageCover && (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle size={14} />
                                            <span className="text-[10px] uppercase font-black tracking-widest">Imagen Cargada</span>
                                        </div>
                                    )}
                                </div>
                                {formData.imageCover && (
                                    <div className="relative w-full max-w-[200px] aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 group/preview">
                                        <img src={formData.imageCover} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imageCover: '' }))}
                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover/preview:opacity-100 transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Steps Section */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-bold text-white/50 tracking-wider ml-1">Pasos de la Guía (Opcional)</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, pasos: [...(prev.pasos || []), { titulo: '', descripcion: '', image: '' }] }))}
                                    className="text-[10px] uppercase font-black text-[var(--color-primary)] hover:underline"
                                >
                                    + Agregar Paso
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {(formData.pasos || []).map((paso, index) => (
                                    <div key={index} className="bg-white/5 p-3 rounded-xl border border-white/5 relative group">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, pasos: prev.pasos?.filter((_, i) => i !== index) }))}
                                            className="absolute top-2 right-2 text-white/20 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-[var(--color-primary)] text-black rounded-full flex items-center justify-center font-black text-[10px]">{index + 1}</div>
                                                <input
                                                    type="text"
                                                    placeholder={`Título del Paso ${index + 1}`}
                                                    value={paso.titulo}
                                                    onChange={e => {
                                                        const newPasos = [...(formData.pasos || [])];
                                                        newPasos[index].titulo = e.target.value;
                                                        setFormData(prev => ({ ...prev, pasos: newPasos }));
                                                    }}
                                                    className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--color-primary)]/30 outline-none placeholder:text-white/20"
                                                />
                                            </div>
                                            <textarea
                                                rows={2}
                                                placeholder="Descripción del paso..."
                                                value={paso.descripcion}
                                                onChange={e => {
                                                    const newPasos = [...(formData.pasos || [])];
                                                    newPasos[index].descripcion = e.target.value;
                                                    setFormData(prev => ({ ...prev, pasos: newPasos }));
                                                }}
                                                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:border-[var(--color-primary)]/30 outline-none placeholder:text-white/20 resize-none"
                                            />

                                            {/* Step Image Upload */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    id={`step-upload-modal-${index}`}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const payload = new FormData();
                                                            payload.append('file', file);
                                                            try {
                                                                setLoading(true);
                                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload?folder=tutoriales`, {
                                                                    method: 'POST',
                                                                    body: payload
                                                                });
                                                                const data = await res.json();
                                                                if (data.url) {
                                                                    const newPasos = [...(formData.pasos || [])];
                                                                    newPasos[index].image = data.url;
                                                                    setFormData(prev => ({ ...prev, pasos: newPasos }));
                                                                }
                                                            } catch (error) {
                                                                console.error(error);
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById(`step-upload-modal-${index}`)?.click()}
                                                    className="px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-[10px] text-white/50 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    {paso.image ? 'Cambiar Imagen' : '+ Agregar Imagen'}
                                                </button>
                                                {paso.image && (
                                                    <div className="h-8 aspect-video bg-black/40 rounded overflow-hidden border border-white/10 relative group/step-preview">
                                                        <img src={paso.image} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPasos = [...(formData.pasos || [])];
                                                                newPasos[index].image = '';
                                                                setFormData(prev => ({ ...prev, pasos: newPasos }));
                                                            }}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/step-preview:opacity-100"
                                                        >
                                                            <X size={10} className="text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(formData.pasos?.length === 0 || !formData.pasos) && (
                                    <div className="text-center py-4 border border-dashed border-white/10 rounded-xl">
                                        <span className="text-xs text-white/30 italic">No has agregado pasos aún</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-primary)] text-black font-black uppercase tracking-widest py-3.5 rounded-xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar para Revisión'
                            )}
                        </button>

                        <div className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                            <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-white/50 leading-relaxed">
                                Tu guía será revisada por un administrador antes de ser publicada. Asegúrate de que el contenido sea original y de calidad.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
