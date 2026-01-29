'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PlayCircle, Search, Zap, Star, Youtube, ChevronDown, ChevronRight, LayoutGrid, Layers, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Tutorial {
    id: string;
    titulo: string;
    slug: string;
    videoUrl: string;
    descripcion?: string;
    image?: string;
    dificultad: string;
    destacado: boolean;
    activo: boolean;
    juegoId: string;
    categoriaId?: string;
    categoria?: { nombre: string };
    juego?: { nombre: string, image: string };
    createdAt: string;
}

interface Juego {
    id: string;
    nombre: string;
    image?: string;
    slug: string;
}

interface Categoria {
    id: string;
    nombre: string;
}

import GuideSubmissionModal from '@/modules/tutoriales/components/GuideSubmissionModal';

export default function TutorialesPage() {
    const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJuegoId, setSelectedJuegoId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('TODOS');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [resTutorials, resJuegos, resCategorias] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=TUTORIAL`)
            ]);

            const tutorialsData = await resTutorials.json();
            setTutoriales(Array.isArray(tutorialsData) ? tutorialsData : []);
            setJuegos(await resJuegos.json());

            const categoriesData = await resCategorias.json();
            setCategorias(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTutoriales = useMemo(() => {
        return tutoriales.filter(t => {
            const matchesJuego = selectedJuegoId ? t.juegoId === selectedJuegoId : true;
            const matchesCategory = selectedCategoryId ? t.categoriaId === selectedCategoryId : true;
            const matchesDifficulty = selectedDifficulty !== 'TODOS' ? t.dificultad === selectedDifficulty : true;
            const matchesSearch = t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesJuego && matchesCategory && matchesDifficulty && matchesSearch;
        });
    }, [tutoriales, selectedJuegoId, selectedCategoryId, selectedDifficulty, searchQuery]);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-40 px-2 md:px-8 lg:px-12 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30"></div>

            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 mb-1 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                    <Zap size={12} className="text-[var(--color-primary)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Elite Academy</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    CENTRO DE <span className="text-[var(--color-primary)]">ENTRENAMIENTO</span>
                </h1>
                <p className="text-[10px] md:text-sm text-[var(--color-text-secondary)] max-w-lg font-black italic opacity-60 uppercase tracking-tight animate-in fade-in duration-1000 delay-300">
                    Domina las mecánicas avanzadas, estrategias y trucos de tus juegos favoritos de la mano de expertos.
                </p>
            </div>

            {/* Separate Total Section */}
            <div className="flex items-center gap-3 mb-8 animate-in fade-in duration-1000 delay-500">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]/20"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total: {filteredTutoriales.length} Entrenamientos Elite</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]/20"></div>
            </div>

            {/* Filter Bar (Premium Centered Style) */}
            <div className="sticky top-6 z-50 flex flex-col items-center gap-6 mb-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">

                {/* Master Filter Container (Game Selector) */}
                <div className="relative group">
                    <button
                        onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                        className={`flex items-center gap-3 px-8 py-4 bg-[#0a0a0a]/60 backdrop-blur-3xl border rounded-2xl md:rounded-3xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl ${selectedJuegoId ? 'border-[var(--color-primary)]/50 text-white shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-white/10 text-white/40'
                            } hover:border-[var(--color-primary)]/40 hover:scale-105 active:scale-95`}
                    >
                        <Gamepad2 size={16} className={selectedJuegoId ? 'text-[var(--color-primary)]' : 'text-white/20'} />
                        <span>{juegos.find(j => j.id === selectedJuegoId)?.nombre || 'Elegir Juego'}</span>
                        <ChevronDown size={14} className={`transition-transform duration-500 ${isGameDropdownOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-white/20'}`} />
                    </button>

                    <AnimatePresence>
                        {isGameDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-4xl overflow-hidden z-[100] min-w-[280px] p-2"
                            >
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                                    <button
                                        onClick={() => { setSelectedJuegoId(''); setSelectedCategoryId(''); setIsGameDropdownOpen(false); }}
                                        className="w-full px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors border-b border-white/5 text-white/40 mb-2"
                                    >
                                        Todos los Juegos
                                    </button>
                                    <div className="grid grid-cols-1 gap-1">
                                        {juegos.map((j) => {
                                            const count = tutoriales.filter(t => t.juegoId === j.id).length;
                                            return (
                                                <button
                                                    key={j.id}
                                                    onClick={() => { setSelectedJuegoId(j.id); setSelectedCategoryId(''); setIsGameDropdownOpen(false); }}
                                                    className={`w-full px-6 py-4 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-between group/opt ${selectedJuegoId === j.id ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${selectedJuegoId === j.id ? 'bg-[var(--color-primary)] animate-pulse' : 'bg-white/10'}`}></div>
                                                        {j.nombre}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sub-Filters: Difficulty & Category & Search */}
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
                    {/* Difficulty Pill */}
                    <div className="bg-[#0a0a0a]/30 backdrop-blur-3xl border border-white/5 p-1 rounded-full shadow-xl flex items-center shrink-0">
                        {['TODOS', 'FACIL', 'MEDIO', 'DIFICIL'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                className={`px-5 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${selectedDifficulty === diff
                                    ? 'bg-[var(--color-primary)] text-black shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                    : 'text-white/30 hover:text-white/60'
                                    }`}
                            >
                                {diff === 'TODOS' ? 'Nivel' : diff}
                            </button>
                        ))}
                    </div>

                    {/* Compact Bar for Category & Search */}
                    <div className="flex-1 max-w-2xl w-full bg-[#0a0a0a]/20 backdrop-blur-2xl border border-white/5 p-1.5 rounded-full shadow-2xl flex items-center gap-2">
                        {/* Category Select (Refined) */}
                        <div className="relative w-40 md:w-56 shrink-0">
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full appearance-none bg-white/5 border border-white/10 rounded-full px-5 py-2.5 pr-10 text-[var(--color-text)] text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-white/10 hover:border-[var(--color-primary)]/30 transition-all focus:outline-none"
                            >
                                <option value="" className="bg-[#0d0d0d] text-white">Categoría</option>
                                {categorias
                                    .map(cat => ({
                                        ...cat,
                                        count: tutoriales.filter(t => t.categoriaId === cat.id && (selectedJuegoId ? t.juegoId === selectedJuegoId : true)).length
                                    }))
                                    .filter(cat => cat.count > 0)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-[#0d0d0d] text-white">
                                            {cat.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                            <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                        </div>

                        {/* Search Input (Seamless) */}
                        <div className="relative flex-1 group/search">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-hover/search:text-[var(--color-primary)] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar guía..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-2.5 pl-12 pr-6 text-white text-[10px] md:text-xs font-black uppercase tracking-widest outline-none placeholder:text-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid (Torneos-Style Square Cards) */}
            {filteredTutoriales.length === 0 ? (
                <div className="py-40 text-center animate-in fade-in zoom-in-95 duration-1000">
                    <PlayCircle className="mx-auto text-white/5 mb-6 opacity-20" size={80} />
                    <h3 className="text-2xl font-black text-white/40 uppercase italic tracking-tighter">No se encontraron tutoriales</h3>
                    <p className="text-[var(--color-text-secondary)] mt-2 font-black uppercase text-[10px] opacity-40">Intenta cambiar el filtro o la búsqueda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                    {filteredTutoriales.map((tutorial, idx) => {
                        const vId = getYoutubeId(tutorial.videoUrl);
                        return (
                            <Link
                                key={tutorial.id}
                                href={`/tutoriales/${tutorial.slug || tutorial.id}`}
                                className="group relative aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-[#0d0d0d] border border-white/5 hover:border-[var(--color-primary)]/40 transition-all duration-700 hover:-translate-y-1 shadow-2xl animate-in fade-in slide-in-from-bottom-10"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 scale-110 group-hover:scale-100">
                                    <img
                                        src={tutorial.image || `https://img.youtube.com/vi/${vId}/maxresdefault.jpg`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                                {/* Overlays (Badges) */}
                                <div className="absolute top-3 right-3 md:top-6 md:right-6 z-20 flex flex-col gap-2 items-end">
                                    <div className={`px-2 py-1 rounded-lg border backdrop-blur-md shadow-xl ${tutorial.dificultad === 'FACIL' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                        tutorial.dificultad === 'MEDIO' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">{tutorial.dificultad}</span>
                                    </div>
                                    {tutorial.destacado && (
                                        <div className="bg-yellow-400 p-1.5 rounded-lg shadow-2xl shadow-yellow-400/20 text-black animate-pulse">
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                {/* Play Indicator Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="bg-[var(--color-primary)]/20 p-6 rounded-full backdrop-blur-sm border border-[var(--color-primary)]/40 scale-0 group-hover:scale-100 transition-transform duration-500">
                                        <PlayCircle size={40} className="text-[var(--color-primary)]" fill="currentColor" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end z-10 font-bold">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <div className="px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1">
                                            <Zap size={8} className="text-[var(--color-primary)]" />
                                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider text-white/80">{tutorial.juego?.nombre || 'General'}</span>
                                        </div>
                                        {tutorial.categoria && (
                                            <div className="px-2 py-0.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-lg">
                                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider text-white/40">{tutorial.categoria.nombre}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-sm md:text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                        {tutorial.titulo}
                                    </h3>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <Youtube size={14} className="text-red-500 opacity-60" />
                                            <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Guía Premium</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] md:text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">Entrenar</span>
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-[var(--color-primary)] transform group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Call to Action Refined */}
            <div className="mt-40 bg-gradient-to-r from-[var(--color-primary)]/20 to-emerald-600/10 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-8 md:p-20 text-center shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mb-8 border border-[var(--color-primary)]/30 group-hover:scale-110 transition-transform duration-700">
                        <Zap size={40} className="text-[var(--color-primary)] animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">¿TIENES UNA GUÍA <span className="text-[var(--color-primary)]">ELITE</span>?</h2>
                    <p className="text-sm md:text-xl text-white/40 font-black uppercase italic max-w-2xl mb-12 tracking-tight">Únete a nuestra comunidad de creadores y ayuda a otros jugadores a alcanzar el siguiente nivel.</p>
                    <button
                        onClick={() => setIsSubmissionModalOpen(true)}
                        className="bg-[var(--color-primary)] text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                    >
                        Enviar mi Guía
                    </button>
                </div>
            </div>

            <GuideSubmissionModal
                isOpen={isSubmissionModalOpen}
                onClose={() => setIsSubmissionModalOpen(false)}
                juegos={juegos}
            />
        </div>
    );
}
