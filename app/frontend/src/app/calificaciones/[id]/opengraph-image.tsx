import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Ranking AJDREW';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    let categoryName = 'Ranking General';
    let juegoNombre = 'Gaming Elite';

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calificaciones/public`);
        if (res.ok) {
            const data = await res.json();
            const category = data.find((c: any) => c.id === params.id);
            if (category) {
                categoryName = category.nombre;
                // Since the public endpoint usually returns minimal data, we might not get the full juego object
                // unless the endpoint structure supports it. Assuming basic data available.
                // If not efficient, we fallback to generic text.
                // Ideally we would have a specific endpoint for detail, but reusing existing.
            }
        }
    } catch (e) {
        console.error('Failed to fetch ranking for OG', e);
    }

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
                    background: 'linear-gradient(to bottom right, #050505, #1a1a1a)',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 600,
                    height: 600,
                    background: '#22c55e',
                    filter: 'blur(200px)',
                    opacity: 0.1,
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 500,
                    height: 500,
                    background: '#8b5cf6', // Violet accent
                    filter: 'blur(180px)',
                    opacity: 0.1,
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    padding: '60px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '40px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}>
                    <div style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '10px 30px',
                        borderRadius: '50px',
                        fontSize: 24,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        marginBottom: '30px',
                        letterSpacing: '0.1em',
                    }}>
                        Ranking Oficial
                    </div>

                    <div style={{
                        fontSize: 70,
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        marginBottom: '20px',
                        textShadow: '0 5px 20px rgba(0,0,0,0.8)',
                        maxWidth: '900px',
                    }}>
                        {categoryName}
                    </div>

                    <div style={{
                        fontSize: 30,
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        Descubre quiénes dominan el Top 10
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    opacity: 0.8,
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                    }} />
                    <div style={{
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                    }}>AJDREW.COM</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
