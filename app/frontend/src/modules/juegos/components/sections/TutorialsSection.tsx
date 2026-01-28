import React from 'react';
import { Target, Star } from 'lucide-react';
import { Juego } from '../../types/juego';
import Link from 'next/link';

interface TutorialsSectionProps {
    juego: Juego;
    activeTab: string;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({ juego, activeTab }) => {
    const [difficulty, setDifficulty] = React.useState<string>('ALL');

    if (!juego.tutoriales || juego.tutoriales.length === 0) return null;

    const isAllTab = activeTab === 'all';

    // Filter tutorials based on selected difficulty
    const filteredTutorials = difficulty === 'ALL'
        ? juego.tutoriales
        : juego.tutoriales.filter((t: any) => t.dificultad === difficulty);

    const tutorials = isAllTab ? filteredTutorials.slice(0, 3) : filteredTutorials;

    const difficulties = [
        { id: 'ALL', label: 'Todos', color: 'gray' },
        { id: 'FACIL', label: 'Fácil', color: 'green' },
        { id: 'MEDIO', label: 'Medio', color: 'yellow' },
        { id: 'DIFICIL', label: 'Difícil', color: 'red' },
    ];

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
                {/* Header: Title and View All */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-xl">
                            <Target className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tight">
                            Guías y Tutoriales
                        </h2>
                    </div>

                    {isAllTab && (
                        <Link
                            href={`/tutoriales?juegoId=${juego.id}`}
                            className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline whitespace-nowrap"
                        >
                            Ver todo
                        </Link>
                    )}
                </div>

                {/* Centered Difficulty Filters */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-1 px-1">
                        {difficulties.map((diff) => (
                            <button
                                key={diff.id}
                                onClick={() => setDifficulty(diff.id)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 whitespace-nowrap ${difficulty === diff.id
                                    ? diff.id === 'FACIL' ? 'bg-green-500 border-green-400 text-black shadow-lg shadow-green-500/20' :
                                        diff.id === 'MEDIO' ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20' :
                                            diff.id === 'DIFICIL' ? 'bg-red-500 border-red-400 text-black shadow-lg shadow-red-500/20' :
                                                'bg-white border-white text-black shadow-lg shadow-white/20'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {diff.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {tutorials.length > 0 ? (
                isAllTab ? (
                    /* Mobile: Horizontal Scroll */
                    <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                            {tutorials.map((tutorial: any) => (
                                <TutorialCard key={`tutorial-scroll-${tutorial.id}`} tutorial={tutorial} isMobileScroll />
                            ))}
                        </div>
                        {/* Desktop */}
                        <div className="hidden md:contents">
                            {tutorials.map((tutorial: any) => (
                                <TutorialCard key={`tutorial-grid-${tutorial.id}`} tutorial={tutorial} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Vertical Grid (No scroll on mobile) - 4 Columns on Desktop, 2 on Mobile */
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-6 md:px-12">
                        {tutorials.map((tutorial: any) => (
                            <TutorialCard key={`tutorial-full-${tutorial.id}`} tutorial={tutorial} />
                        ))}
                    </div>
                )
            ) : (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-black/20">
                    <p className="text-white/40 font-black uppercase italic tracking-widest">No hay guías disponibles para esta dificultad</p>
                </div>
            )}
        </section>
    );
};

const TutorialCard = ({ tutorial, isMobileScroll }: { tutorial: any, isMobileScroll?: boolean }) => (
    <Link
        href={`/tutoriales/${tutorial.slug}`}
        className={`group relative bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/40 transition-all duration-500 shadow-2xl ${isMobileScroll ? 'w-[calc(100vw-3rem)] snap-center flex-shrink-0' : 'w-full'}`}
    >
        {/* Thumbnail with Visibility Fix */}
        <div className="aspect-video bg-black relative overflow-hidden">
            {tutorial.image ? (
                <>
                    <img
                        src={tutorial.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
                    />
                    <img
                        src={tutorial.image}
                        alt={tutorial.titulo}
                        className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 z-10"
                    />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent flex items-center justify-center">
                    <Target className="text-white/20 group-hover:scale-110 transition-transform duration-700" size={48} />
                </div>
            )}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20">
                <span className={`text-[7px] md:text-[9px] font-black uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border ${tutorial.dificultad === 'FACIL' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    tutorial.dificultad === 'MEDIO' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                        'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {tutorial.dificultad}
                </span>
            </div>
        </div>

        <div className="p-3 md:p-5 space-y-2 md:space-y-3">
            <h3 className="text-xs md:text-base font-black text-white uppercase italic tracking-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 md:line-clamp-2 min-h-[2.5em] md:min-h-0">
                {tutorial.titulo}
            </h3>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[7px] md:text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] truncate mr-2">Clase Magistral</span>
                <span className="text-[8px] md:text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
                    Ver <span className="hidden md:inline">Video</span> <Star size={10} className="fill-[var(--color-primary)]" />
                </span>
            </div>
        </div>
    </Link>
);
