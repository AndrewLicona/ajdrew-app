'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  HomeIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  const pathname = usePathname()
  
  const linkClasses = 'flex flex-col items-center justify-center gap-1 px-3 py-2 text-[11px] font-medium transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] hover:rounded-2xl rounded-lg'
  const iconClasses = 'w-6 h-6'

  return (
    <nav className="bg-[var(--color-card)] w-full shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[60px] relative">
          {/* Logo a la izquierda */}
          <Link href="/" className="absolute left-4 ">
            <Image 
              src="/LOGO-AJDREW.png" 
              alt="AJDREW Logo" 
              width={40} 
              height={40} 
              priority 
              className="w-12 h-12 rounded-2xl cursor-pointer "
              
            />
          </Link>
          
          {/* Navegación centrada */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
              <Link
                href="/"
                className={`${linkClasses} ${
                  pathname === '/'
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-2xl'
                    : ''
                }`}
              >
                <HomeIcon className={iconClasses} />
                <span>Inicio</span>
              </Link>

              {/* <Link
                href="/juegos"
                className={`${linkClasses} ${
                  pathname?.includes('/juegos')
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-2xl'
                    : ''
                }`}
              >
                <PlayIcon className={iconClasses} />
                <span>Juegos</span>
              </Link> */}

              {/* <Link
                href="/tutoriales"
                className={`${linkClasses} ${
                  pathname?.includes('/tutoriales')
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-2xl'
                    : ''
                }`}
              >
                <BookOpenIcon className={iconClasses} />
                <span>Tutorial</span>
              </Link> */}

              <Link
                href="/calificaciones"
                className={`${linkClasses} ${
                  pathname === '/calificaciones'
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-2xl'
                    : ''
                }`}
              >
                <StarIcon className={iconClasses} />
                <span>Califica</span>
              </Link>

              {/* <Link
                href="/votar"
                className={`${linkClasses} ${
                  pathname === '/votar'
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-2xl'
                    : ''
                }`}
              >
                <InformationCircleIcon className={iconClasses} />
                <span>Votar</span>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header