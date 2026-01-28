'use client';

import React, { useState, useEffect } from 'react';
import {
    Webhook,
    Plus,
    Trash2,
    CheckCircle,
    X,
    ExternalLink,
    Activity,
    Send,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

interface DiscordWebhook {
    id: string;
    name: string;
    webhookUrl: string;
    channelId?: string;
    isActive: boolean;
    lastPublishedAt?: string;
    createdAt: string;
}

export default function DiscordAdminPage() {
    const [webhooks, setWebhooks] = useState<DiscordWebhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const fetchWebhooks = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/discord/webhooks`);
            if (res.ok) {
                const data = await res.json();
                setWebhooks(data);
            }
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/discord/webhooks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, webhookUrl: newUrl }),
            });

            if (res.ok) {
                Swal.fire({
                    title: '¡Webhook Creado!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1a1a1a',
                    color: '#ffffff'
                });
                setNewName('');
                setNewUrl('');
                setShowForm(false);
                fetchWebhooks();
            } else {
                throw new Error('Failed to create');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar el webhook. Verifica la URL.',
                icon: 'error',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar conexión?',
            text: "Se dejarán de enviar notificaciones a este canal.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3d3d3d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1a1a1a',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/discord/webhooks/${id}`, {
                    method: 'DELETE'
                });
                fetchWebhooks();
                Swal.fire({
                    title: 'Eliminado',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#1a1a1a',
                    color: '#ffffff'
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleTest = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/discord/webhooks/${id}/test`, {
                method: 'POST'
            });

            if (res.ok) {
                Swal.fire({
                    title: '¡Mensaje Enviado!',
                    text: 'Revisa el canal de Discord.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1a1a1a',
                    color: '#ffffff'
                });
            } else {
                throw new Error('Test failed');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de prueba',
                text: 'No se pudo enviar el mensaje. Verifica que el webhook siga activo.',
                icon: 'error',
                background: '#1a1a1a',
                color: '#ffffff'
            });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                        <Webhook className="text-[#5865F2]" size={32} />
                        Integración Discord
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Gestiona los canales donde se publicarán automáticamente las fases de torneos.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#5865F2]/20"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Conectar Canal'}
                </button>
            </div>

            {/* Config Form */}
            {showForm && (
                <div className="bg-[#1e1e24] border border-[#5865F2]/20 rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4">Nueva conexión Webhook</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Nombre del Canal (Ref)</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ej: #anuncios-torneos"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Webhook URL</label>
                                <input
                                    type="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://discord.com/api/webhooks/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5865F2] transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {formLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                Guardar Conexión
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Webhooks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {webhooks.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                        <Webhook className="mx-auto text-white/10 mb-4" size={48} />
                        <p className="text-white/40 font-medium">No hay canales conectados aún.</p>
                    </div>
                ) : (
                    webhooks.map((webhook) => (
                        <div key={webhook.id} className="bg-[#1e1e24] border border-white/5 p-5 rounded-2xl group hover:border-[#5865F2]/40 transition-all shadow-lg hover:shadow-[#5865F2]/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#5865F2]/10 rounded-full flex items-center justify-center text-[#5865F2]">
                                        <Webhook size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{webhook.name}</h4>
                                        <span className="text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full inline-block mt-1">Activo</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleTest(webhook.id)}
                                        className="p-2 text-white/40 hover:text-[#5865F2] hover:bg-[#5865F2]/10 rounded-lg transition-colors"
                                        title="Enviar prueba"
                                    >
                                        <Send size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(webhook.id)}
                                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/5 pt-3 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Activity size={12} />
                                    <span>Última publicación:</span>
                                </div>
                                <span className="font-mono">{webhook.lastPublishedAt ? new Date(webhook.lastPublishedAt).toLocaleDateString() : 'Nunca'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
