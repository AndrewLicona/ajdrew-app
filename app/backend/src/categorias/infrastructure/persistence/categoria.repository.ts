
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoriaDto } from '../../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../../application/dto/update-categoria.dto';

@Injectable()
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const { nombre, activa, tipo, juegoId } = createCategoriaDto;
    return this.prisma.categoria.create({
      data: { nombre, activa, tipo, juegoId }
    });
  }

  async findAll(juegoId?: string, includeItems: boolean = false) {
    return this.prisma.categoria.findMany({
      where: juegoId !== undefined ? { juegoId } : {},
      include: {
        juego: true,
        items: includeItems ? { take: 6 } : false,
        _count: {
          select: {
            items: true,
            votaciones: true,
            tutoriales: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: { juego: true }
    });
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const { nombre, activa, tipo, juegoId } = updateCategoriaDto;
    return this.prisma.categoria.update({
      where: { id },
      data: { nombre, activa, tipo, juegoId },
    });
  }

  async remove(id: string) {
    return this.prisma.categoria.delete({ where: { id } });
  }
}
