import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class YtService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Público ──────────────────────────────────────────────────────────

  async findBySlug(slug: string) {
    const viaje = await this.prisma.yTViaje.findUnique({
      where: { slug, activo: true },
    });
    if (!viaje) throw new NotFoundException(`Viaje "${slug}" no encontrado`);
    return viaje;
  }

  async registrarVisita(viajeId: string, deviceId: string, accion = 'view') {
    return this.prisma.yTVisita.create({
      data: { viajeId, deviceId, accion },
    });
  }

  // ─── Admin ────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.yTViaje.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { visitas: true } } },
    });
  }

  async create(data: {
    slug: string;
    titulo: string;
    descripcion?: string;
    youtubeUrl: string;
    thumbnail?: string;
    recursoTipo?: string;
    recursoId?: string;
  }) {
    return this.prisma.yTViaje.create({ data });
  }

  async update(id: string, data: Partial<{
    slug: string;
    titulo: string;
    descripcion: string;
    youtubeUrl: string;
    thumbnail: string;
    activo: boolean;
    recursoTipo: string;
    recursoId: string;
  }>) {
    return this.prisma.yTViaje.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.yTViaje.delete({ where: { id } });
  }

  async stats(id: string) {
    const total = await this.prisma.yTVisita.count({ where: { viajeId: id } });
    const porAccion = await this.prisma.yTVisita.groupBy({
      by: ['accion'],
      where: { viajeId: id },
      _count: { _all: true },
    });
    return { total, porAccion };
  }
}
