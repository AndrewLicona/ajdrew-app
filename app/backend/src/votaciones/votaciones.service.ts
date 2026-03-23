import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VotacionRepository } from './infrastructure/persistence/votacion.repository';
import { CreateBracketDto, VoteBracketDto } from './application/dto/create-bracket.dto';
import { PublicacionesService } from '../publicaciones/publicaciones.service';
import { BracketMatchAbiertoEvent, BracketMatchCerradoEvent } from '../modules/social-media/services/bracket-media.service';
import { RondaNombre } from '../modules/social-media/generators/bracket-image.generator';

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
        const roundNames: Record<number, RondaNombre> = {
            1: 'Octavos',
            2: 'Cuartos',
            3: 'Semifinal',
            4: 'Final'
        };

        const matches = await this.repository.findMatchesByRoundWithItems(id, currentRound);

        // Determine winners and emit CLOSED events
        const winnersIds: string[] = [];
        for (const match of matches) {
            let ganadorId: string | null = null;
            if (match.votosA >= match.votosB && match.itemAId) {
                ganadorId = match.itemAId;
            } else if (match.itemBId) {
                ganadorId = match.itemBId;
            } else if (match.itemAId) {
                ganadorId = match.itemAId;
            }
            if (ganadorId) winnersIds.push(ganadorId);

            // Emit cerrado event
            const totalVotos = match.votosA + match.votosB;
            this.eventEmitter.emit('bracket.match.cerrado', new BracketMatchCerradoEvent(
                match.id,
                bracket.tematica,
                roundNames[currentRound] || 'Octavos',
                bracket.juego.nombre,
                match.itemAId!,
                match.itemA?.nombre || '?',
                (match.itemA as any)?.imagenUrl || (match.itemA as any)?.image || '',
                match.votosA,
                totalVotos > 0 ? Math.round((match.votosA / totalVotos) * 100) : 50,
                match.itemBId!,
                match.itemB?.nombre || '?',
                (match.itemB as any)?.imagenUrl || (match.itemB as any)?.image || '',
                match.votosB,
                totalVotos > 0 ? Math.round((match.votosB / totalVotos) * 100) : 50,
                ganadorId!
            ));
        }

        if (winnersIds.length <= 1) {
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
        const nextDeadline = (bracket as any).rondaDuracion > 0
            ? this.repository.calculateNextDeadline((bracket as any).rondaDuracion)
            : null;

        await this.publicacionesService.createAutomated(
            `🔥 ¡Siguiente Ronda en ${bracket.tematica}!`,
            `La Ronda ${nextRound} ya está activa. ¡Entra y vota por tus favoritos antes de que termine el tiempo!`,
            `/votaciones/${bracket.slug}`
        );

        const nextRondaName = roundNames[nextRound] || 'Octavos';

        // Apertura de NUEVOS matches
        for (const m of nextMatches) {
            const itemA = await (this.repository as any).findOneItem(m.itemAId);
            const itemB = m.itemBId ? await (this.repository as any).findOneItem(m.itemBId) : null;

            this.eventEmitter.emit('bracket.match.abierto', new BracketMatchAbiertoEvent(
                `new-${m.itemAId}-${m.itemBId}-${Date.now()}`,
                bracket.tematica,
                nextRondaName,
                bracket.juego.nombre,
                itemA?.id || '',
                itemA?.nombre || '?',
                itemA?.imagenUrl || itemA?.image || '',
                itemB?.id || 'null',
                itemB?.nombre || 'BYE',
                itemB?.imagenUrl || itemB?.image || '',
                (bracket as any).rondaDuracion || 24
            ));
        }

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
