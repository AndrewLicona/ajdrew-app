
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateItemCalificableDto } from '../../application/dto/create-item-calificable.dto';
import { UpdateItemCalificableDto } from '../../application/dto/update-item-calificable.dto';

interface AggregationResult {
  _avg: {
    puntuacion: number | null;
  };
  _count: {
    _all: number;
  };
  itemId: string;
}

@Injectable()
export class ItemCalificableRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createItemCalificableDto: CreateItemCalificableDto) {
    return this.prisma.itemCalificable.create({ 
      data: {
        nombre: createItemCalificableDto.nombre,
        image: createItemCalificableDto.image,
        juegoId: createItemCalificableDto.juegoId,
      }
    });
  }

  async createMany(items: CreateItemCalificableDto[]) {
    return this.prisma.itemCalificable.createMany({
      data: items.map(item => ({
        nombre: item.nombre,
        image: item.image,
        juegoId: item.juegoId,
      }))
    });
  }

  async findAll(params: {
    categoryId?: string;
    tablaId?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    deviceId?: string;
  }) {
    const { search, sortBy, order, page, limit, deviceId } = params;
    const juegoId = (params as any).juegoId;
    const tablaId = params.tablaId;
    const where: any = {};

    if (tablaId) {
      // Filter items that belong to this specific tabla
      where.tablas = { some: { tablaId } };
    } else if (juegoId) {
      where.juegoId = juegoId;
    }

    if (search) {
      where.nombre = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.itemCalificable.count({ where });

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const items = await this.prisma.itemCalificable.findMany({
      where,
      include: { juego: { select: { id: true, nombre: true } } },
      skip,
      take,
      orderBy: (sortBy && sortBy !== 'averageRating') ? { [sortBy]: order || 'desc' } : undefined
    });

    if (items.length === 0) {
      return { items: [], total };
    }

    const itemIds = items.map(item => item.id);

    // Get average ratings and counts scoped to this tabla (if tablaId is set)
    const calificacionWhere: any = { itemId: { in: itemIds } };
    if (tablaId) calificacionWhere.tablaId = tablaId;

    const aggregateData = await this.prisma.calificacion.groupBy({
      by: ['itemId'],
      where: calificacionWhere,
      _avg: { puntuacion: true },
      _count: { puntuacion: true },
    });

    const userRatings = deviceId ? await this.prisma.calificacion.findMany({
      where: {
        ...calificacionWhere,
        deviceId: deviceId,
      },
    }) : [];

    const aggregateMap = new Map(aggregateData.map(data => [data.itemId, data]));
    const userRatingsMap = new Map(userRatings.map(rating => [rating.itemId, rating]));

    const enrichedItems = items.map(item => {
      const agg = aggregateMap.get(item.id) as any;
      const userRating = userRatingsMap.get(item.id) as any;

      return {
        ...item,
        averageRating: agg?._avg?.puntuacion ?? 0,
        ratingCount: agg?._count?.puntuacion ?? 0,
        myRating: userRating?.puntuacion ?? 0,
      };
    });

    // If not sorted by database, we might want to sort by averageRating if requested
    if (sortBy === 'averageRating') {
      enrichedItems.sort((a, b) =>
        order === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating
      );
    }

    return { items: enrichedItems, total };
  }

  async findOne(id: string, deviceId?: string) {
    const item = await this.prisma.itemCalificable.findUnique({ where: { id } });
    if (!item) {
      return null;
    }

    // Get average rating and count
    const aggregateData = await this.prisma.calificacion.aggregate({
      where: {
        itemId: id,
      },
      _avg: {
        puntuacion: true,
      },
      _count: {
        puntuacion: true,
      },
    });

    // Get user's specific rating
    const userRating = deviceId ? await this.prisma.calificacion.findFirst({
      where: {
        itemId: id,
        deviceId: deviceId,
      },
    }) : null;

    // Enrich item with rating data
    return {
      ...item,
      averageRating: aggregateData._avg?.puntuacion ?? 0,
      ratingCount: aggregateData._count?.puntuacion ?? 0,
      myRating: userRating?.puntuacion ?? 0,
    };
  }

  async update(id: string, updateItemCalificableDto: UpdateItemCalificableDto) {
    return this.prisma.itemCalificable.update({
      where: { id },
      data: updateItemCalificableDto,
    });
  }

  async remove(id: string) {
    return this.prisma.itemCalificable.delete({ where: { id } });
  }
}
