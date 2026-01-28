'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlayCircle, Youtube, ArrowLeft, Trophy, Clock, Star, Zap, Share2, ThumbsUp, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';

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
    juego?: { nombre: string, image: string, slug: string };
    createdAt: string;
}

export default function TutorialDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [tutorial, setTutorial] = useState<Tutorial | null>(null);
    const [loading, setLoading] = useState(true);
    const [utilidadClicked, setUtilidadClicked] = useState(false);
    const [compartirClicked, setCompartirClicked] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${slug}`);
            if (!res.ok) throw new Error('Tutorial no encontrado');
            const data = await res.json();
            setTutorial(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchData();
    }, [slug]);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!tutorial) return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4 text-center">
            <PlayCircle size={64} className="text-white/10 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4 italic uppercase">Tutorial no encontrado</h1>
            <Link href="/tutoriales" className="text-[var(--color-primary)] font-bold hover:underline uppercase tracking-widest text-sm">Volver al centro</Link>
        </div>
    );

    const videoId = getYoutubeId(tutorial.videoUrl);
    const shareImage = tutorial.image || tutorial.juego?.image || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');
    const shareTitle = `${tutorial.titulo} - Tutorial ${tutorial.juego?.nombre || 'Gaming'} | AJDREW`;
    const shareDescription = tutorial.descripcion?.substring(0, 160) || `Aprende ${tutorial.titulo} en este tutorial ${tutorial.dificultad.toLowerCase()} de ${tutorial.juego?.nombre || 'gaming'}.`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <>
            <Head>
                <title>{shareTitle}</title>
                <meta name="description" content={shareDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:title" content={shareTitle} />
                <meta property="og:description" content={shareDescription} />
                {shareImage && <meta property="og:image" content={shareImage} />}
                {shareImage && <meta property="og:image:width" content="1200" />}
                {shareImage && <meta property="og:image:height" content="630" />}
                <meta property="og:site_name" content="AJDREW" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={shareUrl} />
                <meta name="twitter:title" content={shareTitle} />
                <meta name="twitter:description" content={shareDescription} />
                {shareImage && <meta name="twitter:image" content={shareImage} />}
            </Head>

            <div className="min-h-screen pt-20 md:pt-32 pb-20 md:pb-40 px-4 md:px-6 bg-[var(--color-bg)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">

                    {/* Back Button */}
                    <Link href="/tutoriales" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Todos los tutoriales</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">

                        {/* Main Content (Video & Title) */}
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {/* Video Player Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-video bg-black rounded-[20px] md:rounded-[40px] overflow-hidden shadow-3xl border border-white/5"
                            >
                                {videoId ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                                        title={tutorial.titulo}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                        <Youtube size={64} />
                                        <p className="mt-4 font-bold uppercase tracking-widest">Enlace de video no válido</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Title & Stats */}
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[10px] font-black uppercase text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 tracking-widest">
                                        {tutorial.juego?.nombre || 'General'}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${tutorial.dificultad === 'FACIL' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                        tutorial.dificultad === 'MEDIO' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        Nivel: {tutorial.dificultad}
                                    </span>
                                    {tutorial.destacado && (
                                        <span className="bg-yellow-400 text-black px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-tighter flex items-center gap-2">
                                            <Trophy size={12} /> Destacado
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                                    {tutorial.titulo}
                                </h1>

                                <div className="p-5 md:p-10 bg-[#0a0a0a]/40 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/5 group hover:border-[var(--color-primary)]/20 transition-all duration-500 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 text-[var(--color-primary)]/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                        <Zap size={120} />
                                    </div>
                                    <h3 className="text-[10px] md:text-xs font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                        <Zap size={14} className="animate-pulse" /> Resumen Estratégico Elite
                                    </h3>
                                    <p className="text-base md:text-xl text-white/70 font-medium italic opacity-90 leading-relaxed whitespace-pre-wrap relative z-10">
                                        {tutorial.descripcion || 'Este tutorial aún no cuenta con una descripción detallada. Sigue los pasos del video para aprender las mecánicas presentadas.'}
                                    </p>
                                </div>

                                {/* Hybrid: Step-by-Step Guide */}
                                {(tutorial as any).pasos && (tutorial as any).pasos.length > 0 && (
                                    <div className="space-y-12 pt-12 border-t border-white/5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-yellow-400/10 rounded-2xl">
                                                <LayoutGrid className="text-yellow-400" size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Guía por Pasos</h2>
                                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Sigue el manual interactivo</p>
                                            </div>
                                        </div>

                                        <div className="space-y-16">
                                            {(tutorial as any).pasos.map((step: any, idx: number) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    key={step.id}
                                                    className="relative pl-10 md:pl-16 group/step"
                                                >
                                                    {/* Vertical Connector */}
                                                    {idx !== (tutorial as any).pasos.length - 1 && (
                                                        <div className="absolute left-[20px] md:left-[24px] top-12 bottom-[-64px] w-[2px] bg-gradient-to-b from-[var(--color-primary)] via-white/5 to-transparent opacity-30 md:opacity-50"></div>
                                                    )}

                                                    {/* Step Number Circle */}
                                                    <div className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-[var(--color-primary)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] text-[var(--color-primary)] flex items-center justify-center rounded-full font-black italic text-lg group-hover/step:scale-110 transition-all duration-500 z-10">
                                                        {idx + 1}
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter group-hover/step:text-[var(--color-primary)] transition-colors duration-500 leading-none">{step.titulo}</h3>
                                                            <p className="mt-4 text-base md:text-xl text-white/50 font-medium italic opacity-90 leading-relaxed md:max-w-2xl">
                                                                {step.descripcion}
                                                            </p>
                                                        </div>

                                                        {step.image && (
                                                            <div className="relative max-w-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-4xl group/image bg-black/40 aspect-[16/9] md:aspect-auto">
                                                                <div className="absolute inset-0 bg-[var(--color-primary)]/10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
                                                                <img
                                                                    src={step.image}
                                                                    alt={step.titulo}
                                                                    className="w-full h-full object-cover md:object-contain group-hover:scale-[1.03] transition-transform duration-1000"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Metadata */}
                        <aside className="space-y-8 lg:mt-24">
                            <div className="bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[40px] shadow-3xl sticky top-32">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-4">Info Estratégica</h3>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-5 group cursor-pointer" onClick={() => router.push(`/juegos/${tutorial.juego?.slug}`)}>
                                        <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center border border-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)] transition-all duration-500">
                                            <Gamepad2 className="text-[var(--color-primary)] group-hover:text-black" size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Juego Oficial</p>
                                            <p className="text-lg text-white font-black uppercase italic tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">{tutorial.juego?.nombre || 'General'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 transition-all duration-500">
                                            <Clock className="text-blue-400 group-hover:text-black" size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Lanzamiento</p>
                                            <p className="text-lg text-white font-black uppercase italic tracking-tighter">{new Date(tutorial.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 group">
                                        <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500 transition-all duration-500">
                                            <Trophy className="text-yellow-400 group-hover:text-black" size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Nivel Requerido</p>
                                            <p className={`text-lg font-black uppercase italic tracking-tighter ${tutorial.dificultad === 'FACIL' ? 'text-green-400' :
                                                tutorial.dificultad === 'MEDIO' ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>{tutorial.dificultad}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                                    <button
                                        onClick={async () => {
                                            if (utilidadClicked) return;
                                            setUtilidadClicked(true);
                                            try {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${tutorial.id}/utilidad`, {
                                                    method: 'POST',
                                                });
                                                import('sweetalert2').then((Swal) => {
                                                    Swal.default.fire({
                                                        title: '¡Gracias!',
                                                        text: 'Nos alegra que este tutorial te haya sido de ayuda.',
                                                        icon: 'success',
                                                        background: '#152015',
                                                        color: '#e0f0e0',
                                                        toast: true,
                                                        position: 'top-end',
                                                        showConfirmButton: false,
                                                        timer: 3000
                                                    });
                                                });
                                            } catch (error) {
                                                console.error('Error al marcar utilidad:', error);
                                                setUtilidadClicked(false);
                                            }
                                        }}
                                        disabled={utilidadClicked}
                                        className={`w-full flex items-center justify-center gap-3 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${utilidadClicked
                                            ? 'bg-green-500 shadow-green-500/20 cursor-not-allowed'
                                            : 'bg-[var(--color-primary)] shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95'
                                            }`}
                                    >
                                        <ThumbsUp size={16} /> {utilidadClicked ? '¡Marcado!' : '¡Me ha servido!'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (compartirClicked) return;
                                            setCompartirClicked(true);
                                            try {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${tutorial.id}/compartir`, {
                                                    method: 'POST',
                                                });

                                                if (navigator.share) {
                                                    try {
                                                        await navigator.share({
                                                            title: tutorial.titulo,
                                                            text: `Mira este tutorial de ${tutorial.juego?.nombre || 'General'} en AJDREW!`,
                                                            url: window.location.href,
                                                        });
                                                    } catch (shareError) {
                                                        console.log('Share cancelled or failed', shareError);
                                                    }
                                                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                                                    try {
                                                        await navigator.clipboard.writeText(window.location.href);
                                                        import('sweetalert2').then((Swal) => {
                                                            Swal.default.fire({
                                                                title: '¡Copiado!',
                                                                text: 'El enlace se ha copiado al portapapeles.',
                                                                icon: 'info',
                                                                toast: true,
                                                                position: 'top-end',
                                                                showConfirmButton: false,
                                                                timer: 3000
                                                            });
                                                        });
                                                    } catch (clipError) {
                                                        console.error('Clipboard error:', clipError);
                                                    }
                                                }
                                                setTimeout(() => setCompartirClicked(false), 2000);
                                            } catch (error) {
                                                console.error('Error al registrar compartir:', error);
                                                setCompartirClicked(false);
                                            }
                                        }}
                                        disabled={compartirClicked}
                                        className={`w-full flex items-center justify-center gap-3 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${compartirClicked
                                            ? 'bg-green-500/20 border-green-500/40 cursor-not-allowed'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <Share2 size={16} /> {compartirClicked ? '¡Compartido!' : 'Compartir Guía'}
                                    </button>
                                </div>

                                {/* Tip Box (Inside sticky) */}
                                <div className="mt-12 p-8 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent border border-[var(--color-primary)]/10 rounded-[40px] relative overflow-hidden">
                                    <Star className="absolute -top-4 -right-4 text-[var(--color-primary)]/10" size={120} />
                                    <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-widest mb-2 italic">Pro Tip</h4>
                                    <p className="text-sm text-white/60 font-medium italic relative z-10">Mucha gente recomienda ver este tutorial a velocidad 0.75x para apreciar mejor los movimientos.</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

function Gamepad2({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="15.5" cy="15.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="15.5" r=".5" fill="currentColor" /></svg>;
}
