import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Ranking AJDREW';
export const size = {
    width: 630, // Using a portrait/square-ish ratio if we want to match exactly, but let's stick to standard landscape 1200x630 or 800x800. Let's use 840x1000 to match the vertical list shape, Twitter will display it if valid or crop it. Actually, standard is 1200x630.
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    let categoryName = 'RANKING GENERAL';
    let rankingItems: any[] = [];

    try {
        // Fetch Category Info
        const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calificaciones/public`);
        if (resCat.ok) {
            const dataCat = await resCat.json();
            const category = dataCat.find((c: any) => c.id === params.id);
            if (category) {
                categoryName = category.nombre;
            }
        }

        // Fetch Top 5 Ranking
        const resRanking = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calificaciones/ranking-list?categoryId=${params.id}&limit=5`);
        if (resRanking.ok) {
            rankingItems = await resRanking.json();
        }
    } catch (e) {
        console.error('Failed to fetch ranking for OG', e);
    }

    // Ensure we have at least some layout if empty
    if (rankingItems.length === 0) {
        rankingItems = [
            { itemName: 'Esperando votos...', averageRating: 0, ratingCount: 0 }
        ];
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
                    background: '#0a0d0a', // very dark green/black
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Main Card */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '900px', // constrain width within 1200
                    height: '580px', // constrain height within 630
                    background: '#111811', // dark card background
                    borderRadius: '40px',
                    border: '1px solid #1f291f',
                    padding: '30px 50px',
                }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #22c55e', color: '#22c55e', fontSize: 20
                        }}>
                            🏆
                        </div>
                        <h1 style={{ color: '#ffffff', fontSize: 36, fontWeight: 900, fontStyle: 'italic', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            RANKING <span style={{ color: '#22c55e' }}>OFICIAL</span>
                        </h1>
                    </div>

                    <h2 style={{ color: '#ffffff', fontSize: 32, fontWeight: 900, marginTop: '20px', marginBottom: '20px' }}>
                        Top 5: {categoryName.toUpperCase()}
                    </h2>

                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        {rankingItems.slice(0, 5).map((item, index) => {
                            const pct = Math.min((item.averageRating / 5) * 100, 100);
                            let rankColor = '#666';
                            let icon = `#${index + 1}`;
                            if (index === 0) { rankColor = '#eab308'; icon = '🏆'; }
                            if (index === 1) { rankColor = '#cbd5e1'; icon = '🥈'; }
                            if (index === 2) { rankColor = '#b45309'; icon = '🥉'; }

                            return (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', background: '#0d120d', borderRadius: '20px', padding: '10px 20px', border: '1px solid #1a221a'
                                }}>
                                    {/* Rank */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', fontSize: index < 3 ? '24px' : '20px', color: rankColor, fontWeight: 900, marginRight: '15px' }}>
                                        {icon}
                                    </div>
                                    
                                    {/* Image */}
                                    {item.itemImage ? (
                                        <img src={item.itemImage} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #333' }} />
                                    ) : (
                                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#222', border: '1px solid #333' }} />
                                    )}

                                    {/* Details */}
                                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
                                            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}>
                                                {item.itemName}
                                            </span>
                                            <span style={{ color: '#22c55e', fontSize: 20, fontWeight: 900 }}>
                                                {item.averageRating.toFixed(1)}
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar Container */}
                                        <div style={{ display: 'flex', width: '100%', height: '8px', background: '#1c281c', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', width: `${pct}%`, height: '100%', background: '#06b6d4' }} />
                                        </div>
                                        
                                        <span style={{ color: '#6b7280', fontSize: 14, fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>
                                            {item.ratingCount} VOTOS
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
