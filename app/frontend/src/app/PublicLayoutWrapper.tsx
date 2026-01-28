'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/shared/components/organisms/Header";
import Footer from "@/shared/components/organisms/Footer";
import { ThemeSelector } from "@/shared/components/molecules/ThemeSelector";

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isAdmin = pathname?.includes('/admin');

    // Evitar parpadeo (flicker) durante la hidratación inicial
    if (!mounted) return <div className="min-h-screen bg-[var(--color-background)]" />;

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen pb-20 md:pb-0">
            <Header />
            <main className="flex-grow pt-14 md:pt-[70px]">
                <div className="max-w-[1920px] w-full mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
            <ThemeSelector />
        </div>
    );
}
