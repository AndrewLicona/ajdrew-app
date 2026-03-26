// src/calificaciones/infrastructure/persistence/calificacion.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCalificacionDto } from '../../application/dto/create-calificacion.dto';

@Injectable()
export class CalificacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCalificacionDto: CreateCalificacionDto,
    ip?: string,
    deviceId?: string,
  ) {
    const data = { ...createCalificacionDto, ip, deviceId };
    if (deviceId) {
      const existingRating = await this.prisma.calificacion.findFirst({
        where: {
          itemId: createCalificacionDto.itemId,
          deviceId: deviceId,
          // Scope to the same tabla so same item can be rated independently per tabla
          tablaId: createCalificacionDto.tablaId ?? null,
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

  async getAverageRating(
    itemId: string,
  ): Promise<{ average: number; count: number }> {
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

  async getRanking(
    tablaId?: string,
    limit?: number,
    juegoId?: string,
  ): Promise<
    Array<{
      itemId: string;
      averageRating: number;
      ratingCount: number;
      itemName: string;
      itemImage?: string;
    }>
  > {
    let itemIdsToFilter: string[] = [];

    if (tablaId) {
      const itemsInTabla = await this.prisma.tablaItem.findMany({
        where: {
          tablaId: tablaId,
        },
        select: {
          itemId: true,
        },
      });
      itemIdsToFilter = itemsInTabla.map((item) => item.itemId);

      // If no items found in tabla, return empty ranking
      if (itemIdsToFilter.length === 0) {
        return [];
      }
    } else if (juegoId) {
      const itemsInGame = await this.prisma.itemCalificable.findMany({
        where: { juegoId },
        select: { id: true },
      });
      itemIdsToFilter = itemsInGame.map((item) => item.id);
      if (itemIdsToFilter.length === 0) return [];
    }

    const whereFilter: any =
      itemIdsToFilter.length > 0 ? { itemId: { in: itemIdsToFilter } } : {};
    // Always scope ranking to a specific tabla when provided
    if (tablaId) whereFilter.tablaId = tablaId;

    const rankingData = await this.prisma.calificacion.groupBy({
      by: ['itemId'],
      where: whereFilter,
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

    const itemIds = rankingData.map((r) => r.itemId);

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
      items.map((item) => [item.id, item] as [string, ItemMap]),
    );

    // Filter out any items that might have been deleted but still have votes (integrity check)
    // and map to result
    const ranking = rankingData
      .filter((r) => itemsMap.has(r.itemId))
      .map((r) => {
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
