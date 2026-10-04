'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

const COOKIE_KEY = 'ajdrew_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Pequeño delay para no competir con el primer paint
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm"
    >
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Cookie size={20} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">
            Usamos cookies esenciales para el funcionamiento de la plataforma.
            Al continuar, aceptas nuestra{' '}
            <Link
              href="/privacidad"
              className="text-[var(--color-primary)] underline underline-offset-2 hover:text-white transition-colors"
            >
              política de privacidad
            </Link>
            .
          </p>
          <button
            onClick={reject}
            aria-label="Cerrar aviso de cookies"
            className="shrink-0 text-white/30 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={reject}
            className="text-xs px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all border border-white/10"
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            className="text-xs px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-all"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
