'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            Swal.fire({
                icon: 'success',
                title: '¡Acceso Concedido!',
                text: `Bienvenido de nuevo, ${data.user.nombre}`,
                timer: 1500,
                showConfirmButton: false,
                background: '#0a0f0a',
                color: '#fff',
                iconColor: 'var(--color-primary)'
            });

            router.push('/admin');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Acceso',
                text: error.message,
                background: '#0a0f0a',
                color: '#fff',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050705] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-1 bg-gradient-to-b from-[var(--color-primary)]/20 to-transparent rounded-[2rem] shadow-2xl relative z-10"
            >
                <div className="bg-[#0a0f0a] rounded-[1.9rem] p-8 md:p-10 border border-white/5">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/5">
                            <Lock className="text-[var(--color-primary)]" size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Panel Admin</h1>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Inicia sesión para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5" data-testid="login-form">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">Email Corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    data-testid="email-input"
                                    aria-label="Correo Electrónico"
                                    placeholder="admin@ajdrew.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--color-primary)]/30 text-white text-sm outline-none transition-all placeholder:text-white/10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    data-testid="password-input"
                                    aria-label="Contraseña"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-[var(--color-primary)]/30 text-white text-sm outline-none transition-all placeholder:text-white/10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    data-testid="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="login-submit-button"
                            className="w-full group mt-8 py-4 bg-[var(--color-primary)] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            {loading ? (
                                'Verificando...'
                            ) : (
                                <>
                                    <span>Acceder al Panel</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
