'use client';

import React, { useState, useEffect } from 'react';
import {
    Twitter,
    Plus,
    Trash2,
    CheckCircle,
    X,
    Activity,
    Send,
    Loader2,
    Lock,
    Key
} from 'lucide-react';
import Swal from 'sweetalert2';

interface XAccount {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}

export default function XAdminPage() {
    const [accounts, setAccounts] = useState<XAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '@AJDREWGameplays',
        apiKey: '',
        apiSecret: '',
        accessToken: '',
        accessSecret: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchAccounts = async () => {
        const primaryUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const fallbackUrl = 'http://localhost:3000/api';

        const tryFetch = async (url: string) => {
            const res = await fetch(`${url}/admin/x/accounts`);
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
            console.error('Error fetching X accounts:', error);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/x/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                Swal.fire({
                    title: '¡Cuenta Conectada!',
                    text: 'Las credenciales se han guardado correctamente.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1a1a1a',
                    color: '#ffffff'
                });
                setFormData({
                    name: '@AJDREWGameplays',
                    apiKey: '',
                    apiSecret: '',
                    accessToken: '',
                    accessSecret: ''
                });
                setShowForm(false);
                fetchAccounts();
            } else {
                throw new Error('Failed to connect');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo conectar la cuenta de X. Verifica tus tokens.',
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
            title: '¿Eliminar cuenta de X?',
            text: "Se dejarán de enviar tweets automáticos desde esta cuenta.",
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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
                await fetch(`${apiUrl}/admin/x/accounts/${id}`, {
                    method: 'DELETE'
                });
                fetchAccounts();
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${apiUrl}/admin/x/accounts/${id}/test`, {
                method: 'POST'
            });

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    title: '¡Tweet Enviado!',
                    text: `Revisa el perfil de ${accounts.find(a => a.id === id)?.name}`,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    background: '#1a1a1a',
                    color: '#ffffff'
                });
            } else {
                throw new Error(data.error || 'Test failed');
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error de prueba',
                text: `No se pudo enviar el tweet: ${error.message}`,
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
                        <Twitter className="text-[#1DA1F2]" size={32} />
                        Integración X (Twitter)
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Publica automáticamente actualizaciones de torneos en tu perfil de X.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#1DA1F2]/20"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Conectar Cuenta'}
                </button>
            </div>

            {/* Config Form */}
            {showForm && (
                <div className="bg-[#1e1e24] border border-[#1DA1F2]/20 rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-[#1DA1F2]" />
                        Configurar API de X (V2)
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Nombre / Arroba</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="@TuUsuarioX"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DA1F2] transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">API Key (Consumer Key)</label>
                                <input
                                    type="password"
                                    name="apiKey"
                                    value={formData.apiKey}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DA1F2] transition-colors font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">API Secret (Consumer Secret)</label>
                                <input
                                    type="password"
                                    name="apiSecret"
                                    value={formData.apiSecret}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DA1F2] transition-colors font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Access Token</label>
                                <input
                                    type="password"
                                    name="accessToken"
                                    value={formData.accessToken}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DA1F2] transition-colors font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Access Secret</label>
                                <input
                                    type="password"
                                    name="accessSecret"
                                    value={formData.accessSecret}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DA1F2] transition-colors font-mono"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <p className="text-[10px] text-white/30 italic max-w-md">
                                * Nota: Asegúrate de habilitar los permisos de "Read and Write" en tu panel de desarrollador de X.
                            </p>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {formLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                Guardar Configuración
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Accounts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                        <Twitter className="mx-auto text-white/10 mb-4" size={48} />
                        <p className="text-white/40 font-medium">No hay cuentas de X conectadas.</p>
                    </div>
                ) : (
                    accounts.map((account) => (
                        <div key={account.id} className="bg-[#1e1e24] border border-white/5 p-5 rounded-2xl group hover:border-[#1DA1F2]/40 transition-all shadow-lg hover:shadow-[#1DA1F2]/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#1DA1F2]/10 rounded-full flex items-center justify-center text-[#1DA1F2]">
                                        <Twitter size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{account.name}</h4>
                                        <span className="text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full inline-block mt-1">Ready</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleTest(account.id)}
                                        className="p-2 text-white/40 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-lg transition-colors"
                                        title="Enviar Tweet de Prueba"
                                    >
                                        <Send size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(account.id)}
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
                                    <span>Última actividad:</span>
                                </div>
                                <span className="font-mono">{new Date(account.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
