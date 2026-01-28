import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SorteoRepository } from './infrastructure/persistence/sorteo.repository';
import { CreateSorteoDto } from './application/dto/create-sorteo.dto';
import { ParticiparSorteoDto } from './application/dto/participar-sorteo.dto';

@Injectable()
export class SorteosService {
    constructor(private readonly repository: SorteoRepository) { }

    create(dto: CreateSorteoDto) {
        return this.repository.create(dto);
    }

    findAll(juegoId?: string) {
        return this.repository.findAll(juegoId);
    }

    findOne(id: string) {
        return this.repository.findOne(id);
    }

    update(id: string, data: any) {
        return this.repository.update(id, data);
    }

    async participar(sorteoId: string, dto: ParticiparSorteoDto) {
        // Validar que al menos una identidad esté presente
        if (!dto.usuarioId && !dto.email) {
            throw new HttpException('Debe proporcionar usuarioId o email', HttpStatus.BAD_REQUEST);
        }

        // Obtener sorteo con sus tareas
        const sorteo = await this.repository.findOne(sorteoId);
        if (!sorteo || sorteo.estado !== 'ACTIVO') {
            throw new HttpException('Sorteo no válido o ya cerrado', HttpStatus.BAD_REQUEST);
        }

        // Validar que todas las tareas obligatorias estén completadas
        const tareasObligatorias = sorteo.tareas?.filter(t => t.obligatorio) || [];
        const tareasCompletadasIds = dto.tareas.map(t => t.taskId);

        const tareasFaltantes = tareasObligatorias.filter(
            t => !tareasCompletadasIds.includes(t.id)
        );

        if (tareasFaltantes.length > 0) {
            throw new HttpException('Debes completar todas las tareas obligatorias', HttpStatus.BAD_REQUEST);
        }

        // Crear participante (con manejo de duplicados)
        try {
            const participante = await this.repository.addParticipante(sorteoId, {
                usuarioId: dto.usuarioId,
                email: dto.email,
                nombre: dto.nombre,
                deviceId: dto.deviceId,
                trafficSource: dto.trafficSource
            });

            // Registrar tareas completadas
            for (const tarea of dto.tareas) {
                await this.repository.completeTask(participante.id, tarea.taskId, {
                    url: tarea.evidenciaUrl,
                    texto: tarea.evidenciaTexto
                });
            }

            // Crear entrada inicial por participar
            await this.repository.addEntry(participante.id, 'PARTICIPAR');

            // Entrada bonus si viene de red social
            if (dto.trafficSource) {
                await this.repository.addEntry(participante.id, 'REF_SOCIAL', dto.trafficSource);
            }

            return participante;
        } catch (error: any) {
            // Manejar error de duplicación
            if (error.code === 'P2002') {
                throw new HttpException('Ya estás participando en este sorteo', HttpStatus.CONFLICT);
            }
            // Manejar error de sesión expirada o usuario inexistente (FK violation)
            if (error.code === 'P2003' && error.meta?.constraint?.includes('usuarioId')) {
                throw new HttpException('Sesión inválida. Por favor, cierra sesión e ingresa de nuevo.', HttpStatus.UNAUTHORIZED);
            }
            throw error;
        }
    }

    async addEntry(participanteId: string, accion: string, origen?: string) {
        return this.repository.addEntry(participanteId, accion, origen);
    }

    async elegirGanadores(id: string) {
        const sorteo = await this.repository.findOne(id);
        if (!sorteo || sorteo.estado !== 'ACTIVO') {
            throw new Error('Sorteo no válido o ya cerrado');
        }

        const participantes = sorteo.participantes || [];
        if (participantes.length === 0) {
            throw new Error('No hay participantes en este sorteo');
        }

        // 1. Crear el pool ponderado según entradas
        const weightedPool: any[] = [];
        for (const p of participantes) {
            const entryCount = await this.repository.getParticipantEntryCount(p.id);
            const entries = entryCount || 1;
            for (let i = 0; i < entries; i++) {
                weightedPool.push(p);
            }
        }

        // 2. Barajar y elegir ganadores únicos
        const winners: any[] = [];
        const chosenIds = new Set<string>();
        const pool = [...weightedPool].sort(() => 0.5 - Math.random());

        for (const p of pool) {
            if (winners.length >= sorteo.numGanadores) break;
            if (!chosenIds.has(p.id)) {
                winners.push(p);
                chosenIds.add(p.id);
            }
        }

        // 3. Formatear datos de ganadores para el repositorio
        const winnerData = winners.map(p => ({
            usuarioId: p.usuarioId,
            nombreManual: !p.usuarioId ? (p.nombre || p.email || 'Participante Anónimo') : null,
            emailManual: !p.usuarioId ? p.email : null
        }));

        return this.repository.finalizeAndWinners(id, winnerData);
    }

    async finalizarManualmente(id: string, winners: { nombreManual: string, emailManual?: string }[]) {
        const sortedWinners = winners.map(w => ({
            usuarioId: null,
            nombreManual: w.nombreManual,
            emailManual: w.emailManual
        }));
        return this.repository.finalizeAndWinners(id, sortedWinners);
    }

    remove(id: string) {
        return this.repository.remove(id);
    }
}
