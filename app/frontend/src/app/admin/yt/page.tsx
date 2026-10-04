'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BarChart2, ExternalLink, Youtube, Eye, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { Bt } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';

interface YTViaje {
  id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  youtubeUrl: string;
  thumbnail?: string;
  activo: boolean;
  recursoTipo?: string;
  recursoId?: string;
  createdAt: string;
  _count?: { visitas: number };
}

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

const EMPTY: Partial<YTViaje> = {
  slug: '', titulo: '', descripcion: '', youtubeUrl: '', recursoTipo: '', recursoId: '', activo: true,
};

export default function YTViajesAdminPage() {
  const [viajes, setViajes] = useState<YTViaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<YTViaje>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/yt`, { headers: authHeaders() });
      if (res.ok) setViajes(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(EMPTY); setShowForm(true); };
  const openEdit = (v: YTViaje) => { setEditing({ ...v }); setShowForm(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!editing.id;
      const url = isEdit ? `${API}/yt/${editing.id}` : `${API}/yt`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(editing) });
      if (res.ok) { setShowForm(false); load(); }
      else {
        const err = await res.json().catch(() => ({}));
        Swal.fire('Error', err.message || 'No se pudo guardar', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (v: YTViaje) => {
    const { isConfirmed } = await Swal.fire({
      title: `¿Eliminar "${v.titulo}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    await fetch(`${API}/yt/${v.id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/yt/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic flex items-center gap-2">
            <Youtube size={22} className="text-red-500" /> YT Viajes
          </h1>
          <p className="text-white/40 text-sm mt-1">Páginas de destino vinculadas a tus videos de YouTube</p>
        </div>
        <Bt onClick={openNew} className="gap-2">
          <Plus size={16} /> Nuevo Viaje
        </Bt>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-white/40 text-sm">Cargando...</div>
      ) : viajes.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Youtube size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aún no hay viajes. Crea el primero con el botón de arriba.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viajes.map((v) => (
            <div key={v.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">{v.titulo}</h3>
                    {!v.activo && <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/40">Inactivo</span>}
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5 font-mono">/yt/{v.slug}</p>
                  {v.descripcion && <p className="text-xs text-white/50 mt-1 line-clamp-2">{v.descripcion}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <a href={`/yt/${v.slug}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all">
                    <Eye size={14} />
                  </a>
                  <button onClick={() => copyLink(v.slug)}
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all">
                    {copied === v.slug ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => openEdit(v)}
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-[var(--color-primary)]/20 transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => remove(v)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-white/40 border-t border-white/5 pt-2">
                <span className="flex items-center gap-1"><Eye size={11} /> {v._count?.visitas ?? 0} visitas</span>
                {v.recursoTipo && <span className="capitalize">Recurso: {v.recursoTipo}</span>}
                <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-red-400/60 hover:text-red-400 transition-colors">
                  <Youtube size={11} /> YouTube <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 shadow-2xl z-10">
            <h2 className="text-lg font-bold text-white mb-4">{editing.id ? 'Editar Viaje' : 'Nuevo Viaje'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <Label htmlFor="yt-titulo">Título *</Label>
                <Input id="yt-titulo" value={editing.titulo || ''} onChange={e => setEditing(p => ({ ...p, titulo: e.target.value }))} placeholder="Ej: TOTY FC Mobile 2024 — ¡Votá!" required />
              </div>
              <div>
                <Label htmlFor="yt-slug">Slug (URL) *</Label>
                <Input id="yt-slug" value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="toty-fc-mobile-2024" required />
                {editing.slug && <p className="text-[10px] text-white/30 mt-1">/yt/{editing.slug}</p>}
              </div>
              <div>
                <Label htmlFor="yt-url">URL de YouTube *</Label>
                <Input id="yt-url" value={editing.youtubeUrl || ''} onChange={e => setEditing(p => ({ ...p, youtubeUrl: e.target.value }))} placeholder="https://youtu.be/..." required />
              </div>
              <div>
                <Label htmlFor="yt-desc">Descripción</Label>
                <Input id="yt-desc" value={editing.descripcion || ''} onChange={e => setEditing(p => ({ ...p, descripcion: e.target.value }))} placeholder="Breve descripción para la landing..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="yt-tipo">Tipo de Recurso</Label>
                  <select id="yt-tipo" value={editing.recursoTipo || ''}
                    onChange={e => setEditing(p => ({ ...p, recursoTipo: e.target.value }))}
                    className="w-full h-11 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-[var(--color-primary)] outline-none text-sm">
                    <option value="">Ninguno</option>
                    <option value="ranking">Ranking</option>
                    <option value="votacion">Votación</option>
                    <option value="sorteo">Sorteo</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="yt-rid">ID del Recurso</Label>
                  <Input id="yt-rid" value={editing.recursoId || ''} onChange={e => setEditing(p => ({ ...p, recursoId: e.target.value }))} placeholder="ID o slug del recurso" />
                </div>
              </div>
              {editing.id && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="yt-activo" checked={!!editing.activo}
                    onChange={e => setEditing(p => ({ ...p, activo: e.target.checked }))}
                    className="accent-[var(--color-primary)]" />
                  <Label htmlFor="yt-activo">Activo (visible en /yt/[slug])</Label>
                </div>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <Bt variant="secondary" type="button" onClick={() => setShowForm(false)} disabled={saving}>Cancelar</Bt>
                <Bt type="submit" loading={saving}>Guardar</Bt>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
