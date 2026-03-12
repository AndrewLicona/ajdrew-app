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
    let matches: any[] = [];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votaciones/${params.slug}`);
        if (res.ok) {
            const data = await res.json();
            tematica = data.tematica;
            bracketName = data.juego?.nombre || 'Torneo';
            estado = data.estado;
            ronda = data.rondaActual;
            matches = data.matches || [];
        }
    } catch (e) {
        console.error('Failed to fetch bracket for OG', e);
    }

    const isActive = estado === 'ACTIVA' || estado === 'CREADO';
    
    // We want to show a simplified tree for the OG image.
    // Let's grab the matches for the current round, or the last round if finished.
    let displayMatches = matches.filter(m => m.ronda === ronda);
    if (displayMatches.length === 0 && matches.length > 0) {
        displayMatches = matches.filter(m => m.ronda === 1);
    }
    
    // For visual balance, take up to 4 matches to show on the sides
    const maxMatches = Math.min(displayMatches.length, 4);
    const renderMatches = displayMatches.slice(0, maxMatches);
    
    // Split into left and right wings
    const leftMatches = renderMatches.slice(0, Math.ceil(renderMatches.length / 2));
    const rightMatches = renderMatches.slice(Math.ceil(renderMatches.length / 2));

    const renderMatchBox = (match: any) => {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', width: '220px', 
                background: 'rgba(20,25,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', padding: '8px', gap: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '12px' }}>
                    {match?.itemA?.image ? (
                        <img src={match.itemA.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#333' }} />}
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {match?.itemA?.nombre || 'TBD'}
                    </span>
                    <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 900 }}>{match?.votosA || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '12px' }}>
                    {match?.itemB?.image ? (
                        <img src={match.itemB.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#333' }} />}
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {match?.itemB?.nombre || 'TBD'}
                    </span>
                    <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 900 }}>{match?.votosB || 0}</span>
                </div>
            </div>
        );
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
                    background: 'linear-gradient(to bottom, #020617, #0f172a)', // deep blue/slate
                    fontFamily: 'sans-serif',
                    padding: '40px',
                    position: 'relative'
                }}
            >
                {/* Glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 800, height: 800, borderRadius: '50%', background: isActive ? '#3b82f6' : '#eab308',
                    filter: 'blur(200px)', opacity: 0.15,
                }} />

                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
                    <div style={{
                        color: isActive ? '#60a5fa' : '#fde047', border: isActive ? '2px solid #3b82f6' : '2px solid #eab308',
                        padding: '8px 24px', borderRadius: '30px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px',
                        marginBottom: '16px', background: 'rgba(0,0,0,0.3)'
                    }}>
                        {bracketName} • {isActive ? `RONDA ${ronda}` : 'FINALIZADO'}
                    </div>
                    <div style={{
                        fontSize: 64, fontWeight: 900, color: 'white', textTransform: 'uppercase',
                        textShadow: '0 10px 30px rgba(0,0,0,0.8)', textAlign: 'center', lineHeight: 1.1,
                        maxWidth: '1000px'
                    }}>
                        {tematica}
                    </div>
                </div>

                {/* Bracket Layout */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flex: 1, zIndex: 10 }}>
                    
                    {/* Left Wing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                        {leftMatches.length > 0 ? leftMatches.map((m, i) => <div key={i}>{renderMatchBox(m)}</div>) 
                            : <div style={{ color: 'white', opacity: 0.5, fontSize: 24, fontStyle: 'italic' }}>Esperando emparejamientos...</div>}
                    </div>

                    {/* Center Trophy/Final */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 40px' }}>
                         <div style={{
                             width: '120px', height: '160px', border: '2px dashed rgba(255,255,255,0.2)', 
                             borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                             background: 'rgba(0,0,0,0.2)'
                         }}>
                             <span style={{ fontSize: 60, opacity: 0.5 }}>🏆</span>
                         </div>
                    </div>

                    {/* Right Wing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                        {rightMatches.length > 0 ? rightMatches.map((m, i) => <div key={i}>{renderMatchBox(m)}</div>) 
                            : <div style={{ color: 'white', opacity: 0 }} />}
                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute', bottom: 30, right: 40, color: '#94a3b8', fontSize: 24, fontWeight: 900, letterSpacing: '4px'
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
