'use client';

import React from 'react';
import {
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    MessageSquare,
    Share2,
    CheckCircle,
    ArrowRight,
    Settings
} from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
    const integrations = [
        {
            name: 'Discord',
            description: 'Publicaciones automáticas mediante Webhooks.',
            icon: MessageSquare,
            href: '/admin/discord',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20'
        },
        {
            name: 'X (Twitter)',
            description: 'Tweets automáticos con imágenes de brackets.',
            icon: Twitter,
            href: '/admin/x',
            color: 'text-sky-400',
            bgColor: 'bg-sky-400/10',
            borderColor: 'border-sky-400/20'
        },
        {
            name: 'Facebook',
            description: 'Posteo en páginas de Facebook vinculadas.',
            icon: Facebook,
            href: '/admin/facebook',
            color: 'text-blue-600',
            bgColor: 'bg-blue-600/10',
            borderColor: 'border-blue-600/20'
        },
        {
            name: 'Instagram',
            description: 'Publicación de fotos en perfiles Business.',
            icon: Instagram,
            href: '/admin/instagram',
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20'
        },
        {
            name: 'YouTube',
            description: 'Subida de Shorts automáticos del torneo.',
            icon: Youtube,
            href: '/admin/youtube',
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20'
        }
    ];

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
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group p-8 rounded-3xl bg-[var(--color-card)] border ${item.borderColor} hover:border-[var(--color-primary)]/40 transition-all duration-300 shadow-xl flex flex-col`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle size={10} /> Conectado
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">
                            {item.name}
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
                            {item.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Gestionar</span>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
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
