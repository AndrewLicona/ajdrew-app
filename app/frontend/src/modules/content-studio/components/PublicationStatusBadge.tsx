'use client';
import React from 'react';
import { CheckCircle, XCircle, Loader2, Calendar } from 'lucide-react';
import { EstadoPublicacion } from '../types';

const config: Record<
  EstadoPublicacion,
  { icon: React.ComponentType<any>; color: string; bg: string; label: string }
> = {
  PENDIENTE: {
    icon: Loader2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'Pendiente',
  },
  PUBLICADO: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    label: 'Publicado',
  },
  FALLIDO: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    label: 'Fallido',
  },
  PROGRAMADO: {
    icon: Calendar,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    label: 'Programado',
  },
};

export function PublicationStatusBadge({ estado }: { estado: EstadoPublicacion }) {
  const c = config[estado];
  const Icon = c.icon;
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.bg} ${c.color}`}
    >
      <Icon size={10} className={estado === 'PENDIENTE' ? 'animate-spin' : ''} />
      {c.label}
    </div>
  );
}