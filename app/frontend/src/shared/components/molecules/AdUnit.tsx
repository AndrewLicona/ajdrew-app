// AdUnit — Renderiza un slot de AdSense SOLO si NEXT_PUBLIC_ENABLE_ADS=true
// Kill-switch: deja este componente en el layout/páginas pero mantenlo apagado en prod
// hasta que tengas suficiente tráfico orgánico. No hay riesgo para YouTube AdSense.

'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;          // Data-ad-slot de AdSense, ej: "1234567890"
  format?: string;       // "auto" | "fluid" | "rectangle"
  responsive?: boolean;
  className?: string;
}

const ADS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

export function AdUnit({ slot, format = 'auto', responsive = true, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // silently ignore — ads blocked or not loaded
    }
  }, []);

  // Si los anuncios están desactivados, no renderizar absolutamente nada
  if (!ADS_ENABLED) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
