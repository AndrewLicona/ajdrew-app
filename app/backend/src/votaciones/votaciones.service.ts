import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VotacionRepository } from './infrastructure/persistence/votacion.repository';
import { CreateBracketDto, VoteBracketDto } from './application/dto/create-bracket.dto';
import { PublicacionesService } from '../publicaciones/publicaciones.service';

@Injectable()
export class VotacionesService {
    constructor(
        private readonly repository: VotacionRepository,
        private readonly publicacionesService: PublicacionesService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async create(dto: CreateBracketDto) {
        try {
            const allowedSizes = [2, 4, 8, 16];
            if (!allowedSizes.includes(dto.itemsIds.length)) {
                throw new BadRequestException('El número de participantes debe ser exactamente 2, 4, 8 o 16.');
            }

            // Create matches for Round 1
            const matches: any[] = [];
            for (let i = 0; i < dto.itemsIds.length; i += 2) {
                matches.push({
                    ronda: 1,
                    itemAId: dto.itemsIds[i],
                    itemBId: dto.itemsIds[i + 1] || null,
                });
            }

            const { itemsIds, ...data } = dto;

            // Force numeric conversion for database safety
            if (data.rondaDuracion !== undefined) {
                data.rondaDuracion = Number(data.rondaDuracion) || 0;
            }

            // Ensure optional relation IDs are valid (undefined/null instead of empty string)
            if (data.categoriaId === '') data.categoriaId = undefined;

            // If it starts ACTIVE, calculate deadline
            if (data.estado === 'ACTIVA' && data.rondaDuracion && data.rondaDuracion > 0) {
                (data as any).proximoCierreAt = this.repository.calculateNextDeadline(data.rondaDuracion);
            }

            return await this.repository.create(data, matches);
        } catch (error: any) {
            console.error('[VotacionesService.create] Error:', error);
            if (error.code === 'P2002') {
                throw new BadRequestException('El slug ya está en uso. Por favor, elige otro título.');
            }
            throw error;
        }
    }

    findAll(juegoId?: string) {
        return this.repository.findAll(juegoId);
    }

    async findOne(idOrSlug: string, deviceId?: string) {
        const bracket = await this.repository.findOne(idOrSlug);
        if (!bracket) return null;

        if (deviceId) {
            // Enrich matches with user vote info
            const matchesWithVotes = await Promise.all(
                (bracket.matches || []).map(async (match: any) => {
                    const vote = await (this.repository as any).getVote(match.id, deviceId);
                    return {
                        ...match,
                        userVoteItemId: vote?.chosenItemId || null
                    };
                })
            );
            return { ...bracket, matches: matchesWithVotes };
        }

        return bracket;
    }

    async update(id: string, dto: any) {
        const bracket = await this.repository.findOne(id);
        if (!bracket) throw new BadRequestException('Bracket no encontrado');

        if (dto.itemsIds && dto.itemsIds.length > 0) {
            if (bracket.estado !== 'BORRADOR') {
                throw new BadRequestException('No se pueden cambiar los participantes de un torneo en curso.');
            }

            const allowedSizes = [2, 4, 8, 16];
            if (!allowedSizes.includes(dto.itemsIds.length)) {
                throw new BadRequestException('El número de participantes debe ser exactamente 2, 4, 8 o 16.');
            }

            await this.repository.deleteMatchesByBracketId(id);

            const matches: any[] = [];
            for (let i = 0; i < dto.itemsIds.length; i += 2) {
                matches.push({
                    bracketId: id,
                    ronda: 1,
                    itemAId: dto.itemsIds[i],
                    itemBId: dto.itemsIds[i + 1] || null,
                });
            }
            await this.repository.createMatches(matches);
        }

        const { itemsIds, ...data } = dto;
        if (data.categoriaId === '') data.categoriaId = undefined;
        try {
            return await this.repository.update(id, data);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException('El slug ya está en uso. Por favor, elige otro título.');
            }
            throw error;
        }
    }

    async advanceRound(id: string) {
        const bracket = await this.repository.findOne(id);
        if (!bracket) throw new BadRequestException('Bracket no encontrado');
        if (bracket.estado !== 'ACTIVA') throw new BadRequestException('Solo se pueden avanzar torneos activos');

        const currentRound = bracket.rondaActual;
        const matches = await this.repository.findMatchesByRound(id, currentRound);

        // Determine winners of current round
        const winnersIds: string[] = [];
        for (const match of matches) {
            // Very simple winner logic: more votes wins. 
            // If tied, first one (A) wins for now.
            if (match.votosA >= match.votosB && match.itemAId) {
                winnersIds.push(match.itemAId);
            } else if (match.itemBId) {
                winnersIds.push(match.itemBId);
            } else if (match.itemAId) {
                // Handle case where B is null
                winnersIds.push(match.itemAId);
            }
        }

        if (winnersIds.length <= 1) {
            // Final winner reached or no winners
            await this.publicacionesService.createAutomated(
                `🏆 ¡Tenemos un ganador!`,
                `El torneo "${bracket.tematica}" ha finalizado. ¡Mira quién se llevó la corona!`,
                `/votaciones/${bracket.slug}`
            );
            return this.repository.update(id, { estado: 'FINALIZADA', proximoCierreAt: null });
        }

        // Create new matches for next round
        const nextRound = currentRound + 1;
        const nextMatches: any[] = [];
        for (let i = 0; i < winnersIds.length; i += 2) {
            nextMatches.push({
                bracketId: id,
                ronda: nextRound,
                itemAId: winnersIds[i],
                itemBId: winnersIds[i + 1] || null,
            });
        }

        await this.repository.createMatches(nextMatches);

        // Calculate next deadline if automated
        const nextDeadline = bracket.rondaDuracion > 0
            ? this.repository.calculateNextDeadline(bracket.rondaDuracion)
            : null;

        await this.publicacionesService.createAutomated(
            `🔥 ¡Siguiente Ronda en ${(bracket as any).tematica}!`,
            `La Ronda ${nextRound} ya está activa. ¡Entra y vota por tus favoritos antes de que termine el tiempo!`,
            `/votaciones/${(bracket as any).slug}`
        );

        // Emit event for Social Media automation (Discord)
        this.eventEmitter.emit('bracket.phase.started', {
            bracketId: id,
            round: nextRound,
            tematica: bracket.tematica
        });

        return this.repository.update(id, {
            rondaActual: nextRound,
            proximoCierreAt: nextDeadline
        });
    }

    async vote(matchId: string, itemId: string, deviceId: string) {
        if (!deviceId) throw new BadRequestException('Se requiere deviceId para votar');

        const match = await this.repository.findMatchById(matchId);
        if (!match) throw new BadRequestException('Match no encontrado');

        // Fetch bracket to check status and active round
        const bracket = await this.repository.findOne(match.bracketId);
        if (!bracket) throw new BadRequestException('Bracket asociado no encontrado');

        if (bracket.estado !== 'ACTIVA') {
            throw new BadRequestException(`No se puede votar en un torneo ${bracket.estado.toLowerCase()}`);
        }

        if (match.ronda !== bracket.rondaActual) {
            throw new BadRequestException('Solo se permiten votos para la ronda actual en curso');
        }

        const isA = match.itemAId === itemId;
        const isB = match.itemBId === itemId;

        if (!isA && !isB) throw new BadRequestException('El ítem no pertenece a este match');

        const existingVote = await this.repository.getVote(matchId, deviceId);

        if (existingVote) {
            if (existingVote.chosenItemId === itemId) {
                throw new BadRequestException('Ya has votado por este ítem');
            }

            // User is changing their vote
            const oldIsA = match.itemAId === existingVote.chosenItemId;
            // 1. Decrement old
            await this.repository.updateMatchVote(matchId, oldIsA, -1);
            // 2. Increment new
            await this.repository.updateMatchVote(matchId, isA, 1);
            // 3. Update vote record
            return this.repository.updateVoteChoice(existingVote.id, itemId);
        }

        // Record vote for this device first to prevent race conditions
        await this.repository.recordVote(matchId, deviceId, itemId);

        return this.repository.updateMatchVote(matchId, isA, 1);
    }

    async remove(id: string) {
        return this.repository.remove(id);
    }
}
