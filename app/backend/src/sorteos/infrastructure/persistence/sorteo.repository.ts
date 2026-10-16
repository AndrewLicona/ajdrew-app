import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSorteoDto } from '../../application/dto/create-sorteo.dto';

@Injectable()
export class SorteoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSorteoDto) {
    const { tareas, ...sorteoData } = data;

    return this.prisma.sorteo.create({
      data: {
        ...sorteoData,
        fechaFin: new Date(sorteoData.fechaFin),
        tareas: tareas
          ? {
              create: tareas,
            }
          : undefined,
      },
      include: {
        tareas: true,
      },
    });
  }

  async findAll(juegoId?: string) {
    return this.prisma.sorteo.findMany({
      where: juegoId ? { juegoId } : {},
      include: {
        juego: true,
        tareas: true,
        _count: { select: { participantes: true } },
        ganadores: {
          include: {
            usuario: { select: { nombre: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.sorteo.findUnique({
      where: { id },
      include: {
        juego: true,
        tareas: true,
        participantes: {
          include: {
            usuario: { select: { nombre: true, email: true } },
            tareas: { include: { task: true } },
            entries: true,
          },
        },
        ganadores: {
          include: {
            usuario: { select: { nombre: true, email: true } },
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    const { tareas, ...sorteoData } = data;

    return this.prisma.sorteo.update({
      where: { id },
      data: {
        ...sorteoData,
        ...(sorteoData.fechaFin && { fechaFin: new Date(sorteoData.fechaFin) }),
        ...(tareas !== undefined && {
          tareas: {
            deleteMany: {},
            create: tareas.map(
              ({ sorteoId, createdAt, updatedAt, ...t }: any) => t,
            ),
          },
        }),
      },
      include: {
        tareas: true,
      },
    });
  }

  async addParticipante(
    sorteoId: string,
    data: {
      usuarioId?: string | null;
      email?: string;
      nombre?: string;
      deviceId?: string;
      trafficSource?: string;
    },
  ) {
    const cleanData = { ...data };
    const invalidIds = [
      null,
      undefined,
      '',
      'undefined',
      'null',
      '[object Object]',
    ];

    if (invalidIds.includes(cleanData.usuarioId as any)) {
      delete cleanData.usuarioId;
    }

    console.log('📝 SorteoRepository: Creating participant', {
      sorteoId,
      cleanData,
    });

    return this.prisma.sorteoParticipante.create({
      data: {
        sorteoId,
        ...(cleanData as any),
      },
    });
  }

  async completeTask(
    participanteId: string,
    taskId: string,
    evidencia?: { url?: string; texto?: string; verificada?: boolean },
  ) {
    return this.prisma.participanteTask.create({
      data: {
        participanteId,
        taskId,
        completada: true,
        verificada: evidencia?.verificada ?? false,
        evidenciaUrl: evidencia?.url,
        evidenciaTexto: evidencia?.texto,
      },
    });
  }

  async addEntry(participanteId: string, accion: string, origen?: string) {
    return this.prisma.sorteoEntry.create({
      data: {
        participanteId,
        accion,
        origen,
      },
    });
  }

  async getParticipantEntryCount(participanteId: string): Promise<number> {
    return this.prisma.sorteoEntry.count({
      where: { participanteId },
    });
  }

  async findEntryByAction(participanteId: string, accion: string) {
    return this.prisma.sorteoEntry.findFirst({
      where: { participanteId, accion },
    });
  }

  async getVerifiedEntryCount(participanteId: string): Promise<number> {
    const participante = await this.prisma.sorteoParticipante.findUnique({
      where: { id: participanteId },
      include: {
        tareas: {
          where: { verificada: true },
          include: { task: true },
        },
        entries: true,
      },
    });

    if (!participante) return 0;

    let count = 0;
    const hasParticiparEntry = participante.entries.some((e) => e.accion === 'PARTICIPAR');
    if (hasParticiparEntry) count += 1;

    count += participante.tareas.length;

    const hasRefEntry = participante.entries.some((e) => e.accion === 'REF_SOCIAL');
    if (hasRefEntry) count += 1;

    return count;
  }

  async findExpired(fecha: Date) {
    return this.prisma.sorteo.findMany({
      where: {
        estado: 'ACTIVO',
        fechaFin: { lt: fecha },
      },
      include: {
        participantes: true,
      },
    });
  }

  async verificarTarea(participanteId: string, taskId: string, verificada: boolean) {
    return this.prisma.participanteTask.update({
      where: {
        participanteId_taskId: {
          participanteId,
          taskId,
        },
      },
      data: { verificada },
    });
  }

  async getEntradasParticipante(participanteId: string) {
    const participante = await this.prisma.sorteoParticipante.findUnique({
      where: { id: participanteId },
      include: {
        tareas: { include: { task: true } },
        entries: true,
      },
    });

    if (!participante) return null;

    return {
      participanteId: participante.id,
      tareas: participante.tareas.map((t) => ({
        taskId: t.taskId,
        nombre: t.task?.tipo,
        completada: t.completada,
        verificada: t.verificada,
        evidenciaUrl: t.evidenciaUrl,
        evidenciaTexto: t.evidenciaTexto,
      })),
      entradas: participante.entries.map((e) => ({
        accion: e.accion,
        origen: e.origen,
        createdAt: e.createdAt,
      })),
      totalEntradas: participante.entries.length + participante.tareas.filter((t) => t.verificada).length,
    };
  }

  async finalizeAndWinners(sorteoId: string, winners: any[]) {
    return this.prisma.$transaction([
      ...winners.map((w) =>
        this.prisma.sorteoWinner.create({
          data: {
            sorteoId,
            usuarioId: w.usuarioId || null,
            nombreManual: w.nombreManual || null,
            emailManual: w.emailManual || null,
          },
        }),
      ),
      this.prisma.sorteo.update({
        where: { id: sorteoId },
        data: { estado: 'CERRADO' },
      }),
    ]);
  }

  async remove(id: string) {
    return this.prisma.sorteo.delete({ where: { id } });
  }

  async getParticipantes(sorteoId: string) {
    const sorteo = await this.prisma.sorteo.findUnique({
      where: { id: sorteoId },
      include: {
        participantes: {
          include: {
            usuario: { select: { nombre: true, email: true } },
            entries: true,
            tareas: {
              where: { verificada: true },
              include: { task: true },
            },
          },
        },
      },
    });
    return sorteo?.participantes || [];
  }
}
