// src/calificaciones/infrastructure/persistence/calificacion.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCalificacionDto } from '../../application/dto/create-calificacion.dto';


@Injectable()
export class CalificacionRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCalificacionDto: CreateCalificacionDto, ip?: string, deviceId?: string) {
    const data = { ...createCalificacionDto, ip, deviceId };
    if (deviceId) {
      const existingRating = await this.prisma.calificacion.findFirst({
        where: {
          itemId: createCalificacionDto.itemId,
          deviceId: deviceId,
        },
      });

      if (existingRating) {
        return this.prisma.calificacion.update({
          where: { id: existingRating.id },
          data: { puntuacion: createCalificacionDto.puntuacion },
        });
      }
    }
    return this.prisma.calificacion.create({ data });
  }

  async findAll() {
    return this.prisma.calificacion.findMany();
  }

  async findOne(id: string) {
    return this.prisma.calificacion.findUnique({ where: { id } });
  }

  async findByDeviceIdAndItemId(deviceId: string, itemId: string) {
    return this.prisma.calificacion.findFirst({
      where: {
        deviceId,
        itemId,
      },
    });
  }

  async updateRating(id: string, puntuacion: number) {
    return this.prisma.calificacion.update({
      where: { id },
      data: { puntuacion },
    });
  }

  async getAverageRating(itemId: string): Promise<{ average: number; count: number }> {
    const result = await this.prisma.calificacion.aggregate({
      _avg: {
        puntuacion: true,
      },
      _count: {
        puntuacion: true,
      },
      where: {
        itemId,
      },
    });
    return {
      average: result._avg.puntuacion ?? 0,
      count: result._count.puntuacion ?? 0,
    };
  }

  async getRanking(categoryId?: string, limit?: number): Promise<Array<{ itemId: string; averageRating: number; ratingCount: number; itemName: string; itemImage?: string }>> {
    let itemIdsToFilter: string[] = [];

    if (categoryId) {
      const itemsInCategory = await this.prisma.itemCalificable.findMany({
        where: {
          categoriaId: categoryId,
        },
        select: {
          id: true,
        },
      });
      itemIdsToFilter = itemsInCategory.map(item => item.id);

      // If no items found in category, return empty ranking
      if (itemIdsToFilter.length === 0) {
        return [];
      }
    }

    const rankingData = await this.prisma.calificacion.groupBy({
      by: ['itemId'],
      where: itemIdsToFilter.length > 0 ? { itemId: { in: itemIdsToFilter } } : {},
      _avg: {
        puntuacion: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _avg: {
          puntuacion: 'desc',
        },
      },
      take: limit, // Apply limit if provided
    });

    if (rankingData.length === 0) {
      // If there are items but no votes, we might want to return unranked items?
      // For now, consistent with previous behavior, return empty. 
      // User complaint was about positions not updating, implying they have votes.
      // If items have 0 votes they won't appear here.
      // We should arguably return items with 0 votes too if we want "all items".
      // But for "Ranking", items with no votes are effectively last or unranked.
      // Let's stick to this for now.
      return [];
    }

    const itemIds = rankingData.map(r => r.itemId);

    const items = await this.prisma.itemCalificable.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      select: {
        id: true,
        nombre: true,
        image: true,
      },
    });

    interface ItemMap {
      id: string;
      nombre: string; // Fix type definition
      image: string | null;
    }

    const itemsMap = new Map<string, ItemMap>(
      items.map(item => [item.id, item] as [string, ItemMap])
    );

    // Filter out any items that might have been deleted but still have votes (integrity check)
    // and map to result
    const ranking = rankingData
      .filter(r => itemsMap.has(r.itemId))
      .map(r => {
        const item = itemsMap.get(r.itemId);
        return {
          itemId: r.itemId,
          averageRating: r._avg?.puntuacion || 0,
          ratingCount: r._count?._all || 0,
          itemName: item?.nombre || 'Unknown',
          itemImage: item?.image || undefined,
        };
      });

    return ranking;
  }
}
