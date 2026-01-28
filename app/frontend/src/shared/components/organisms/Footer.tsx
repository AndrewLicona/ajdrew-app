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
    <footer className="bg-[var(--color-card)] border-t border-[var(--color-card-border)] py-6 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal - Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Copyright - Izquierda en desktop */}
          <div className="text-center md:text-left">
            <p className="text-sm text-[var(--color-text-secondary)]">
              &copy; {new Date().getFullYear()} AJDREW. Todos los derechos reservados.
            </p>
          </div>

          {/* Redes sociales - Centro */}
          <div className="flex justify-center items-center gap-4">
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
                    transition-colors duration-200 hover:scale-110 transform"
                >
                  <Icon size={social.size} />
                </a>
              )
            })}
          </div>

          {/* Enlaces legales - Derecha en desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 sm:gap-4">
            <a
              href="/privacy"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] 
                transition-colors duration-200"
            >
              Política de Privacidad
            </a>
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">•</span>
            <a
              href="/terms"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] 
                transition-colors duration-200"
            >
              Términos de Servicio
            </a>
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">•</span>
            <a
              href="/admin"
              className="text-xs text-[var(--color-text-secondary)]/50 hover:text-[var(--color-primary)] 
                transition-colors duration-200"
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