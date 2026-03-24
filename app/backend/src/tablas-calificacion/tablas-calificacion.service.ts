import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTablaCalificacionDto, UpdateTablaCalificacionDto } from './dto/create-tabla-calificacion.dto';

@Injectable()
export class TablasCalificacionService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTablaCalificacionDto) {
    const { nombre, slug, descripcion, image, estado, juegoId, categoriaId, itemsIds } = createDto;
    
    return this.prisma.tablaCalificacion.create({
      data: {
        nombre,
        slug,
        descripcion,
        image,
        estado: estado || 'ACTIVO',
        juegoId,
        categoriaId,
        items: itemsIds ? {
          create: itemsIds.map(itemId => ({ itemId }))
        } : undefined
      },
      include: { items: { include: { item: true } } }
    });
  }

  async findAll(juegoId?: string, categoriaId?: string) {
    const where: any = {};
    if (juegoId) where.juegoId = juegoId;
    if (categoriaId) where.categoriaId = categoriaId;

    return this.prisma.tablaCalificacion.findMany({
      where,
      include: {
        juego: true,
        categoria: true,
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOneBySlug(slug: string) {
    const tabla = await this.prisma.tablaCalificacion.findUnique({
      where: { slug },
      include: {
        juego: true,
        categoria: true,
        items: {
          include: { 
            item: true 
          }
        }
      }
    });

    if (!tabla) throw new NotFoundException('Tabla de calificacion no encontrada');

    return tabla;
  }

  async update(id: string, updateDto: UpdateTablaCalificacionDto) {
    const { itemsIds, ...rest } = updateDto;

    let updateData: any = { ...rest };

    if (itemsIds) {
      await this.prisma.tablaItem.deleteMany({ where: { tablaId: id } });
      updateData.items = {
        create: itemsIds.map(itemId => ({ itemId }))
      };
    }

    return this.prisma.tablaCalificacion.update({
      where: { id },
      data: updateData,
      include: { items: { include: { item: true } } }
    });
  }

  async remove(id: string) {
    return this.prisma.tablaCalificacion.delete({
      where: { id }
    });
  }
}
