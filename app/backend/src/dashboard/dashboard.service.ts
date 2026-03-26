import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      juegosCount,
      categoriasCount,
      sorteosCount,
      votosCount,
      usuariosCount,
      calificacionesCount,
      tutorialesCount,
    ] = await Promise.all([
      this.prisma.juego.count(),
      this.prisma.categoria.count(),
      this.prisma.sorteo.count({ where: { estado: 'ACTIVO' } }),
      (this.prisma as any).bracketVote.count(),
      this.prisma.usuario.count(),
      this.prisma.calificacion.count(),
      this.prisma.tutorial.count(),
    ]);

    // Aggregate tutorial analytics
    const tutorialAnalytics = await (this.prisma as any).tutorial.aggregate({
      _sum: {
        utilidadCount: true,
        compartirCount: true,
      },
    });

    // Calcular participación total (Votos en torneos + Calificaciones)
    const participacionTotal = votosCount + calificacionesCount;

    return {
      counts: {
        juegos: juegosCount,
        categorias: categoriasCount,
        sorteos: sorteosCount,
        votos: votosCount,
        usuarios: usuariosCount,
        calificaciones: calificacionesCount,
        tutoriales: tutorialesCount,
        participacionTotal,
        tutorialesUtilidad: tutorialAnalytics._sum.utilidadCount || 0,
        tutorialesCompartidos: tutorialAnalytics._sum.compartirCount || 0,
      },
      // Actividad reciente (ejemplo: últimos 5 votos/calificaciones)
      recientes: {
        calificaciones: await this.prisma.calificacion.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { item: true },
        }),
        participantes: await this.prisma.sorteoParticipante.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { sorteo: true },
        }),
      },
    };
  }
}
