import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSorteoDto } from '../../application/dto/create-sorteo.dto';

@Injectable()
export class SorteoRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateSorteoDto) {
        const { tareas, ...sorteoData } = data;

        return this.prisma.sorteo.create({
            data: {
                ...sorteoData,
                fechaFin: new Date(sorteoData.fechaFin),
                tareas: tareas ? {
                    create: tareas
                } : undefined
            },
            include: {
                tareas: true
            }
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
                        usuario: { select: { nombre: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
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
                        tareas: { include: { task: true } }
                    }
                },
                ganadores: {
                    include: {
                        usuario: { select: { nombre: true, email: true } }
                    }
                }
            }
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
                        create: tareas.map(({ sorteoId, createdAt, updatedAt, ...t }: any) => t)
                    }
                })
            },
            include: {
                tareas: true
            }
        });
    }

    async addParticipante(sorteoId: string, data: {
        usuarioId?: string | null;
        email?: string;
        nombre?: string;
        deviceId?: string;
        trafficSource?: string;
    }) {
        // Filter out null/undefined/placeholder usuarioId to prevent FK violation
        const cleanData = { ...data };
        const invalidIds = [null, undefined, '', 'undefined', 'null', '[object Object]'];

        if (invalidIds.includes(cleanData.usuarioId as any)) {
            delete cleanData.usuarioId;
        }

        console.log('📝 SorteoRepository: Creating participant', { sorteoId, cleanData });

        return this.prisma.sorteoParticipante.create({
            data: {
                sorteoId,
                ...cleanData as any
            }
        });
    }

    async completeTask(participanteId: string, taskId: string, evidencia?: { url?: string; texto?: string }) {
        return this.prisma.participanteTask.create({
            data: {
                participanteId,
                taskId,
                completada: true,
                evidenciaUrl: evidencia?.url,
                evidenciaTexto: evidencia?.texto
            }
        });
    }

    async addEntry(participanteId: string, accion: string, origen?: string) {
        return this.prisma.sorteoEntry.create({
            data: {
                participanteId,
                accion,
                origen
            }
        });
    }

    async getParticipantEntryCount(participanteId: string): Promise<number> {
        return this.prisma.sorteoEntry.count({
            where: { participanteId }
        });
    }

    async finalizeAndWinners(sorteoId: string, winners: any[]) {
        return this.prisma.$transaction([
            // Create winners
            ...winners.map(w => (this.prisma as any).sorteoWinner.create({
                data: {
                    sorteoId,
                    usuarioId: w.usuarioId || null,
                    nombreManual: w.nombreManual || null,
                    emailManual: w.emailManual || null
                }
            })),
            // Update sorteo status
            this.prisma.sorteo.update({
                where: { id: sorteoId },
                data: { estado: 'CERRADO' }
            })
        ]);
    }

    async remove(id: string) {
        return this.prisma.sorteo.delete({ where: { id } });
    }
}
