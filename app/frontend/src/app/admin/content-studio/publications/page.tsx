'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  RotateCw,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  listPublications,
  retryPublication,
} from '@/modules/content-studio/services/content-studio.service';
import {
  EstadoPublicacion,
  ESTADOS,
  Plataforma,
  PLATAFORMAS,
  SocialPublication,
} from '@/modules/content-studio/types';
import { PublicationStatusBadge } from '@/modules/content-studio/components/PublicationStatusBadge';
import { PlatformIcon } from '@/modules/content-studio/components/PlatformIcon';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<SocialPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<EstadoPublicacion | ''>('FALLIDO');
  const [filterPlataforma, setFilterPlataforma] = useState<Plataforma | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retrying, setRetrying] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listPublications({
        estado: filterEstado || undefined,
        plataforma: filterPlataforma || undefined,
        page,
        limit: 20,
      });
      setPublications(res.publications);
      setTotalPages(res.pagination.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterEstado, filterPlataforma, page]);

  const handleRetry = async (id: string) => {
    setRetrying(id);
    try {
      await retryPublication(id);
      Swal.fire({
        icon: 'success',
        title: 'Reintentando',
        text: 'La publicación se está procesando de nuevo',
        timer: 1500,
      });
      await load();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setRetrying(null);
    }
  };

  const filtered = publications.filter((p) =>
    p.textoFinal.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white italic uppercase">
          Historial de Publicaciones
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Revisa el estado de cada publicación y reintenta las que fallaron.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Buscar en el texto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value as EstadoPublicacion | '')}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase text-white"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={filterPlataforma}
            onChange={(e) => setFilterPlataforma(e.target.value as Plataforma | '')}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase text-white"
          >
            <option value="">Todas las plataformas</option>
            {PLATAFORMAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-white/60 hover:text-white"
          >
            <RefreshCw size={14} />
            Refrescar
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-white/40" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-[var(--color-card)] rounded-2xl border border-white/5">
            <p className="text-white/40 italic text-sm">Sin publicaciones con esos filtros</p>
          </div>
        ) : (
          filtered.map((pub) => (
            <div
              key={pub.id}
              className="bg-[var(--color-card)] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="shrink-0 mt-1">
                    <PlatformIcon plataforma={pub.plataforma} size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white whitespace-pre-wrap break-words font-mono leading-relaxed">
                      {pub.textoFinal}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <PublicationStatusBadge estado={pub.estado} />
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
                        {pub.evento}
                      </span>
                      <span className="text-[9px] text-white/30">
                        {new Date(pub.createdAt).toLocaleString('es-CO')}
                      </span>
                      {pub.intentos > 0 && (
                        <span className="text-[9px] text-yellow-400 font-black uppercase">
                          {pub.intentos} intento(s)
                        </span>
                      )}
                    </div>
                    {pub.errorMsg && (
                      <details className="mt-2 text-[10px]">
                        <summary className="cursor-pointer text-red-400 uppercase font-black">
                          Ver error
                        </summary>
                        <pre className="mt-2 p-2 bg-red-500/10 rounded text-red-300 overflow-x-auto">
                          {pub.errorMsg}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                {pub.estado === 'FALLIDO' && (
                  <button
                    onClick={() => handleRetry(pub.id)}
                    disabled={retrying === pub.id}
                    className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/20 text-[10px] font-black uppercase hover:bg-yellow-500/20 disabled:opacity-50"
                  >
                    {retrying === pub.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RotateCw size={12} />
                    )}
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-white/60 hover:text-white disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="text-xs font-black text-white/40">
            Página {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-white/60 hover:text-white disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}