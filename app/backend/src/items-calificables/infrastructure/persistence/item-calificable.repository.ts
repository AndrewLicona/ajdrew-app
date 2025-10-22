
import { Injectable } from'@nestjs/common';
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
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemCalificableDto: CreateItemCalificableDto) {
    return this.prisma.itemCalificable.create({ data: createItemCalificableDto });
  }

  async findAll(categoryId?: string, deviceId?: string) {
    const where = categoryId ? { categoriaId: categoryId } : {};
    const items = await this.prisma.itemCalificable.findMany({ where });

    if (items.length === 0) {
      return [];
    }

    const itemIds = items.map(item => item.id);

    // Get average ratings and counts
    const aggregateData = await this.prisma.calificacion.groupBy({
      by: ['itemId'],
      where: {
        itemId: { in: itemIds },
      },
      _avg: {
        puntuacion: true,
      },
      _count: {
        puntuacion: true,
      },
    });

    // Get user's specific ratings
    interface UserRating {
      itemId: string;
      puntuacion: number;
      [key: string]: any; // Para otras propiedades que pueda tener el objeto
    }

    const userRatings = deviceId ? await this.prisma.calificacion.findMany({
      where: {
        itemId: { in: itemIds },
        deviceId: deviceId,
      },
    }) : [];

    // Create maps for efficient lookup
    const aggregateMap = new Map(aggregateData.map(data => [data.itemId, data]));
    const userRatingsMap = new Map<string, UserRating>(
      (userRatings as UserRating[]).map(rating => [rating.itemId, rating])
    );

    // Enrich items with rating data
    const enrichedItems = items.map(item => {
      const agg = aggregateMap.get(item.id) as AggregationResult | undefined;
      const userRating = userRatingsMap.get(item.id);

      return {
        ...item,
        averageRating: agg?._avg?.puntuacion ?? 0,
        ratingCount: agg?._count?._all ?? 0,
        myRating: userRating?.puntuacion ?? 0,
      };
    });

    return enrichedItems;
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
