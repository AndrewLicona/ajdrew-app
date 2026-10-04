'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  Send,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Plus,
  Activity,
} from 'lucide-react';
import {
  listPublications,
} from '@/modules/content-studio/services/content-studio.service';
import {
  Plataforma,
  PLATAFORMAS,
  SocialPublication,
  EstadoPublicacion,
} from '@/modules/content-studio/types';
import { PublicationStatusBadge } from '@/modules/content-studio/components/PublicationStatusBadge';
import { PlatformIcon } from '@/modules/content-studio/components/PlatformIcon';

export default function ContentStudioDashboard() {
  const [publications, setPublications] = useState<SocialPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<EstadoPublicacion | ''>('');

  useEffect(() => {
    loadPublications();
  }, [filterEstado]);

  const loadPublications = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await listPublications({ estado: filterEstado || undefined, limit: 10 });
      setPublications(res.publications);
    } catch (e: any) {
      if (!e?.message?.includes('Unauthorized') && !e?.message?.includes('401')) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    pendientes: publications.filter((p) => p.estado === 'PENDIENTE').length,
    publicados: publications.filter((p) => p.estado === 'PUBLICADO').length,
    fallidos: publications.filter((p) => p.estado === 'FALLIDO').length,
    programados: publications.filter((p) => p.estado === 'PROGRAMADO').length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Share2 className="text-[var(--color-primary)]" size={32} />
            Content Studio
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Crea, previsualiza y publica contenido en tus redes sociales desde un solo lugar.
          </p>
        </div>
        <Link
          href="/admin/content-studio/new"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white text-xs font-black uppercase rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nueva Publicación
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[var(--color-card)] border border-white/5 p-4 md:p-6 rounded-2xl">
          <div className="p-3 rounded-xl inline-flex mb-3 bg-blue-500/10 text-blue-400">
            <Activity size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">{counts.pendientes}</h3>
          <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest mt-1">
            Pendientes
          </p>
        </div>
        <div className="bg-[var(--color-card)] border border-white/5 p-4 md:p-6 rounded-2xl">
          <div className="p-3 rounded-xl inline-flex mb-3 bg-green-500/10 text-green-400">
            <CheckCircle size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">{counts.publicados}</h3>
          <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest mt-1">
            Publicados
          </p>
        </div>
        <div className="bg-[var(--color-card)] border border-white/5 p-4 md:p-6 rounded-2xl">
          <div className="p-3 rounded-xl inline-flex mb-3 bg-red-500/10 text-red-400">
            <XCircle size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">{counts.fallidos}</h3>
          <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest mt-1">
            Fallidos
          </p>
        </div>
        <div className="bg-[var(--color-card)] border border-white/5 p-4 md:p-6 rounded-2xl">
          <div className="p-3 rounded-xl inline-flex mb-3 bg-yellow-500/10 text-yellow-400">
            <Calendar size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">{counts.programados}</h3>
          <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest mt-1">
            Programados
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/content-studio/publications"
          className="bg-[var(--color-card)] border border-white/5 p-6 rounded-2xl hover:border-[var(--color-primary)]/30 transition-all flex items-center gap-4"
        >
          <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase italic">Historial</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Ver todas las publicaciones, reintentar fallidas y descargar logs.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/content-studio/templates"
          className="bg-[var(--color-card)] border border-white/5 p-6 rounded-2xl hover:border-[var(--color-primary)]/30 transition-all flex items-center gap-4"
        >
          <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase italic">Plantillas</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Edita los textos por defecto para cada red social y tipo de evento.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent publications */}
      <section className="bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Send size={14} className="text-[var(--color-primary)]" />
            Publicaciones Recientes
          </h2>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value as EstadoPublicacion | '')}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase text-white"
          >
            <option value="">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="PUBLICADO">Publicados</option>
            <option value="FALLIDO">Fallidos</option>
            <option value="PROGRAMADO">Programados</option>
          </select>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-white/40" size={24} />
            </div>
          ) : publications.length === 0 ? (
            <div className="p-12 text-center opacity-40 italic text-sm">
              No hay publicaciones todavía. ¡Crea la primera!
            </div>
          ) : (
            publications.map((pub) => (
              <div
                key={pub.id}
                className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="shrink-0">
                    <PlatformIcon plataforma={pub.plataforma} size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{pub.textoFinal}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 uppercase font-black">
                      {pub.evento} • {new Date(pub.createdAt).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
                <PublicationStatusBadge estado={pub.estado} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}