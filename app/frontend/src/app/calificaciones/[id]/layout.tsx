import { Metadata } from 'next';

type Props = {
    params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calificaciones/public`);
        if (res.ok) {
            const data = await res.json();
            const category = data.find((c: any) => c.id === params.id);
            if (category) {
                let ogImages: string[] = [];
                if (category.imageUrl) {
                    if (category.imageUrl.startsWith('[')) {
                        try {
                            const parsed = JSON.parse(category.imageUrl);
                            ogImages = parsed.map((u: string) => u.startsWith('http') || u.startsWith('/') || u.startsWith('data:') ? u : `data:image/png;base64,${u}`);
                        } catch {}
                    } else {
                        ogImages = [category.imageUrl.startsWith('http') || category.imageUrl.startsWith('/') || category.imageUrl.startsWith('data:') ? category.imageUrl : `data:image/png;base64,${category.imageUrl}`];
                    }
                }

                return {
                    title: `Ranking: ${category.nombre} | AJDREW`,
                    description: `Descubre el Top 5 Oficial de ${category.nombre} y mira quiénes dominan la lista.`,
                    openGraph: {
                        title: `Ranking Oficial - ${category.nombre}`,
                        description: `Mira la lista completa y los puntajes más altos en este ranking.`,
                        type: 'website',
                        images: ogImages,
                    }
                };
            }
        }
    } catch (e) {
        console.error('Error generating metadata for ranking', e);
    }
    
    return {
        title: 'Ranking Oficial | AJDREW',
        description: 'Descubre los mejores ítems calificados por la comunidad.',
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
