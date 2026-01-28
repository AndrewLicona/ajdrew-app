import React from 'react';
import Image from 'next/image';
import { Juego } from '../types/juego';

interface JuegoHeroProps {
    juego: Juego;
}

export const JuegoHero: React.FC<JuegoHeroProps> = ({ juego }) => {
    return (
        <div className="relative h-[65vh] w-full overflow-hidden flex flex-col items-center justify-center">
            <Image
                src={juego.image || '/placeholder-hero.png'}
                alt=""
                fill
                className="object-cover opacity-10 blur-[8px]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 mt-10">
                <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[var(--color-primary)]/20 p-2 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-700 hover:scale-105 hover:border-[var(--color-primary)]/40">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                        <Image
                            src={juego.image || '/placeholder-game.png'}
                            alt={juego.nombre}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="text-center space-y-4 max-w-2xl px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">
                        {juego.nombre}
                    </h1>
                    <p className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium line-clamp-2 md:line-clamp-none max-w-xl mx-auto opacity-70">
                        {juego.descripcion}
                    </p>
                </div>
            </div>
        </div>
    );
};
