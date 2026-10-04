'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * Pagina callback de autenticacion OAuth (Google).
 *
 * El backend redirige aqui con dos parametros:
 *  - token: JWT generado por NestJS
 *  - user: JSON con datos del usuario (id, email, nombre, rol, avatar)
 *
 * Si todo va bien, guarda en localStorage y redirige al home.
 * Si hay error, redirige a /login mostrando el mensaje.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setErrorMessage(errorParam);
      setTimeout(() => router.push(`/login?error=${encodeURIComponent(errorParam)}`), 2000);
      return;
    }

    if (!token || !userParam) {
      setStatus('error');
      setErrorMessage('No se recibio token ni usuario');
      setTimeout(() => router.push('/login?error=no_token'), 2000);
      return;
    }

    try {
      const user = JSON.parse(userParam);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setStatus('success');
      // Redirigir segun rol
      const target = user.rol === 'ADMIN' || user.rol === 'EDITOR' ? '/admin' : '/';
      setTimeout(() => router.push(target), 800);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Error parseando datos del usuario');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-6">
      <div className="bg-[var(--color-card)] border border-white/5 rounded-3xl p-12 max-w-md w-full text-center space-y-6 shadow-2xl">
        {status === 'processing' && (
          <>
            <Loader2
              size={64}
              className="mx-auto text-[var(--color-primary)] animate-spin"
            />
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
              Autenticando con Google
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Espera un momento mientras verificamos tu cuenta...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle
              size={64}
              className="mx-auto text-green-400"
            />
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
              Bienvenido
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Te estamos redirigiendo...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle
              size={64}
              className="mx-auto text-red-400"
            />
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
              No pudimos autenticarte
            </h1>
            <p className="text-sm text-red-400">{errorMessage}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Te estamos redirigiendo al login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}