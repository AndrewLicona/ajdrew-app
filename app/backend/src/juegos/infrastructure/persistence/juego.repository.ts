import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateJuegoDto } from '../../application/dto/create-juego.dto';
import { UpdateJuegoDto } from '../../application/dto/update-juego.dto';

@Injectable()
export class JuegoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJuegoDto: CreateJuegoDto) {
    const { nombre, slug, descripcion, image, activo } = createJuegoDto;
    return this.prisma.juego.create({
      data: { nombre, slug, descripcion, image, activo },
    });
  }

  async findAll() {
    return this.prisma.juego.findMany({
      include: {
        _count: {
          select: {
            categorias: true,
            votaciones: true,
            tutoriales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(idOrSlug: string) {
    return this.prisma.juego.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        categorias: {
          include: {
            ['votaciones' as any]: {
              orderBy: { createdAt: 'desc' },
            },
            tablas: true,
          },
        },
        votaciones: {
          orderBy: { createdAt: 'desc' },
          include: {
            ['categoria' as any]: true,
          },
        },
        sorteos: {
          orderBy: { createdAt: 'desc' },
        },
        tutoriales: {
          orderBy: { createdAt: 'desc' },
        },
      } as any,
    });
  }

  async update(id: string, updateJuegoDto: UpdateJuegoDto) {
    const { nombre, slug, descripcion, image, activo } = updateJuegoDto;
    return this.prisma.juego.update({
      where: { id },
      data: { nombre, slug, descripcion, image, activo },
    });
  }

  async remove(id: string) {
    return this.prisma.juego.delete({ where: { id } });
  }
}
