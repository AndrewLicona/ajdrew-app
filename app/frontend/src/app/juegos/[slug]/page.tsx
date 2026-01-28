'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { JuegoHub } from '@/modules/juegos/components/JuegoHub';
import { Juego } from '@/modules/juegos/types/juego';

export default function JuegoHubPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [juego, setJuego] = useState<Juego | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos/${slug}`);
            if (!response.ok) throw new Error('Juego no encontrado');
            const data = await response.json();
            setJuego(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!juego) return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-white mb-4 italic uppercase">Juego no encontrado</h1>
            <Link href="/juegos" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                Volver al listado
            </Link>
        </div>
    );

    return <JuegoHub juego={juego} />;
}
