import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${slug}`);
        if (res.ok) {
            const data = await res.json();
            return {
                title: `${data.tematica} | Votaciones AJDREW`,
                description: `Participa en el torneo ${data.tematica} de ${data.juego?.nombre || 'Gaming'}.`,
                openGraph: {
                    title: `${data.tematica} - Torneo Oficial`,
                    description: `Entra y vota en este torneo activo de AJDREW.`,
                    type: 'website',
                    images: data.imageUrl ? [data.imageUrl] : [],
                }
            };
        }
    } catch (e) {
        console.error('Error generating metadata for tournament', e);
    }
    
    return {
        title: 'Torneo | AJDREW',
        description: 'Vota en los torneos más populares de la comunidad.',
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
