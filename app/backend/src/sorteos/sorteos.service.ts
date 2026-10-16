import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SorteoRepository } from './infrastructure/persistence/sorteo.repository';
import { CreateSorteoDto } from './application/dto/create-sorteo.dto';
import { ParticiparSorteoDto } from './application/dto/participar-sorteo.dto';

@Injectable()
export class SorteosService {
  private readonly logger = new Logger(SorteosService.name);

  constructor(
    private readonly repository: SorteoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateSorteoDto) {
    const sorteo = await this.repository.create(dto);

    this.eventEmitter.emit('social.sorteo.created', { sorteoId: sorteo.id });

    return sorteo;
  }

  findAll(juegoId?: string) {
    return this.repository.findAll(juegoId);
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, data: any) {
    const updated = await this.repository.update(id, data);
    if (data.estado === 'ACTIVO' || (data.premio && updated.estado === 'ACTIVO')) {
      this.eventEmitter.emit('social.sorteo.created', { sorteoId: id });
    }
    return updated;
  }

  async participar(sorteoId: string, dto: ParticiparSorteoDto) {
    if (!dto.usuarioId && !dto.email) {
      throw new HttpException(
        'Debe proporcionar usuarioId o email',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sorteo = await this.repository.findOne(sorteoId);
    if (!sorteo || sorteo.estado !== 'ACTIVO') {
      throw new HttpException(
        'Sorteo no válido o ya cerrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if sorteo has expired
    if (new Date() > new Date(sorteo.fechaFin)) {
      throw new HttpException(
        'El sorteo ha finalizado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tareasObligatorias =
      sorteo.tareas?.filter((t) => t.obligatorio) || [];
    const tareasCompletadasIds = dto.tareas.map((t) => t.taskId);

    const tareasFaltantes = tareasObligatorias.filter(
      (t) => !tareasCompletadasIds.includes(t.id),
    );

    if (tareasFaltantes.length > 0) {
      throw new HttpException(
        'Debes completar todas las tareas obligatorias',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify non-obligatory tasks that require verification
    const tareasConVerificacion = sorteo.tareas?.filter(
      (t) => t.requiereVerificacion && tareasCompletadasIds.includes(t.id),
    ) || [];

    try {
      const participante = await this.repository.addParticipante(sorteoId, {
        usuarioId: dto.usuarioId,
        email: dto.email,
        nombre: dto.nombre,
        deviceId: dto.deviceId,
        trafficSource: dto.trafficSource,
      });

      // Register completed tasks
      for (const tarea of dto.tareas) {
        const task = sorteo.tareas?.find((t) => t.id === tarea.taskId);
        const requiereVerificacion = task?.requiereVerificacion ?? false;
        
        await this.repository.completeTask(participante.id, tarea.taskId, {
          url: tarea.evidenciaUrl,
          texto: tarea.evidenciaTexto,
          verificada: !requiereVerificacion, // Auto-verify if not required
        });
      }

      // Create initial entry for participating
      await this.repository.addEntry(participante.id, 'PARTICIPAR');

      // Bonus entry for social referral (only once per participant)
      if (dto.trafficSource && !dto.trafficSource.includes('direct')) {
        const existingRefEntry = await this.repository.findEntryByAction(
          participante.id,
          'REF_SOCIAL',
        );
        if (!existingRefEntry) {
          await this.repository.addEntry(
            participante.id,
            'REF_SOCIAL',
            dto.trafficSource,
          );
        }
      }

      return participante;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'Ya estás participando en este sorteo',
          HttpStatus.CONFLICT,
        );
      }
      if (
        error.code === 'P2003' &&
        error.meta?.constraint?.includes('usuarioId')
      ) {
        throw new HttpException(
          'Sesión inválida. Por favor, cierra sesión e ingresa de nuevo.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw error;
    }
  }

  async addEntry(participanteId: string, accion: string, origen?: string) {
    // Prevent duplicate entries for same action (except PARTICIPAR which is once)
    if (accion !== 'PARTICIPAR') {
      const existing = await this.repository.findEntryByAction(participanteId, accion);
      if (existing) {
        this.logger.warn(`Duplicate entry attempt: ${accion} for participant ${participanteId}`);
        return existing;
      }
    }
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

    // Build weighted pool with verified entries only
    const weightedPool: { participante: any; entries: number }[] = [];
    
    for (const p of participantes) {
      // Count only verified entries (entries from verified tasks + PARTICIPAR + REF_SOCIAL)
      const entryCount = await this.repository.getVerifiedEntryCount(p.id);
      const entries = Math.max(1, entryCount); // Minimum 1 entry for participating
      
      if (entries > 0) {
        weightedPool.push({ participante: p, entries });
      }
    }

    if (weightedPool.length === 0) {
      throw new Error('No hay entradas válidas para el sorteo');
    }

    // Use crypto-secure random for winner selection
    const winners: any[] = [];
    const chosenIds = new Set<string>();
    
    // Build cumulative weights for efficient selection
    const cumulativeWeights: number[] = [];
    let totalWeight = 0;
    for (const wp of weightedPool) {
      totalWeight += wp.entries;
      cumulativeWeights.push(totalWeight);
    }

    // Select unique winners
    for (let i = 0; i < sorteo.numGanadores && winners.length < weightedPool.length; i++) {
      let randomValue: number;
      let winnerIndex: number;
      let attempts = 0;
      const maxAttempts = weightedPool.length * 2;

      do {
        // Generate cryptographically secure random number
        const randomBytes = new Uint32Array(1);
        crypto.getRandomValues(randomBytes);
        randomValue = (randomBytes[0] / 0x100000000) * totalWeight;
        
        winnerIndex = cumulativeWeights.findIndex((w) => randomValue < w);
        attempts++;
      } while (
        chosenIds.has(weightedPool[winnerIndex].participante.id) &&
        attempts < maxAttempts
      );

      if (attempts >= maxAttempts) {
        // Fallback: pick first non-chosen
        const fallback = weightedPool.find((wp) => !chosenIds.has(wp.participante.id));
        if (!fallback) break;
        winnerIndex = weightedPool.indexOf(fallback);
      }

      const winner = weightedPool[winnerIndex].participante;
      winners.push(winner);
      chosenIds.add(winner.id);
      totalWeight -= weightedPool[winnerIndex].entries;
      // Remove winner from pool for next iteration
      weightedPool.splice(winnerIndex, 1);
      cumulativeWeights.splice(winnerIndex, 1);
    }

    const winnerData = winners.map((p) => ({
      usuarioId: p.usuarioId,
      nombreManual: !p.usuarioId
        ? p.nombre || p.email || 'Participante Anónimo'
        : null,
      emailManual: !p.usuarioId ? p.email : null,
    }));

    const result = await this.repository.finalizeAndWinners(id, winnerData);

    const createdWinners = result.slice(0, result.length - 1);
    const winnerIds = createdWinners.map((g: any) => g.id);
    this.eventEmitter.emit('social.sorteo.winners', {
      sorteoId: id,
      winnerIds,
    });

    this.logger.log(`Sorteo ${id} finalizado con ${winners.length} ganadores`);

    return result;
  }

  async finalizarManualmente(
    id: string,
    winners: { nombreManual: string; emailManual?: string }[],
  ) {
    const sortedWinners = winners.map((w) => ({
      usuarioId: null,
      nombreManual: w.nombreManual,
      emailManual: w.emailManual,
    }));

    const result = await this.repository.finalizeAndWinners(id, sortedWinners);

    const createdWinners = result.slice(0, result.length - 1);
    const winnerIds = createdWinners.map((g: any) => g.id);
    this.eventEmitter.emit('social.sorteo.winners', {
      sorteoId: id,
      winnerIds,
    });

    return result;
  }

  async cerrarSorteosExpirados() {
    const ahora = new Date();
    const sorteosExpirados = await this.repository.findExpired(ahora);

    for (const sorteo of sorteosExpirados) {
      try {
        if ((sorteo.participantes?.length ?? 0) > 0) {
          await this.elegirGanadores(sorteo.id);
        } else {
          await this.repository.update(sorteo.id, { estado: 'CERRADO' });
        }
        this.logger.log(`Sorteo expirado cerrado automáticamente: ${sorteo.id}`);
      } catch (error) {
        this.logger.error(`Error cerrando sorteo expirado ${sorteo.id}:`, error);
      }
    }

    return { procesados: sorteosExpirados.length };
  }

  async verificarTarea(
    sorteoId: string,
    taskId: string,
    participanteId: string,
    verificada: boolean,
  ) {
    // Verify the sorteo exists and user has permission (checked by guard)
    const sorteo = await this.repository.findOne(sorteoId);
    if (!sorteo) {
      throw new HttpException('Sorteo no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.repository.verificarTarea(participanteId, taskId, verificada);
  }

  async getEntradasParticipante(participanteId: string) {
    return this.repository.getEntradasParticipante(participanteId);
  }

  async getParticipantes(sorteoId: string) {
    const sorteo = await this.repository.findOne(sorteoId);
    if (!sorteo) return [];
    return sorteo.participantes || [];
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}
