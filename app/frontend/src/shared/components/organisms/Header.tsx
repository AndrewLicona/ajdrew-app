import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import {
  Home,
  Gamepad2,
  Trophy,
  Vote,
  PlayCircle,
  Gift,
  ChevronUp,
  Sun,
  Moon
} from 'lucide-react'

const Header: React.FC = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (pathname?.includes('/admin') || pathname === '/login') return null

  const toggleTheme = () => {
    setTheme(theme === 'plata' ? 'verde' : 'plata')
  }

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Juegos', href: '/juegos', icon: Gamepad2 },
    { name: 'Rankings', href: '/calificaciones', icon: Trophy },
    { name: 'Votaciones', href: '/votaciones', icon: Vote },
    { name: 'Tutoriales', href: '/tutoriales', icon: PlayCircle },
    { name: 'Sorteos', href: '/sorteos', icon: Gift },
  ]

  const mobileNavItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Juegos', href: '/juegos', icon: Gamepad2 },
    { name: 'Tutoriales', href: '/tutoriales', icon: PlayCircle },
    { name: 'Sorteos', href: '/sorteos', icon: Gift },
  ]

  if (!mounted) return null

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[300] md:hidden bg-[var(--color-card)]/80 backdrop-blur-xl border-b border-white/5 h-10 flex items-center justify-between px-4 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/LOGO-AJDREW.png"
            alt="AJDREW"
            width={32}
            height={32}
            className="rounded-lg shadow-lg shrink-0"
          />
          <span className="text-lg font-black text-white italic tracking-tighter uppercase">AJDREW</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] active:scale-90 transition-all"
        >
          {theme === 'plata' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 w-full z-[200] hidden md:block bg-[var(--color-background)] border-b border-[var(--color-primary)]/10 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center h-[70px] justify-between gap-2">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/LOGO-AJDREW.png"
                alt="AJDREW"
                width={45}
                height={45}
                priority
                className="rounded-xl shadow-xl transition-transform hover:rotate-3"
              />
              <span className="text-xl font-black text-white italic tracking-tighter uppercase">AJDREW</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-lg hover:bg-[var(--color-primary)]/5 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-white'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all active:scale-95"
              >
                {theme === 'plata' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar (Island) */}
      <div className="fixed bottom-6 left-4 right-4 md:hidden z-[400] flex justify-center pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto">
          {/* Community Dropup Menu */}
          {isCommunityOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-4 bg-[var(--color-card)] border border-[var(--color-primary)]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-2 grid grid-cols-2 gap-2">
                <Link
                  href="/calificaciones"
                  onClick={() => setIsCommunityOpen(false)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${pathname === '/calificaciones' ? 'bg-[var(--color-primary)] text-white' : 'text-white/40 hover:bg-white/5'
                    }`}
                >
                  <Trophy size={20} />
                  <span className="text-[10px] font-black uppercase">Rankings</span>
                </Link>
                <Link
                  href="/votaciones"
                  onClick={() => setIsCommunityOpen(false)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${pathname === '/votaciones' ? 'bg-[var(--color-primary)] text-white' : 'text-white/40 hover:bg-white/5'
                    }`}
                >
                  <Vote size={20} />
                  <span className="text-[10px] font-black uppercase">Votaciones</span>
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Island BAR */}
          <nav className="bg-[var(--color-card)]/90 backdrop-blur-2xl border border-[var(--color-primary)]/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center p-1 justify-between">
            {mobileNavItems.slice(0, 2).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsCommunityOpen(false)}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all duration-300 flex-1 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] opacity-60'
                    }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-[8.5px] font-bold uppercase tracking-tight">{item.name}</span>
                </Link>
              )
            })}

            {/* Comunidad Toggle Button */}
            <button
              onClick={() => setIsCommunityOpen(!isCommunityOpen)}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 flex-1 relative ${isCommunityOpen || pathname === '/calificaciones' || pathname === '/votaciones' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] opacity-60'
                }`}
            >
              <div className="relative">
                <Trophy className="w-4.5 h-4.5" />
                <ChevronUp className={`w-2.5 h-2.5 absolute -top-1 -right-2.5 transition-transform duration-300 ${isCommunityOpen ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[8.5px] font-bold uppercase tracking-tight">Comunidad</span>
            </button>

            {mobileNavItems.slice(2).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsCommunityOpen(false)}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all duration-300 flex-1 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] opacity-60'
                    }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-[8.5px] font-bold uppercase tracking-tight">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header
