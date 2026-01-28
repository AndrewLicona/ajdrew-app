import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TutorialRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return (this.prisma as any).tutorial.create({
            data,
            include: { juego: true, pasos: true },
        });
    }

    async findAll(juegoId?: string, query?: any) {
        return (this.prisma as any).tutorial.findMany({
            where: {
                ...(juegoId ? { juegoId } : {}),
                ...(query || {}),
            },
            include: {
                juego: true,
                categoria: true,
                pasos: { orderBy: { orden: 'asc' } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(idOrSlug: string) {
        return (this.prisma as any).tutorial.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                juego: true,
                categoria: true,
                pasos: { orderBy: { orden: 'asc' } }
            },
        });
    }

    async update(id: string, data: any) {
        return (this.prisma as any).tutorial.update({
            where: { id },
            data,
            include: { juego: true, pasos: true },
        });
    }

    async remove(id: string) {
        return (this.prisma as any).tutorial.delete({
            where: { id },
        });
    }
}
