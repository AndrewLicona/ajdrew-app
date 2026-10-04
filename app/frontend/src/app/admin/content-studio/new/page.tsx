'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Gift,
  PlayCircle,
  Vote,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  preview,
  publishNow,
  schedule,
  fetchRecursosByTipo,
} from '@/modules/content-studio/services/content-studio.service';
import {
  TipoRecurso,
  TIPOS_RECURSO,
  TIPOS_RECURSO_LABEL,
  Plataforma,
  PLATAFORMAS,
  PreviewResult,
} from '@/modules/content-studio/types';
import { SocialPreviewPanel } from '@/modules/content-studio/components/SocialPreviewPanel';

const ICON_BY_TIPO: Record<TipoRecurso, React.ComponentType<any>> = {
  sorteo: Gift,
  tutorial: PlayCircle,
  bracket: Vote,
  ranking: BarChart3,
};

export default function NewContentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoRecurso | null>(null);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [recursoId, setRecursoId] = useState('');
  const [recursoLabel, setRecursoLabel] = useState('');
  const [plataformas, setPlataformas] = useState<Plataforma[]>(['discord', 'x']);
  const [previewData, setPreviewData] = useState<PreviewResult | null>(null);
  const [textosOverride, setTextosOverride] = useState<Record<string, string>>({});
  const [activePlataforma, setActivePlataforma] = useState<Plataforma>('discord');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [programadoPara, setProgramadoPara] = useState('');

  // ── Step 1: cargar recursos según tipo ──
  useEffect(() => {
    if (tipo) {
      fetchRecursosByTipo(tipo).then(setRecursos);
    }
  }, [tipo]);

  // ── Step 3: cuando cambian los parámetros, regenerar preview ──
  useEffect(() => {
    if (step === 3 && tipo && recursoId && plataformas.length > 0) {
      setLoadingPreview(true);
      preview({ tipo, referenciaId: recursoId, plataformas })
        .then(setPreviewData)
        .catch((err) => Swal.fire('Error', err.message, 'error'))
        .finally(() => setLoadingPreview(false));
    }
  }, [step, tipo, recursoId, plataformas.join(',')]);

  const handleSelectTipo = (t: TipoRecurso) => {
    setTipo(t);
    setRecursos([]);
    setRecursoId('');
    setStep(2);
  };

  const handleSelectRecurso = (id: string) => {
    setRecursoId(id);
    const r = recursos.find((x) => x.id === id);
    setRecursoLabel(r?.titulo || r?.nombre || r?.tematica || id);
    setStep(3);
  };

  const togglePlataforma = (p: Plataforma) => {
    setPlataformas((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const handlePublicar = async (programar: boolean) => {
    if (!tipo || !recursoId) return;
    try {
      if (programar) {
        if (!programadoPara) {
          Swal.fire('Error', 'Selecciona una fecha para programar', 'warning');
          return;
        }
        await schedule({
          tipo,
          referenciaId: recursoId,
          plataformas,
          programadoPara: new Date(programadoPara).toISOString(),
          textosOverride: Object.keys(textosOverride).length > 0 ? textosOverride : undefined,
        });
        Swal.fire({
          icon: 'success',
          title: '¡Programado!',
          text: `Se publicará el ${new Date(programadoPara).toLocaleString('es-CO')}`,
          timer: 2000,
        });
      } else {
        await publishNow({
          tipo,
          referenciaId: recursoId,
          plataformas,
          textosOverride: Object.keys(textosOverride).length > 0 ? textosOverride : undefined,
        });
        Swal.fire({
          icon: 'success',
          title: '¡Publicado!',
          text: 'Las redes seleccionadas están publicando ahora',
          timer: 2000,
        });
      }
      router.push('/admin/content-studio');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step >= s
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white/5 text-white/40'
              }`}
            >
              {step > s ? <Check size={14} /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 w-12 transition-all ${
                  step > s ? 'bg-[var(--color-primary)]' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: tipo */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white italic uppercase">
              ¿Qué quieres publicar?
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Selecciona el tipo de contenido. Podrás previsualizar antes de enviar.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIPOS_RECURSO.map((t) => {
              const Icon = ICON_BY_TIPO[t];
              return (
                <button
                  key={t}
                  onClick={() => handleSelectTipo(t)}
                  className="bg-[var(--color-card)] border border-white/5 p-6 rounded-2xl hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all group flex flex-col items-center gap-3"
                >
                  <div className="p-4 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <p className="text-sm font-black text-white uppercase italic">
                    {TIPOS_RECURSO_LABEL[t]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: seleccionar recurso */}
      {step === 2 && tipo && (
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-black uppercase"
          >
            <ArrowLeft size={14} /> Volver
          </button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white italic uppercase">
              Selecciona el {TIPOS_RECURSO_LABEL[tipo]}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recursos.length === 0 ? (
              <div className="col-span-full p-12 text-center opacity-40 italic">
                <Loader2 className="mx-auto animate-spin mb-2" />
                Cargando...
              </div>
            ) : (
              recursos.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRecurso(r.id)}
                  className="bg-[var(--color-card)] border border-white/5 p-4 rounded-2xl hover:border-[var(--color-primary)]/40 transition-all text-left"
                >
                  <p className="text-sm font-bold text-white">
                    {r.titulo || r.nombre || r.tematica}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-black">
                    {r.estado || 'Activo'} • {r.juego?.nombre || ''}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* STEP 3: seleccionar plataformas + preview */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: configuración */}
          <div className="space-y-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-black uppercase"
            >
              <ArrowLeft size={14} /> Volver
            </button>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Recurso seleccionado
              </p>
              <p className="text-lg font-black text-white italic">{recursoLabel}</p>
            </div>

            <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-black text-white uppercase tracking-widest">
                Plataformas
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PLATAFORMAS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlataforma(p)}
                    className={`p-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                      plataformas.includes(p)
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'bg-black/30 text-white/40 border-white/10 hover:text-white/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={plataformas.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-primary)] text-white text-sm font-black uppercase rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              Continuar <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: preview sticky */}
          <div>
            {loadingPreview ? (
              <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-12 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/40" size={24} />
              </div>
            ) : (
              <SocialPreviewPanel
                preview={previewData}
                activePlataforma={activePlataforma}
                onChangePlataforma={setActivePlataforma}
              />
            )}
          </div>
        </div>
      )}

      {/* STEP 4: editar texto + publicar */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-black uppercase"
            >
              <ArrowLeft size={14} /> Volver
            </button>
            <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-black text-white uppercase tracking-widest">
                Programar (opcional)
              </p>
              <input
                type="datetime-local"
                value={programadoPara}
                onChange={(e) => setProgramadoPara(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePublicar(false)}
                disabled={!previewData}
                className="flex items-center justify-center gap-2 px-4 py-4 bg-[var(--color-primary)] text-white text-sm font-black uppercase rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send size={16} /> Publicar ahora
              </button>
              <button
                onClick={() => handlePublicar(true)}
                disabled={!previewData || !programadoPara}
                className="flex items-center justify-center gap-2 px-4 py-4 bg-yellow-500 text-black text-sm font-black uppercase rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Calendar size={16} /> Programar
              </button>
            </div>
          </div>
          <div>
            <SocialPreviewPanel
              preview={previewData}
              activePlataforma={activePlataforma}
              onChangePlataforma={setActivePlataforma}
              textosOverride={textosOverride}
              onChangeTexto={(p, texto) =>
                setTextosOverride((prev) => ({ ...prev, [p]: texto }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}