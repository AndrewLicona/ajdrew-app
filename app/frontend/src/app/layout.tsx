import { ThemeProvider } from "@/app/components/theme-provider";
import { ThemeSelector } from "@/shared/components/molecules/ThemeSelector";
import { CookieBanner } from "@/shared/components/organisms/CookieBanner";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/shared/components/organisms/Footer";
import Header from "@/shared/components/organisms/Header";
import { PublicLayoutWrapper } from "./PublicLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AJDREW",
    default: "AJDREW - Tu comunidad de juegos, rankings y más",
  },
  description: "Participa en rankings, califica juegos, compite en torneos y aprende con tutoriales en la comunidad de AJDREW.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* AdSense script — solo se carga si NEXT_PUBLIC_ENABLE_ADS=true */}
        {process.env.NEXT_PUBLIC_ENABLE_ADS === 'true' && process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="verde"
          themes={["plata", "verde"]}
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
          {/* Banner de cookies — siempre activo, requerido por ley */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
