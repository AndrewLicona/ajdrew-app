'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Gamepad2, Layers, Package, Gift, LogOut, Menu, X, Vote, Sun, Moon, Twitter, MessageSquare, Facebook, Instagram, Youtube, Share2, Users, Star, ListOrdered } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'plata' ? 'verde' : 'plata');
    };

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Juegos', href: '/admin/juegos', icon: Gamepad2 },
        { name: 'Categorías', href: '/admin/categorias', icon: Layers },
        { name: 'Ítems', href: '/admin/items', icon: Package },
        { name: 'Calificaciones', href: '/admin/tablas-calificaciones', icon: ListOrdered },
        { name: 'Votaciones', href: '/admin/votaciones', icon: Vote },
        { name: 'Tutoriales', href: '/admin/tutoriales', icon: Package },
        { name: 'Sorteos', href: '/admin/sorteos', icon: Gift },
        { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
        { name: 'Integraciones', href: '/admin/integraciones', icon: Share2 },
    ];

    if (!user || !mounted) return null;

    return (
        <div className="flex flex-col h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden transition-colors duration-300">
            {/* TOP HEADER */}
            <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[var(--color-card)] border-b border-white/5 z-[600] shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors relative z-[610]"
                    >
                        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-black text-xl text-[var(--color-primary)] italic tracking-tighter uppercase font-serif">
                            AJDREW
                        </span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]/30 not-italic uppercase font-black tracking-widest hidden sm:inline-block border-l border-white/10 pl-2 ml-1">
                            Admin
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all active:scale-95"
                        title="Cambiar Tema"
                    >
                        {theme === 'plata' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <p className="text-xs font-black text-[var(--color-text)] uppercase tracking-tight">{user.nombre}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                    >
                        <LogOut size={16} />
                        <span className="hidden xs:inline">Salir</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* SIDEBAR OVERLAY */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[700] lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed lg:relative
                        inset-y-0 left-0
                        z-[800]
                        flex flex-col
                        bg-[var(--color-card)] lg:border-r border-white/5
                        transition-all duration-300 ease-in-out
                        ${isSidebarOpen
                            ? 'w-64 translate-x-0 opacity-100'
                            : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0 lg:opacity-100 opacity-0 pointer-events-none lg:pointer-events-auto'}
                    `}
                >
                    {/* Header inside sidebar (mobile) */}
                    <div className="lg:hidden h-16 flex items-center px-6 border-b border-white/5 shrink-0">
                        <span className="font-black text-xl text-[var(--color-primary)] italic tracking-tighter uppercase font-serif">
                            AJDREW
                        </span>
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto text-[var(--color-text-secondary)] p-2">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={closeSidebarOnMobile}
                                    className={`
                                        flex items-center gap-4 p-3 rounded-2xl transition-all
                                        relative
                                        ${isActive
                                            ? 'bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20'
                                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'}
                                    `}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    <span className={`font-bold text-sm truncate transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0 opacity-0 pointer-events-none'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 pt-6 md:p-8 md:pt-10 lg:p-12 scrollbar-hide relative z-[10]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
