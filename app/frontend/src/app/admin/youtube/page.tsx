'use client';

import React, { useEffect, useState } from 'react';
import { Youtube, Plus, Trash2, CheckCircle, ExternalLink, Info, Play, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSearchParams } from 'next/navigation';

export default function YoutubeAdminPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchAccounts();

        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success) {
            Swal.fire('¡Éxito!', 'Canal de YouTube conectado correctamente.', 'success');
        } else if (error) {
            Swal.fire('Error', `No se pudo conectar: ${error}`, 'error');
        }
    }, [searchParams]);

    const fetchAccounts = async () => {
        const primaryUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const fallbackUrl = 'http://localhost:3000/api';

        const tryFetch = async (url: string) => {
            console.log(`[YouTube] Intentando conectar a: ${url}/admin/social/youtube/accounts`);
            const res = await fetch(`${url}/admin/social/youtube/accounts`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        };

        try {
            let data;
            try {
                data = await tryFetch(primaryUrl);
            } catch (e) {
                if (primaryUrl !== fallbackUrl) {
                    console.warn(`[YouTube] Falló conexión a ${primaryUrl}, intentando fallback...`);
                    data = await tryFetch(fallbackUrl);
                } else {
                    throw e;
                }
            }
            setAccounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching YouTube accounts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/social/youtube/auth-url`);
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo obtener la URL de autenticación.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará la vinculación con este canal de YouTube.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, desconectar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
                await fetch(`${apiUrl}/admin/social/youtube/accounts/${id}`, { method: 'DELETE' });
                Swal.fire('Desconectado', 'Canal desvinculado con éxito.', 'success');
                fetchAccounts();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const handleTest = async (id: string) => {
        try {
            Swal.fire({
                title: 'Subiendo video de prueba...',
                text: 'Esto subirá un video breve a tu canal de YouTube.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/social/youtube/accounts/${id}/test`, { method: 'POST' });
            const data = await res.json();

            if (res.ok && data.success) {
                Swal.fire({
                    title: '¡Enviado!',
                    html: `El video de prueba se ha subido.<br><br><a href="${data.videoUrl}" target="_blank" style="color: #ef4444; font-weight: bold; text-decoration: underline;">Ver Video en YouTube</a>`,
                    icon: 'success'
                });
            } else {
                Swal.fire('Error', data.message || 'No se pudo subir el video.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-card)] p-6 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                        <Youtube size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter uppercase font-serif">YouTube Shorts</h1>
                        <p className="text-sm text-[var(--color-text-secondary)]">Publicación automática de brackets como Shorts/Videos</p>
                    </div>
                </div>
                <button
                    onClick={handleConnect}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                >
                    <Plus size={18} />
                    Vincular Canal
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-20 bg-[var(--color-card)] rounded-3xl border border-white/5">
                            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[var(--color-card)] rounded-3xl border border-white/5 text-center">
                            <Youtube size={48} className="text-white/10 mb-4" />
                            <h3 className="text-lg font-bold text-white/40">No hay canales vinculados</h3>
                            <p className="text-sm text-white/20 mt-2">Vincula tu cuenta de Google para empezar a publicar en YouTube.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {Array.isArray(accounts) && accounts.map((account) => (
                                <div key={account.id} className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-red-500/30 transition-all duration-500 shadow-2xl hover:shadow-red-500/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 font-bold uppercase tracking-widest text-[10px]">
                                            YT
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white uppercase tracking-tight">{account.name}</h3>
                                            <p className="text-xs text-[var(--color-text-secondary)] font-mono opacity-50">Canal: {account.channelId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest mr-4">
                                            <CheckCircle size={12} /> Vinculado
                                        </div>
                                        <button
                                            onClick={() => handleTest(account.id)}
                                            className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-lg"
                                            title="Subir Video de Prueba"
                                        >
                                            <Play size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(account.id)}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                            title="Desvincular"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10 space-y-4 shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                            <Info size={24} />
                        </div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-red-400">Guía de YouTube</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                            Debido a las limitaciones de la API, publicaremos actualizaciones como **YouTube Shorts** o videos breves de 5 segundos.
                        </p>
                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-3">
                            <AlertCircle size={20} className="text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-200/60 leading-tight">
                                <b>Importante:</b> Debes configurar tu ID de Cliente y Secreto en el archivo <code>.env</code> para habilitar el flujo OAuth2.
                            </p>
                        </div>
                        <ul className="space-y-4 mt-6">
                            <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-black text-[10px]">1</div>
                                <span>Crea credenciales OAuth2 en <b>Google Cloud Console</b>.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-black text-[10px]">2</div>
                                <span>Añade <code>http://localhost:3000/api/admin/social/youtube/callback</code> como URI de redirección.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-black text-[10px]">3</div>
                                <span>Habilita la <b>YouTube Data API v3</b>.</span>
                            </li>
                        </ul>
                        <a
                            href="https://console.cloud.google.com/"
                            target="_blank"
                            className="inline-flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                        >
                            Google Cloud Console <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
