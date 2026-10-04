'use client';
import React from 'react';
import {
  FaDiscord,
  FaXTwitter,
  FaFacebook,
  FaYoutube,
  FaMeta,
} from 'react-icons/fa6';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Plataforma } from '../types';

interface PlatformIconProps {
  plataforma: Plataforma;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Icono de marca oficial para cada plataforma soportada.
 *
 * Usa `react-icons` (Fa6 y Fa) en lugar de emojis Unicode para mantener
 * una identidad visual consistente con el resto del proyecto.
 *
 * Plataformas:
 *  - discord  → FaDiscord
 *  - x        → FaXTwitter (logo de X/Twitter)
 *  - meta     → FaMeta (logo corporativo de Meta, usado para FB + IG)
 *  - youtube  → FaYoutube
 */
export function PlatformIcon({
  plataforma,
  size = 16,
  className = '',
  showLabel = false,
}: PlatformIconProps) {
  const map: Record<
    Plataforma,
    {
      Icon: React.ComponentType<{ size?: number; className?: string; 'aria-label'?: string }>;
      label: string;
      color: string;
    }
  > = {
    discord: {
      Icon: FaDiscord as any,
      label: 'Discord',
      color: 'text-indigo-400',
    },
    x: {
      Icon: FaXTwitter as any,
      label: 'X / Twitter',
      color: 'text-white',
    },
    meta: {
      Icon: FaMeta as any,
      label: 'Meta (Facebook + Instagram)',
      color: 'text-blue-500',
    },
    youtube: {
      Icon: FaYoutube as any,
      label: 'YouTube',
      color: 'text-red-500',
    },
  };

  const { Icon, label, color } = map[plataforma];

  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${color}`}>
        <Icon size={size} className={className} aria-label={label} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </span>
    );
  }

  return (
    <Icon
      size={size}
      className={`${color} ${className}`}
      aria-label={label}
    />
  );
}

/**
 * Subcomponente para mostrar los logos individuales de Facebook e Instagram
 * (la plataforma "meta" agrupa ambos).
 */
export function MetaBrandIcons({
  size = 14,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <FaFacebookF size={size} className={`text-blue-500 ${className}`} />
      <FaInstagram size={size} className={`text-pink-500 ${className}`} />
    </span>
  );
}