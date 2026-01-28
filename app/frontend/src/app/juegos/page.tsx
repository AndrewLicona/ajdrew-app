'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, ChevronRight, Search, Zap } from 'lucide-react';

interface Juego {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    image: string;
}

export default function JuegosPage() {
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`)
            .then(res => res.json())
            .then(data => {
                setJuegos(data.filter((j: any) => j.activo));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredJuegos = juegos;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
            {/* Premium Section Header */}
            <div className="flex flex-col items-center gap-4 mb-2 text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 mb-2 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                    <Zap size={12} className="text-[var(--color-primary)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Elite Academy</span>
                </div>
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        EXPLORA LOS <span className="text-[var(--color-primary)]">JUEGOS</span>
                    </h1>
                </div>
            </div>

            {/* Separate Total Section */}
            <div className="flex items-center gap-3 mb-16 animate-in fade-in duration-1000 delay-500">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total: {filteredJuegos.length} Títulos Elite</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto justify-items-center">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 w-full aspect-[4/5] bg-[var(--color-card)] rounded-2xl animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto">
                    {filteredJuegos.map((juego) => (
                        <Link
                            key={juego.id}
                            href={`/juegos/${juego.slug}`}
                            className="group relative flex flex-col w-full aspect-square rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-[var(--color-primary)]/40"
                        >
                            {/* Card Background & Overlay */}
                            <div className="absolute inset-0 bg-[#0a0a0a] transition-all duration-500">
                                <Image
                                    src={juego.image || '/LOGO-AJDREW.png'}
                                    alt={juego.nombre}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 scale-100 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <h2 className="text-base md:text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                                    {juego.nombre}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
