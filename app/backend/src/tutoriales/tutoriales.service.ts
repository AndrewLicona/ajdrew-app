import { Injectable, NotFoundException } from '@nestjs/common';
import { TutorialRepository } from './infrastructure/persistence/tutorial.repository';
import { CreateTutorialDto } from './application/dto/create-tutorial.dto';

@Injectable()
export class TutorialesService {
    constructor(private readonly repository: TutorialRepository) { }

    async create(dto: CreateTutorialDto) {
        const { pasos, ...data } = dto;
        return this.repository.create({
            ...data,
            pasos: pasos
                ? {
                    create: pasos.map((p) => ({
                        orden: p.orden,
                        titulo: p.titulo,
                        descripcion: p.descripcion,
                        image: p.image,
                    })),
                }
                : undefined,
        });
    }

    async findAll(juegoId?: string, query?: any) {
        return this.repository.findAll(juegoId, query);
    }

    async findOne(idOrSlug: string) {
        const tutorial = await this.repository.findOne(idOrSlug);
        if (!tutorial) throw new NotFoundException('Tutorial no encontrado');
        return tutorial;
    }

    async update(id: string, dto: any) {
        const { pasos, ...data } = dto;

        // If pasos are provided, we replace them
        if (pasos) {
            // First, delete current steps (using repository directly or service)
            // But better to use nested write in update
            return this.repository.update(id, {
                ...data,
                pasos: {
                    deleteMany: {},
                    create: pasos.map((p: any) => ({
                        orden: p.orden,
                        titulo: p.titulo,
                        descripcion: p.descripcion,
                        image: p.image,
                    })),
                }
            });
        }

        return this.repository.update(id, data);
    }

    async incrementUtilidad(id: string) {
        return this.repository.update(id, {
            utilidadCount: { increment: 1 }
        });
    }

    async incrementCompartir(id: string) {
        return this.repository.update(id, {
            compartirCount: { increment: 1 }
        });
    }

    async remove(id: string) {
        return this.repository.remove(id);
    }
}
