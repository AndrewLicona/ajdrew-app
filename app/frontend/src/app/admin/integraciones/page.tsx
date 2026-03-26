'use client';

import React, { useEffect, useState } from 'react';
import {
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    MessageSquare,
    Share2,
    CheckCircle,
    XCircle,
    ArrowRight,
    Settings,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface IntegrationStatus {
    connected: boolean;
    count: number;
    loading: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchCount(url: string): Promise<number> {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return 0;
        const data = await res.json();
        return Array.isArray(data) ? data.filter((d: { isActive?: boolean }) => d.isActive !== false).length : 0;
    } catch {
        return 0;
    }
}

export default function IntegrationsPage() {
    const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>({
        discord: { connected: false, count: 0, loading: true },
        x: { connected: false, count: 0, loading: true },
        facebook: { connected: false, count: 0, loading: true },
        instagram: { connected: false, count: 0, loading: true },
        youtube: { connected: false, count: 0, loading: true },
    });

    useEffect(() => {
        const checkAll = async () => {
            const [discord, x, facebook, instagram, youtube] = await Promise.all([
                fetchCount(`${API_URL}/admin/discord/webhooks`),
                fetchCount(`${API_URL}/admin/x/accounts`),
                fetchCount(`${API_URL}/admin/social/meta/facebook/accounts`),
                fetchCount(`${API_URL}/admin/social/meta/instagram/accounts`),
                fetchCount(`${API_URL}/admin/social/youtube/accounts`),
            ]);

            setStatuses({
                discord: { connected: discord > 0, count: discord, loading: false },
                x: { connected: x > 0, count: x, loading: false },
                facebook: { connected: facebook > 0, count: facebook, loading: false },
                instagram: { connected: instagram > 0, count: instagram, loading: false },
                youtube: { connected: youtube > 0, count: youtube, loading: false },
            });
        };

        checkAll();
    }, []);

    const integrations = [
        {
            key: 'discord',
            name: 'Discord',
            description: 'Publicaciones automáticas mediante Webhooks.',
            icon: MessageSquare,
            href: '/admin/discord',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20',
            connectedBorderColor: 'border-blue-400/50',
            label: (count: number) => `${count} webhook${count !== 1 ? 's' : ''}`,
        },
        {
            key: 'x',
            name: 'X (Twitter)',
            description: 'Tweets automáticos con imágenes de brackets.',
            icon: Twitter,
            href: '/admin/x',
            color: 'text-sky-400',
            bgColor: 'bg-sky-400/10',
            borderColor: 'border-sky-400/20',
            connectedBorderColor: 'border-sky-400/50',
            label: (count: number) => `${count} cuenta${count !== 1 ? 's' : ''}`,
        },
        {
            key: 'facebook',
            name: 'Facebook',
            description: 'Posteo en páginas de Facebook vinculadas.',
            icon: Facebook,
            href: '/admin/facebook',
            color: 'text-blue-600',
            bgColor: 'bg-blue-600/10',
            borderColor: 'border-blue-600/20',
            connectedBorderColor: 'border-blue-600/50',
            label: (count: number) => `${count} página${count !== 1 ? 's' : ''}`,
        },
        {
            key: 'instagram',
            name: 'Instagram',
            description: 'Publicación de fotos en perfiles Business.',
            icon: Instagram,
            href: '/admin/instagram',
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20',
            connectedBorderColor: 'border-pink-500/50',
            label: (count: number) => `${count} perfil${count !== 1 ? 'es' : ''}`,
        },
        {
            key: 'youtube',
            name: 'YouTube',
            description: 'Subida de Shorts automáticos del torneo.',
            icon: Youtube,
            href: '/admin/youtube',
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20',
            connectedBorderColor: 'border-red-500/50',
            label: (count: number) => `${count} canal${count !== 1 ? 'es' : ''}`,
        }
    ];

    const connectedCount = Object.values(statuses).filter(s => s.connected).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                        <Share2 className="text-[var(--color-primary)]" size={32} />
                        Integraciones Sociales
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                        Gestiona todas las conexiones con redes sociales para automatizar tus torneos.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${connectedCount > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">
                        {connectedCount} / {integrations.length} activas
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((item) => {
                    const status = statuses[item.key];
                    const isConnected = status.connected;
                    const isLoading = status.loading;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group p-8 rounded-3xl bg-[var(--color-card)] border transition-all duration-300 shadow-xl flex flex-col
                                ${isConnected
                                    ? `${item.connectedBorderColor} hover:border-[var(--color-primary)]/60`
                                    : 'border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>

                                {isLoading ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-white/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <Loader2 size={10} className="animate-spin" /> Verificando
                                    </div>
                                ) : isConnected ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                        <CheckCircle size={10} />
                                        {item.label(status.count)}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-white/30 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                        <XCircle size={10} />
                                        Sin conectar
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">
                                {item.name}
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
                                {item.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                                    {isConnected ? 'Gestionar' : 'Configurar'}
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Helper Section */}
            <div className="bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-transparent p-10 rounded-[40px] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-[var(--color-primary)]">
                        <Settings size={40} className="animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">¿Cómo funciona la automatización?</h3>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                            Cuando inicias una nueva fase en un torneo de Elite Rankings, el sistema genera automáticamente una imagen actualizada del bracket y la publica en todas las plataformas que tengas conectadas arriba. No necesitas hacer nada manual.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
