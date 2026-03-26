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
            
            let ogImages: string[] = [];
            if (data.imageUrl) {
                if (data.imageUrl.startsWith('[')) {
                    try {
                        const parsed = JSON.parse(data.imageUrl);
                        ogImages = parsed.map((u: string) => u.startsWith('http') || u.startsWith('/') || u.startsWith('data:') ? u : `data:image/png;base64,${u}`);
                    } catch {}
                } else {
                    ogImages = [data.imageUrl.startsWith('http') || data.imageUrl.startsWith('/') || data.imageUrl.startsWith('data:') ? data.imageUrl : `data:image/png;base64,${data.imageUrl}`];
                }
            }
            
            return {
                title: `${data.tematica} | Votaciones AJDREW`,
                description: `Participa en el torneo ${data.tematica} de ${data.juego?.nombre || 'Gaming'}.`,
                openGraph: {
                    title: `${data.tematica} - Torneo Oficial`,
                    description: `Entra y vota en este torneo activo de AJDREW.`,
                    type: 'website',
                    images: ogImages,
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
