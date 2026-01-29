import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Torneo AJDREW';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    let bracketName = 'Torneo';
    let tematica = 'Gaming';
    let estado = 'ACTIVO';
    let ronda = 1;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${params.slug}`);
        if (res.ok) {
            const data = await res.json();
            tematica = data.tematica;
            bracketName = data.juego?.nombre || 'Torneo';
            estado = data.estado;
            ronda = data.rondaActual;
        }
    } catch (e) {
        console.error('Failed to fetch bracket for OG', e);
    }

    const isActive = estado === 'ACTIVA' || estado === 'CREADO';

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
                    background: 'linear-gradient(to bottom, #000000, #111111)',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    opacity: 0.2,
                }} />

                {/* Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: isActive ? '#22c55e' : '#fbbf24', // Green for active, Gold for finished
                    filter: 'blur(200px)',
                    opacity: 0.15,
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
                        gap: '20px',
                        marginBottom: '30px',
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            fontSize: 20,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}>
                            {bracketName}
                        </div>
                        <div style={{
                            backgroundColor: isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                            color: isActive ? '#22c55e' : '#fbbf24',
                            border: isActive ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)',
                            padding: '10px 30px',
                            borderRadius: '50px',
                            fontSize: 20,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}>
                            {isActive ? `Ronda ${ronda}` : 'Finalizado'}
                        </div>
                    </div>

                    <div style={{
                        fontSize: 80,
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        marginBottom: '40px',
                        textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                        maxWidth: '1000px',
                    }}>
                        {tematica}
                    </div>

                    <div style={{
                        fontSize: 32,
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        backgroundColor: '#000',
                        padding: '15px 40px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        {isActive ? '🏆 ¡Entra y Vota Ahora!' : '👑 ¡Mira los Resultados!'}
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 40,
                    color: '#22c55e',
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                }}>
                    AJDREW.COM
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
