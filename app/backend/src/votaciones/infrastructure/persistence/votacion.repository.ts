import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VotacionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any, matches: any[]) {
        return this.prisma.votacionBracket.create({
            data: {
                ...data,
                matches: {
                    create: matches,
                },
            },
            include: {
                matches: true,
            },
        });
    }

    async findAll(juegoId?: string) {
        return this.prisma.votacionBracket.findMany({
            where: juegoId ? { juegoId } : {},
            include: {
                juego: true,
                categoria: true,
                _count: {
                    select: {
                        matches: true,
                    }
                },
                matches: {
                    select: {
                        votosA: true,
                        votosB: true,
                        ronda: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(idOrSlug: string) {
        return this.prisma.votacionBracket.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                juego: true,
                ['categoria' as any]: true,
                matches: {
                    include: {
                        itemA: true,
                        itemB: true,
                        ganador: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.votacionBracket.update({
            where: { id },
            data,
        });
    }

    async deleteMatchesByBracketId(bracketId: string) {
        return this.prisma.bracketMatch.deleteMany({
            where: { bracketId }
        });
    }

    async findMatchesByRound(bracketId: string, ronda: number) {
        return this.prisma.bracketMatch.findMany({
            where: {
                bracketId,
                ronda,
            },
        });
    }

    async createMatches(matches: any[]) {
        return this.prisma.bracketMatch.createMany({
            data: matches
        });
    }

    async getVote(matchId: string, deviceId: string) {
        return (this.prisma as any).bracketVote.findUnique({
            where: {
                matchId_deviceId: { matchId, deviceId }
            }
        });
    }

    async recordVote(matchId: string, deviceId: string, chosenItemId: string) {
        return (this.prisma as any).bracketVote.create({
            data: { matchId, deviceId, chosenItemId }
        });
    }

    async updateVoteChoice(voteId: string, chosenItemId: string) {
        return (this.prisma as any).bracketVote.update({
            where: { id: voteId },
            data: { chosenItemId }
        });
    }

    async updateMatchVote(matchId: string, isA: boolean, increment: number = 1) {
        return this.prisma.bracketMatch.update({
            where: { id: matchId },
            data: isA
                ? { votosA: { increment } }
                : { votosB: { increment } },
        });
    }

    async findMatchById(id: string) {
        return this.prisma.bracketMatch.findUnique({ where: { id } });
    }

    async remove(id: string) {
        return this.prisma.votacionBracket.delete({ where: { id } });
    }

    calculateNextDeadline(durationHours: number): Date | null {
        if (durationHours <= 0) return null;
        const now = new Date();
        return new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    }
}
