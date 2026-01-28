import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicacionesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: { titulo: string, contenido: string, enlace?: string, tipo?: string }) {
        return this.prisma.publicacion.create({
            data: dto
        });
    }

    async findAll() {
        return this.prisma.publicacion.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.publicacion.findUnique({
            where: { id }
        });
    }

    async remove(id: string) {
        return this.prisma.publicacion.delete({
            where: { id }
        });
    }

    async createAutomated(titulo: string, contenido: string, enlace: string) {
        return this.create({
            titulo,
            contenido,
            enlace,
            tipo: 'AUTOMATICA'
        });
    }
}
