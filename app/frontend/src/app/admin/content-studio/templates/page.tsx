'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, FileText, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  listTemplates,
  updateTemplate,
  seedTemplates,
} from '@/modules/content-studio/services/content-studio.service';
import {
  Plataforma,
  PLATAFORMAS,
  SocialTemplate,
} from '@/modules/content-studio/types';
import { SocialPreviewPanel } from '@/modules/content-studio/components/SocialPreviewPanel';
import { PlatformIcon } from '@/modules/content-studio/components/PlatformIcon';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<SocialTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (tmpl: SocialTemplate) => {
    if (!tmpl.id) {
      Swal.fire(
        'Info',
        'Este es un template por defecto. Aún no se ha sobrescrito en la base de datos.',
        'info',
      );
      return;
    }
    try {
      await updateTemplate(tmpl.id, { template: editValue });
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        timer: 1500,
        showConfirmButton: false,
      });
      setEditing(null);
      await load();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedTemplates();
      Swal.fire({
        icon: 'success',
        title: 'Templates sincronizados',
        text: `${res.inserted} nuevos, ${res.skipped} ya existían`,
      });
      await load();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const grouped = templates.reduce<Record<string, SocialTemplate[]>>((acc, t) => {
    if (!acc[t.tipo]) acc[t.tipo] = [];
    acc[t.tipo].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase flex items-center gap-3">
            <FileText className="text-[var(--color-primary)]" size={32} />
            Plantillas
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Edita los textos por defecto. Usa placeholders como <code>{'{{titulo}}'}</code> o{' '}
            <code>{'{{premio}}'}</code>.
          </p>
        </div>
        <button
          onClick={handleSeed}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-white/60 hover:text-white"
        >
          <RefreshCw size={14} />
          Sincronizar defaults
        </button>
      </div>

      {/* Cheatsheet de placeholders */}
      <details className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-4 text-xs">
        <summary className="cursor-pointer font-black uppercase tracking-widest text-white/60 hover:text-white">
          Cheatsheet de placeholders
        </summary>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
          {[
            '{{titulo}}',
            '{{premio}}',
            '{{fechaFin}}',
            '{{tematica}}',
            '{{descripcion}}',
            '{{autor}}',
            '{{premioItem}}',
            '{{ganadores}}',
            '{{url}}',
            '{{juego.nombre}}',
            '{{juego.image}}',
            '{{#if image}}...{{/if}}',
            '{{texto | truncate:280}}',
          ].map((p) => (
            <code
              key={p}
              className="px-2 py-1 bg-black/30 rounded text-[var(--color-primary)] font-mono"
            >
              {p}
            </code>
          ))}
        </div>
      </details>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="animate-spin text-white/40" size={24} />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([tipo, tmpls]) => (
            <section
              key={tipo}
              className="bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden"
            >
              <header className="px-6 py-4 border-b border-white/5">
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  {tipo}
                </h2>
              </header>
              <div className="divide-y divide-white/5">
                {tmpls.map((t) => {
                  const keyId = `${t.tipo}-${t.plataforma}`;
                  const isEditing = editing === keyId;
                  return (
                    <div key={keyId} className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <PlatformIcon plataforma={t.plataforma} size={18} />
                          <span className="text-xs font-black uppercase text-white/60">
                            {t.plataforma}
                          </span>
                          {t.isDefault && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase font-black">
                              Default
                            </span>
                          )}
                          {!t.activo && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase font-black">
                              Inactivo
                            </span>
                          )}
                        </div>
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(t)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-[10px] font-black uppercase"
                          >
                            <Save size={12} /> Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditing(keyId);
                              setEditValue(t.template);
                            }}
                            disabled={!t.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-white/60 hover:text-white disabled:opacity-30"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                      {isEditing ? (
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={Math.min(15, Math.max(5, editValue.split('\n').length + 1))}
                          className="w-full bg-black/30 border border-[var(--color-primary)]/30 rounded-xl p-3 text-sm text-white font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                        />
                      ) : (
                        <pre className="bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white whitespace-pre-wrap font-mono leading-relaxed">
                          {t.template}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}