'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, Calendar, Trash2, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'EDITOR'
    });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar usuarios', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Usuario creado correctamente', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                setIsModalOpen(false);
                setFormData({ nombre: '', email: '', password: '', rol: 'EDITOR' });
                fetchUsuarios();
            } else {
                const err = await res.json();
                Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Error al crear usuario', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-card)] p-6 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-[var(--color-primary)]/10 rounded-2xl">
                        <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Gestión de Usuarios</h1>
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium">Administra los accesos al panel de control</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--color-primary)]/20"
                >
                    <UserPlus size={18} />
                    Nuevo Usuario
                </button>
            </div>

            <div className="grid gap-4">
                {usuarios.map((user) => (
                    <div
                        key={user.id}
                        className="group bg-[var(--color-card)] p-5 rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                <span className="text-lg font-black text-white">{user.nombre.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    {user.nombre}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${user.rol === 'ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                        {user.rol}
                                    </span>
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">
                                        <Mail size={12} />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">
                                        <Calendar size={12} />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Creación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[var(--color-card)] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Nuevo Usuario</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} className="text-[var(--color-text-secondary)]" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">Email Corporativo</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                                    placeholder="email@ajdrew.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">Contraseña Inicial</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">Rol de Acceso</label>
                                <select
                                    value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition-all font-bold"
                                >
                                    <option value="EDITOR" className="bg-[#1a1a1a]">EDITOR (Contenido)</option>
                                    <option value="ADMIN" className="bg-[#1a1a1a]">ADMIN (Todo)</option>
                                </select>
                            </div>
                            <button
                                disabled={isSaving}
                                type="submit"
                                className="w-full mt-4 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Crear Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
