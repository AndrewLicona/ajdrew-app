'use client';

import React, { useEffect, useState } from 'react';
import { Instagram, Plus, Trash2, CheckCircle, XCircle, Info, ExternalLink, Send } from 'lucide-react';
import Swal from 'sweetalert2';

export default function InstagramAdminPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '@AJDREWGameplays',
        igAccountId: '',
        pageAccessToken: '',
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        const primaryUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const fallbackUrl = 'http://localhost:3000/api';

        const tryFetch = async (url: string) => {
            const res = await fetch(`${url}/admin/social/meta/instagram/accounts`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        };

        try {
            let data;
            try {
                data = await tryFetch(primaryUrl);
            } catch (e) {
                if (primaryUrl !== fallbackUrl) {
                    data = await tryFetch(fallbackUrl);
                } else {
                    throw e;
                }
            }
            setAccounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching Instagram accounts', error);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/social/meta/instagram/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                Swal.fire('¡Éxito!', 'Cuenta de Instagram conectada correctamente.', 'success');
                setFormData({ name: '@AJDREWGameplays', igAccountId: '', pageAccessToken: '' });
                setShowForm(false);
                fetchAccounts();
            } else {
                Swal.fire('Error', 'No se pudo conectar la cuenta.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará la conexión con esta cuenta de Instagram.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
                await fetch(`${apiUrl}/admin/social/meta/instagram/accounts/${id}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'La cuenta ha sido desconectada.', 'success');
                fetchAccounts();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const handleTest = async (id: string) => {
        try {
            Swal.fire({
                title: 'Enviando prueba...',
                text: 'Esto publicará una foto de prueba en tu Instagram.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/social/meta/instagram/${id}/test`, { method: 'POST' });

            if (res.ok) {
                Swal.fire('¡Enviado!', 'Revisa tu cuenta de Instagram para ver la publicación.', 'success');
            } else {
                const data = await res.json();
                Swal.fire('Error', data.message || 'No se pudo enviar la prueba.', 'error');
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
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
                        <Instagram size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter uppercase font-serif">Instagram Professional</h1>
                        <p className="text-sm text-[var(--color-text-secondary)]">Publicación automática en tus cuentas de Instagram Business</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
                >
                    {showForm ? <Trash2 size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Conectar Instagram'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-20 bg-[var(--color-card)] rounded-3xl border border-white/5">
                            <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[var(--color-card)] rounded-3xl border border-white/5 text-center">
                            <Instagram size={48} className="text-white/10 mb-4" />
                            <h3 className="text-lg font-bold text-white/40">No hay cuentas conectadas</h3>
                            <p className="text-sm text-white/20 mt-2">Conecta una cuenta Business de Instagram para empezar.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {accounts.map((account) => (
                                <div key={account.id} className="group bg-[var(--color-card)] p-6 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all shadow-lg flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {account.name.charAt(account.name.startsWith('@') ? 1 : 0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white uppercase tracking-tight">{account.name}</h3>
                                            <p className="text-xs text-[var(--color-text-secondary)] font-mono opacity-50">IG ID: {account.igAccountId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest mr-4">
                                            <CheckCircle size={12} /> Activo
                                        </div>
                                        <button
                                            onClick={() => handleTest(account.id)}
                                            className="p-3 bg-pink-500/10 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-lg"
                                            title="Enviar Prueba"
                                        >
                                            <Send size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(account.id)}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Guide/Form */}
                <div className="space-y-6">
                    {showForm ? (
                        <div className="bg-[var(--color-card)] p-8 rounded-3xl border border-[var(--color-primary)]/20 shadow-2xl animate-in slide-in-from-right duration-300">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-[var(--color-primary)]" />
                                Nueva Cuenta
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-2 ml-1">Username (con @)</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-2 ml-1">Instagram Business ID</label>
                                    <input
                                        type="text"
                                        placeholder="ej: 178414..."
                                        value={formData.igAccountId}
                                        onChange={(e) => setFormData({ ...formData, igAccountId: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-2 ml-1">Page Access Token (Meta)</label>
                                    <textarea
                                        placeholder="EAA..."
                                        value={formData.pageAccessToken}
                                        onChange={(e) => setFormData({ ...formData, pageAccessToken: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all font-mono min-h-[120px]"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[var(--color-primary)] text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[var(--color-primary)]/20 mt-4 active:scale-95"
                                >
                                    Guardar Configuración
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-pink-500/5 p-8 rounded-3xl border border-pink-500/10 space-y-4 shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4">
                                <Info size={24} />
                            </div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-pink-400">Guía Instagram</h2>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                Instagram requiere que tu cuenta sea <span className="text-pink-400 font-bold">Business</span> y esté vinculada a una Página de Facebook.
                            </p>
                            <ul className="space-y-4 mt-6">
                                <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                    <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 font-black text-[10px]">1</div>
                                    <span>Vincula tu IG a una <b>Página de Facebook</b>.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                    <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 font-black text-[10px]">2</div>
                                    <span>Busca el campo <code>instagram_business_account</code> en la respuesta <code>GET /me/accounts?fields=instagram_business_account,name</code>.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                    <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 font-black text-[10px]">3</div>
                                    <span>Usa un <b>Token de Página</b> con permisos <code>instagram_basic</code> y <code>instagram_content_publish</code>.</span>
                                </li>
                            </ul>
                            <a
                                href="https://developers.facebook.com/docs/instagram-api/guides/content-publishing"
                                target="_blank"
                                className="inline-flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-widest text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                Documentación IG <ExternalLink size={14} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
