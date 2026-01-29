import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tutorial AJDREW';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    // Fetch data inside the edge function
    // Note: We need the full URL to fetch from our own API in edge runtime, 
    // or we can fetch directly from an external DB if using Vercel/Neon etc.
    // For simplicity/locality, we will try to fetch from the public API if possible,
    // or just use generic data if the API is not reachable from the build context.

    // Ideally, pass the title/image as search params effectively or fetch from API.
    // Since we don't have direct DB access here easily without complex setup, 
    // we will fetch from the API using the slug.

    let tutorialData = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutoriales/${params.slug}`);
        if (res.ok) {
            tutorialData = await res.json();
        }
    } catch (e) {
        console.error('Failed to fetch tutorial for OG', e);
    }

    const title = tutorialData?.titulo || 'Tutorial Gaming Elite';
    const juego = tutorialData?.juego?.nombre || 'Gaming';
    const difficulty = tutorialData?.dificultad || 'PRO';
    const bgImage = tutorialData?.image || tutorialData?.juego?.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'; // Fallback

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#050505',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Image with Dark Overlay */}
                <img
                    src={bgImage}
                    alt={title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.4,
                    }}
                />

                {/* Branding Stripe */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '16px',
                    background: '#22c55e', // Primary Color
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    padding: '40px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginBottom: '20px',
                    }}>
                        <div style={{
                            backgroundColor: '#22c55e',
                            color: '#000',
                            padding: '8px 24px',
                            borderRadius: '50px',
                            fontSize: 24,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                        }}>
                            {juego}
                        </div>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '8px 24px',
                            borderRadius: '50px',
                            fontSize: 24,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                        }}>
                            Nivel {difficulty}
                        </div>
                    </div>

                    <div style={{
                        fontSize: 80,
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 0.9,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.05em',
                        marginBottom: '20px',
                        textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    }}>
                        {title}
                    </div>

                    <div style={{
                        fontSize: 32,
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 600,
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        AJDREW.COM
                    </div>
                </div>

                {/* Logo Corner */}
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 40,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div style={{
                        color: '#22c55e',
                        fontSize: 40,
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                    }}>AJDREW</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
