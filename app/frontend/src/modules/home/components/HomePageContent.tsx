'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Trophy, Gift, Youtube, Star, ChevronRight, Zap, Newspaper, Sparkles, Target, Clock } from 'lucide-react';

interface Publicacion {
    id: string;
    titulo: string;
    contenido: string;
    enlace?: string;
    tipo: string;
    createdAt: string;
}

interface FeaturedItem {
    id: string;
    type: 'sorteo' | 'tutorial' | 'votacion' | 'calificacion';
    title: string;
    image?: string;
    link: string;
    juegoNombre: string;
    juegoSlug: string;
    createdAt: string;
    badge?: string;
}

export const HomePageContent = () => {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [featuredContent, setFeaturedContent] = useState<FeaturedItem[]>([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publicaciones`);
                if (res.ok) {
                    const data = await res.json();
                    setPublicaciones(data.slice(0, 3)); // Show latest 3
                }
            } catch (e) {
                console.error('Error fetching news:', e);
            } finally {
                setLoadingNews(false);
            }
        };

        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos`);
                if (res.ok) {
                    const juegos = await res.json();
                    const items: FeaturedItem[] = [];

                    // Iterate over each game to get full data
                    for (const juego of juegos.slice(0, 5)) {
                        try {
                            const juegoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/juegos/${juego.slug}`);
                            if (juegoRes.ok) {
                                const juegoData = await juegoRes.json();

                                // Add sorteos
                                (juegoData.sorteos || [])
                                    .filter((s: any) => s.estado === 'ACTIVA' || s.estado === 'ACTIVO')
                                    .forEach((s: any) => {
                                        items.push({
                                            id: s.id,
                                            type: 'sorteo',
                                            title: s.titulo,
                                            image: s.image,
                                            link: `/juegos/${juegoData.slug}?tab=sorteo`,
                                            juegoNombre: juegoData.nombre,
                                            juegoSlug: juegoData.slug,
                                            createdAt: s.createdAt || s.fechaFin,
                                            badge: s.premio
                                        });
                                    });

                                // Add tutorials
                                (juegoData.tutoriales || []).forEach((t: any) => {
                                    items.push({
                                        id: t.id,
                                        type: 'tutorial',
                                        title: t.titulo,
                                        image: t.image,
                                        link: `/tutoriales/${t.slug}`,
                                        juegoNombre: juegoData.nombre,
                                        juegoSlug: juegoData.slug,
                                        createdAt: t.createdAt || new Date().toISOString(),
                                        badge: t.dificultad
                                    });
                                });

                                // Add votaciones and items
                                (juegoData.categorias || []).forEach((cat: any) => {
                                    // Votaciones (Brackets)
                                    (cat.votaciones || [])
                                        .filter((v: any) => v.activa !== false)
                                        .forEach((v: any) => {
                                            items.push({
                                                id: v.id,
                                                type: 'votacion',
                                                title: v.tematica,
                                                image: v.image,
                                                link: `/votaciones/${v.slug || v.id}`,
                                                juegoNombre: juegoData.nombre,
                                                juegoSlug: juegoData.slug,
                                                createdAt: v.createdAt || new Date().toISOString(),
                                                badge: cat.nombre
                                            });
                                        });

                                    // Calificaciones (Items)
                                    if (cat.tipo === 'CALIFICACION') {
                                        (cat.items || []).forEach((item: any) => {
                                            items.push({
                                                id: item.id,
                                                type: 'calificacion',
                                                title: item.nombre,
                                                image: item.image,
                                                link: `/juegos/${juegoData.slug}?tab=ranking`,
                                                juegoNombre: juegoData.nombre,
                                                juegoSlug: juegoData.slug,
                                                createdAt: item.createdAt || new Date().toISOString(),
                                                badge: cat.nombre
                                            });
                                        });
                                    }
                                });
                            }
                        } catch (e) {
                            console.error(`Error fetching game ${juego.slug}:`, e);
                        }
                    }

                    // Sort by most recent and take top 6
                    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setFeaturedContent(items.slice(0, 6));
                }
            } catch (e) {
                console.error('Error fetching featured content:', e);
            } finally {
                setLoadingFeatured(false);
            }
        };

        fetchNews();
        fetchFeatured();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col pt-6 md:pt-10 pb-20 md:pb-40 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
                {/* --- HERO SECTION --- */}
                <section className="py-12 md:py-16 flex flex-col items-center text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/5 scale-90 md:scale-95">
                        <Zap size={14} className="text-[var(--color-primary)] animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Comunidad Gaming AJDREW</span>
                    </div>

                    <h1 className="text-[40px] md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-2xl px-2">
                        EL SIGUIENTE <br /> <span className="text-[var(--color-primary)]">NIVEL</span>
                    </h1>

                    <p className="text-sm md:text-xl text-[var(--color-text-secondary)] font-semibold max-w-lg italic opacity-80 leading-relaxed px-4">
                        Tutoriales Pro, Sorteos Épicos y Calificaciones Reales. <br className="hidden md:block" /> Únete a la comunidad de AJDREW.
                    </p>

                    <Link
                        href="/juegos"
                        data-testid="hero-explore-btn"
                        className="group relative bg-white text-black px-10 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 hover:bg-[var(--color-primary)] hover:text-white shadow-3xl shadow-white/5"
                    >
                        Explorar Juegos
                    </Link>
                </section>

                {/* --- MAIN FEATURES GRID --- */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10 md:mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    {/* Juegos Card */}
                    <Link href="/juegos" data-testid="feature-card-juegos" className="group relative bg-[var(--color-card)]/40 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-[var(--color-primary)]/30 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 md:p-8 text-white/5 group-hover:text-[var(--color-primary)]/20 transition-colors hidden md:block">
                            <Gamepad2 className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-3 md:space-y-3 text-center md:text-left flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                                <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tight">Ecosistema</h3>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest leading-tight opacity-50">
                                Explora tus juegos.
                            </p>
                        </div>
                    </Link>

                    {/* Rankings Card */}
                    <Link href="/calificaciones" data-testid="feature-card-rankings" className="group relative bg-[var(--color-card)]/40 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-yellow-500/30 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 md:p-8 text-white/5 group-hover:text-yellow-500/20 transition-colors hidden md:block">
                            <Star className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-3 md:space-y-3 text-center md:text-left flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                                <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tight">Rankings</h3>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest leading-tight opacity-50">
                                Vota lo mejor.
                            </p>
                        </div>
                    </Link>

                    {/* Sorteos Card */}
                    <Link href="/sorteos" data-testid="feature-card-sorteos" className="group relative bg-[var(--color-card)]/40 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-emerald-500/30 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 md:p-8 text-white/5 group-hover:text-emerald-500/20 transition-colors hidden md:block">
                            <Gift className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-3 md:space-y-3 text-center md:text-left flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <Gift className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tight">Sorteos</h3>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest leading-tight opacity-50">
                                Gana premios.
                            </p>
                        </div>
                    </Link>

                    {/* Tutoriales Card */}
                    <Link href="/tutoriales" data-testid="feature-card-tutoriales" className="group relative bg-[var(--color-card)]/40 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-red-500/30 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 md:p-8 text-white/5 group-hover:text-red-500/20 transition-colors hidden md:block">
                            <Youtube className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-3 md:space-y-3 text-center md:text-left flex flex-col items-center md:items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                <Youtube className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tight">Guias Pro</h3>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest leading-tight opacity-50">
                                Mira y aprende.
                            </p>
                        </div>
                    </Link>
                </section>

                {/* --- GLOBAL FEATURED CONTENT --- */}
                {featuredContent.length > 0 && (
                    <section className="mt-12 md:mt-20 space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20">
                                    <Clock size={18} className="text-purple-400" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
                                    Lo Más <span className="text-purple-400">Reciente</span>
                                </h2>
                            </div>
                            <Link href="/juegos" className="text-[9px] font-black text-purple-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                                Ver Todo <ChevronRight size={12} />
                            </Link>
                        </div>

                        {loadingFeatured ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-video bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Profile-style Horizontal Cards Container */}
                                <div className="relative group/scroll">
                                    <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:-mx-2 md:px-2 scroll-smooth">
                                        {featuredContent.map(item => (
                                            <Link
                                                key={`featured-profile-${item.type}-${item.id}`}
                                                href={item.link}
                                                className="group relative bg-[#121212]/80 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 hover:border-purple-500/30 transition-all duration-500 w-[min(90vw,360px)] md:w-[340px] snap-start flex-shrink-0 shadow-xl backdrop-blur-md"
                                            >
                                                {/* Rounded Rectangle Avatar Image (Visibility Fix) */}
                                                <div className="w-16 h-16 rounded-[20px] overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors flex-shrink-0 bg-black relative">
                                                    {item.image ? (
                                                        <>
                                                            <img
                                                                src={item.image}
                                                                alt=""
                                                                className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110"
                                                            />
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 z-10"
                                                            />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center">
                                                            {item.type === 'sorteo' && <Gift className="text-white" size={24} />}
                                                            {item.type === 'tutorial' && <Star className="text-white" size={24} />}
                                                            {item.type === 'votacion' && <Trophy className="text-white" size={24} />}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Profile-style Info */}
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${item.type === 'sorteo' ? 'bg-pink-500' :
                                                            item.type === 'tutorial' ? 'bg-emerald-500' :
                                                                item.type === 'votacion' ? 'bg-blue-500' :
                                                                    'bg-amber-500'
                                                            }`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                                            {item.type === 'sorteo' ? 'Sorteo' : item.type === 'tutorial' ? 'Guía' : item.type === 'votacion' ? 'Evento' : 'Ránking'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-[15px] font-black text-white leading-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-white/50 line-clamp-1">
                                                            {item.juegoNombre}
                                                        </span>
                                                        {item.badge && (
                                                            <span className="text-[9px] font-medium text-purple-400/80 uppercase tracking-tight flex items-center gap-1">
                                                                <Clock size={10} /> {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action indicator */}
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-all flex-shrink-0">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {/* --- COMMUNITY NEWS FEED --- */}
                <section className="mt-16 md:mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20">
                                <Newspaper size={18} className="text-[var(--color-primary)]" />
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Novedades <span className="text-[var(--color-primary)]">Comunidad</span></h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {loadingNews ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-40 bg-white/5 rounded-[24px] animate-pulse border border-white/5" />
                            ))
                        ) : publicaciones.length === 0 ? (
                            <div className="col-span-full py-12 bg-white/5 rounded-[24px] border border-white/5 text-center">
                                <p className="text-sm text-white/20 italic font-medium">No hay novedades recientes. ¡Vuelve pronto!</p>
                            </div>
                        ) : (
                            publicaciones.map((pub, idx) => (
                                <div
                                    key={pub.id}
                                    className="group relative bg-[var(--color-card)]/40 p-6 rounded-[24px] border border-white/5 hover:border-[var(--color-primary)]/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Sparkles size={40} className="text-[var(--color-primary)]" />
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/10 px-2 py-1 rounded-md border border-[var(--color-primary)]/20">
                                                {pub.tipo === 'AUTOMATICA' ? 'SISTEMA' : 'NOTIFICACIÓN'}
                                            </span>
                                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                                                {new Date(pub.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-base md:text-lg font-black text-white uppercase italic tracking-tight leading-tight line-clamp-2">
                                            {pub.titulo}
                                        </h4>
                                        <p className="text-[10px] md:text-xs text-[var(--color-text-secondary)] font-medium opacity-60 line-clamp-2">
                                            {pub.contenido}
                                        </p>
                                    </div>

                                    {pub.enlace && (
                                        <Link
                                            href={pub.enlace}
                                            className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-tighter hover:gap-3 transition-all"
                                        >
                                            VER DETALLES <ChevronRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* --- FOOTER CTA --- */}
                <section className="mt-16 md:mt-24 border-t border-white/5 pt-12 md:pt-16 animate-in fade-in duration-1000 delay-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 bg-white/5 p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-white/5">
                        <div className="space-y-3 md:space-y-3 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">Únete al canal oficial</h2>
                            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium max-w-md opacity-60 italic">Sigue a AJDREW en YouTube para no perderte ningún sorteo en vivo.</p>
                        </div>
                        <a
                            href="https://www.youtube.com/channel/UCVrTKrp-wbORYB-gRQ5XoLQ?sub_confirmation=1"
                            target="_blank"
                            className="flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-transform hover:scale-105"
                        >
                            Suscribirse <Youtube size={18} />
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};
