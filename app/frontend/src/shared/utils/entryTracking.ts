/**
 * Entry Tracking Utility
 * 
 * Client-side utility to track user actions and award sorteo entries
 */

interface EntryActionData {
    sorteoId?: string;
    participanteId?: string;
    accion: 'VOTAR_RANKING' | 'PARTICIPAR_BRACKET' | 'VER_TUTORIAL' | 'COMPARTIR';
    origen?: string;
}

/**
 * Track an action and award entry to active sorteos
 */
export async function trackAction(data: EntryActionData): Promise<void> {
    try {
        // Get participanteId from localStorage if not provided
        let participanteId = data.participanteId;

        if (!participanteId) {
            const storedParticipante = localStorage.getItem(`sorteo_${data.sorteoId}_participante`);
            if (storedParticipante) {
                participanteId = storedParticipante;
            }
        }

        if (!participanteId) {
            // User hasn't participated in any sorteo yet
            return;
        }

        // Send entry to backend
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participanteId,
                accion: data.accion,
                origen: data.origen
            })
        });

        console.log(`✅ Entry awarded for ${data.accion}`);
    } catch (error) {
        console.error('Error tracking action:', error);
    }
}

/**
 * Helper to store participante ID after successful participation
 */
export function storeParticipanteId(sorteoId: string, participanteId: string): void {
    localStorage.setItem(`sorteo_${sorteoId}_participante`, participanteId);
}

/**
 * Track social share action
 */
export async function trackShare(sorteoId: string, platform: string): Promise<void> {
    await trackAction({
        sorteoId,
        accion: 'COMPARTIR',
        origen: platform
    });
}

/**
 * Track ranking vote
 */
export async function trackRankingVote(rankingSlug: string): Promise<void> {
    await trackAction({
        accion: 'VOTAR_RANKING',
        origen: rankingSlug
    });
}

/**
 * Track bracket participation
 */
export async function trackBracketParticipation(bracketId: string): Promise<void> {
    await trackAction({
        accion: 'PARTICIPAR_BRACKET',
        origen: bracketId
    });
}

/**
 * Track tutorial view
 */
export async function trackTutorialView(tutorialId: string): Promise<void> {
    await trackAction({
        accion: 'VER_TUTORIAL',
        origen: tutorialId
    });
}
