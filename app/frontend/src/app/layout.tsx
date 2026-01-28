import { ThemeProvider } from "@/app/components/theme-provider";
import { ThemeSelector } from "@/shared/components/molecules/ThemeSelector";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        </ThemeProvider>
      </body>
    </html>
  );
}
