'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Plataforma, PreviewResult } from '../types';
import { PlatformIcon } from './PlatformIcon';

const PLATFORM_LABELS: Record<Plataforma, string> = {
  discord: 'Discord',
  x: 'Twitter / X',
  meta: 'Facebook + Instagram',
  youtube: 'YouTube',
};

export function SocialPreviewPanel({
  preview,
  activePlataforma,
  onChangePlataforma,
  textosOverride,
  onChangeTexto,
}: {
  preview: PreviewResult | null;
  activePlataforma: Plataforma;
  onChangePlataforma: (p: Plataforma) => void;
  textosOverride?: Record<string, string>;
  onChangeTexto?: (p: Plataforma, texto: string) => void;
}) {
  const plataformas = Object.keys(preview || {}) as Plataforma[];
  const data = preview?.[activePlataforma];

  return (
    <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
        {plataformas.map((p) => (
          <button
            key={p}
            onClick={() => onChangePlataforma(p)}
            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 inline-flex items-center gap-2 ${
              activePlataforma === p
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            <PlatformIcon plataforma={p} size={12} />
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Preview body */}
      <div className="p-4">
        {!data ? (
          <p className="text-white/40 italic text-sm">Sin preview para esta plataforma</p>
        ) : (
          <div className="space-y-3">
            {/* Counter + warning */}
            <div className="flex items-center justify-between text-[10px]">
              <span
                className={`font-black uppercase ${
                  activePlataforma === 'x' && data.charCount > 280
                    ? 'text-red-400'
                    : 'text-white/40'
                }`}
              >
                {data.charCount} / {activePlataforma === 'x' ? '280' : 'sin límite'} caracteres
              </span>
              {data.placeholdersFaltantes?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-yellow-400 font-black uppercase">
                  <AlertTriangle size={12} />
                  {data.placeholdersFaltantes.length} placeholder(s) sin valor
                </span>
              )}
            </div>

            {/* Image preview */}
            {data.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={data.imageUrl} alt="" className="w-full h-auto max-h-64 object-cover" />
              </div>
            )}

            {/* Editor / preview */}
            {onChangeTexto ? (
              <textarea
                value={textosOverride?.[activePlataforma] ?? data.texto}
                onChange={(e) => onChangeTexto(activePlataforma, e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                rows={Math.min(12, Math.max(4, data.texto.split('\n').length + 1))}
              />
            ) : (
              <pre className="bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white whitespace-pre-wrap font-mono leading-relaxed">
                {data.texto}
              </pre>
            )}

            {/* Placeholders info */}
            {data.placeholdersUsados?.length > 0 && (
              <details className="text-[10px]">
                <summary className="cursor-pointer text-white/40 uppercase font-black tracking-widest hover:text-white/70">
                  Placeholders ({data.placeholdersUsados.length})
                </summary>
                <div className="mt-2 flex flex-wrap gap-1">
                  {data.placeholdersUsados.map((p) => (
                    <span
                      key={p}
                      className={`px-2 py-1 rounded-md font-mono text-[10px] ${
                        data.placeholdersFaltantes?.includes(p)
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {`{{${p}}}`}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}