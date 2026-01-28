'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                title: '¡Bienvenido!',
                text: `Hola, ${data.user.nombre}`,
                timer: 1500,
                showConfirmButton: false,
            });

            router.push('/admin');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
            <div className="w-full max-w-md p-8 bg-[var(--color-card)] rounded-xl border border-[var(--color-primary)]/30 shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-[var(--color-text)]">Admin Login</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Iniciando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
