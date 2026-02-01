'use client'

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import { SiTiktok } from "react-icons/si"
import { FaXTwitter } from "react-icons/fa6"

const Footer: React.FC = () => {
  const socialLinks = [
    {
      href: "https://www.facebook.com",
      icon: FaFacebook,
      size: 24,
      label: "Facebook"
    },
    {
      href: "https://x.com",
      icon: FaXTwitter,
      size: 22,
      label: "X (Twitter)"
    },
    {
      href: "https://www.instagram.com",
      icon: FaInstagram,
      size: 24,
      label: "Instagram"
    },
    {
      href: "https://www.youtube.com/@canal1",
      icon: FaYoutube,
      size: 24,
      label: "YouTube Principal"
    },
    {
      href: "https://www.youtube.com/@canal2",
      icon: FaYoutube,
      size: 24,
      label: "YouTube Secundario"
    },
    {
      href: "https://www.tiktok.com",
      icon: SiTiktok,
      size: 24,
      label: "TikTok"
    },
  ]

  return (
    <footer className="bg-[var(--color-card)]/90 backdrop-blur-xl border-t-2 border-white/5 pt-10 pb-32 md:py-12 w-full mt-auto">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        {/* Contenedor principal - Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-center">

          {/* Copyright - Izquierda en desktop */}
          <div className="text-center md:text-left order-3 md:order-1">
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium opacity-60">
              &copy; {new Date().getFullYear()} AJDREW. Todos los derechos reservados.
            </p>
          </div>

          {/* Redes sociales - Centro */}
          <div className="flex justify-center items-center gap-3 md:gap-4 order-1 md:order-2">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] 
                    transition-all duration-300 hover:scale-110 transform p-2 bg-white/5 rounded-full border border-white/5 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/10"
                >
                  <Icon size={28} className="md:w-6 md:h-6" />
                </a>
              )
            })}
          </div>

          {/* Enlaces legales - Derecha en desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6 order-2 md:order-3">
            <a
              href="/privacy"
              className="text-xs md:text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] 
                transition-colors duration-200 uppercase tracking-wide"
            >
              Política de Privacidad
            </a>
            <span className="hidden sm:inline text-[var(--color-text-secondary)] opacity-30">•</span>
            <a
              href="/terms"
              className="text-xs md:text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] 
                transition-colors duration-200 uppercase tracking-wide"
            >
              Términos de servicio
            </a>
            <span className="hidden sm:inline text-[var(--color-text-secondary)] opacity-30">•</span>
            <a
              href="/admin"
              data-testid="admin-footer-link"
              className="text-[10px] md:text-xs font-black text-[var(--color-text-secondary)]/30 hover:text-[var(--color-primary)] 
                transition-colors duration-200 uppercase tracking-widest"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer