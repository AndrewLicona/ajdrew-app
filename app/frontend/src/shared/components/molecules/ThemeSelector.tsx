// components/ThemeSelector.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Deactivated: Theme selection is now integrated into the headers
  return null;

  const toggleTheme = () => {
    setTheme(theme === 'plata' ? 'verde' : 'plata');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-[1000] h-12 w-12 rounded-full flex items-center justify-center
        bg-[var(--color-card)] text-[var(--color-text)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
        border border-[var(--color-card-border)] hover:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
        focus:ring-offset-2 focus:ring-offset-[var(--color-background)]"
      aria-label={theme === 'plata' ? 'Cambiar a tema verde' : 'Cambiar a tema plata'}
    >
      {theme === 'plata' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}