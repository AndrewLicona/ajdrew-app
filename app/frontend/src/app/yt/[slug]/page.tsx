import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { YtLandingClient } from './YtLandingClient';

interface YTViaje {
  id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  youtubeUrl: string;
  thumbnail?: string;
  recursoTipo?: string;
  recursoId?: string;
}

async function getViaje(slug: string): Promise<YTViaje | null> {
  try {
    const res = await fetch(
      `${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL}/yt/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const viaje = await getViaje(params.slug);
  if (!viaje) return { title: 'No encontrado' };
  return {
    title: viaje.titulo,
    description: viaje.descripcion || 'Participa en AJDREW — Rankings, Votaciones y más.',
    openGraph: {
      title: viaje.titulo,
      description: viaje.descripcion || '',
      images: viaje.thumbnail ? [viaje.thumbnail] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: viaje.titulo,
      description: viaje.descripcion || '',
      images: viaje.thumbnail ? [viaje.thumbnail] : [],
    },
  };
}

export default async function YtSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const viaje = await getViaje(params.slug);
  if (!viaje) notFound();

  return <YtLandingClient viaje={viaje} />;
}
