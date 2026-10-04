import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDbStatus() {
    try {
      const juegosCount = await this.prisma.juego.count();
      const calificacionesCount = await this.prisma.calificacion.count();
      const itemsCount = await this.prisma.itemCalificable.count();
      const categoriasCount = await this.prisma.categoria.count();

      return {
        status: 'OK',
        juegos: juegosCount,
        calificaciones: calificacionesCount,
        items: itemsCount,
        categorias: categoriasCount,
      };
    } catch (error) {
      return {
        status: 'ERROR',
        error: error.message,
      };
    }
  }
}
