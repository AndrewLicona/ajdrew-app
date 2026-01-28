'use client';

import React, { useEffect, useState } from 'react';
import {
    Gamepad2,
    Layers,
    Package,
    Gift,
    TrendingUp,
    Users,
    Plus,
    ExternalLink,
    Vote,
    PlayCircle,
    Star,
    ArrowUpRight,
    LucideIcon
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    counts: {
        juegos: number;
        categorias: number;
        sorteos: number;
        votos: number;
        usuarios: number;
        calificaciones: number;
        tutoriales: number;
        participacionTotal: number;
        tutorialesUtilidad: number;
        tutorialesCompartidos: number;
    };
    recientes: {
        calificaciones: any[];
        participantes: any[];
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const kpiCards = [
        {
            title: 'Participación Total',
            subtitle: 'Votos + Calificaciones',
            value: stats?.counts.participacionTotal || 0,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            title: 'Usuarios Registrados',
            subtitle: 'Cuentas activas',
            value: stats?.counts.usuarios || 0,
            icon: Users,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            title: 'Sorteos Activos',
            subtitle: 'Campañas en curso',
            value: stats?.counts.sorteos || 0,
            icon: Gift,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10'
        },
        {
            title: 'Tutoriales',
            subtitle: 'Guías publicadas',
            value: stats?.counts.tutoriales || 0,
            icon: PlayCircle,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            title: 'Tutorial Likes',
            subtitle: '"Me ha servido" totales',
            value: stats?.counts.tutorialesUtilidad || 0,
            icon: Star,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10'
        },
        {
            title: 'Tutoriales Compartidos',
            subtitle: 'Veces compartido',
            value: stats?.counts.tutorialesCompartidos || 0,
            icon: ArrowUpRight,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10'
        },
    ];

    const dataInventory = [
        { name: 'Juegos', count: stats?.counts.juegos || 0, icon: Gamepad2, href: '/admin/juegos' },
        { name: 'Categorías', count: stats?.counts.categorias || 0, icon: Layers, href: '/admin/categorias' },
        { name: 'Ítems', count: stats?.counts.calificaciones || 0, icon: Package, href: '/admin/items' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header section with real purpose */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Panel de Control</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm font-medium">Información real del rendimiento de la plataforma.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/juegos" className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-black uppercase rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-95">
                        <Plus size={16} /> Nuevo Contenido
                    </Link>
                    <Link href="/" target="_blank" className="p-2 bg-white/5 text-white/40 hover:text-white rounded-xl transition-colors border border-white/5">
                        <ExternalLink size={18} />
                    </Link>
                </div>
            </div>

            {/* KPI Grid - Optimized for Mobile (2 columns) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="bg-[var(--color-card)] border border-white/5 p-4 md:p-6 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 -mr-6 -mt-6 md:-mr-8 md:-mt-8 rounded-full blur-3xl opacity-20 ${kpi.bgColor}`} />
                        <div className="relative z-10">
                            <div className={`p-2 md:p-3 rounded-lg md:rounded-xl inline-flex mb-3 md:mb-4 ${kpi.bgColor} ${kpi.color}`}>
                                <kpi.icon size={18} className="md:w-[22px] md:h-[22px]" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white">{kpi.value}</h3>
                            <p className="text-[9px] md:text-xs font-black text-white/20 uppercase tracking-widest mt-0.5 md:mt-1">{kpi.title}</p>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-text-secondary)] mt-0.5 md:mt-1 leading-tight">{kpi.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity - Purposeful data feeds */}
                <div className="lg:col-span-2 space-y-6 order-2">
                    <section className="bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <ArrowUpRight size={14} className="text-[var(--color-primary)]" /> Actividad Reciente
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {stats?.recientes.calificaciones.length === 0 && (
                                <div className="p-8 text-center opacity-30 italic text-xs">No hay actividad reciente</div>
                            )}
                            {stats?.recientes.calificaciones.map((cal, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                            <Star size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Nueva Calificación</p>
                                            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-black tracking-tight">
                                                {cal.item?.nombre} • {cal.puntuacion} Estrellas
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-white/20 font-medium">
                                        {new Date(cal.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Inventory Overview */}
                <div className="space-y-6 order-1">
                    <section className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6">Inventario de Datos</h2>
                        <div className="space-y-4">
                            {dataInventory.map((item, idx) => (
                                <Link key={idx} href={item.href} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[var(--color-primary)]/30 group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-xs font-black text-white uppercase">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[var(--color-primary)]">{item.count}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="p-6 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent border border-[var(--color-primary)]/10 rounded-2xl">
                        <h2 className="text-xs font-black text-white uppercase tracking-widest mb-2">Consejo del Sistema</h2>
                        <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
                            La participación total incluye tanto los votos en torneos como las calificaciones de juegos. Enfócate en aumentar este KPI para mejorar la retención.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
