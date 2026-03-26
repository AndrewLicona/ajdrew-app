// src/calificaciones/application/calificaciones.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CalificacionRepository } from '../infrastructure/persistence/calificacion.repository';
import { ItemsCalificablesService } from '../../items-calificables/application/items-calificables.service';

@Injectable()
export class CalificacionesService {
  constructor(
    private readonly calificacionRepository: CalificacionRepository,
    @Inject(ItemsCalificablesService)
    private readonly itemsCalificablesService: ItemsCalificablesService,
  ) {}

  async create(
    createCalificacionDto: CreateCalificacionDto,
    ip?: string,
    deviceId?: string,
  ) {
    await this.calificacionRepository.create(
      createCalificacionDto,
      ip,
      deviceId,
    );
    // Después de calificar, busca y devuelve el item actualizado, que ya incluye los promedios y myRating.
    return this.itemsCalificablesService.findOne(
      createCalificacionDto.itemId,
      deviceId,
    );
  }

  findAll() {
    return this.calificacionRepository.findAll();
  }

  async findOne(id: string) {
    const calificacion = await this.calificacionRepository.findOne(id);
    if (!calificacion) {
      throw new NotFoundException(`Calificacion con ID ${id} no encontrada`);
    }
    return calificacion;
  }

  getAverageRating(
    itemId: string,
  ): Promise<{ average: number; count: number }> {
    return this.calificacionRepository.getAverageRating(itemId);
  }

  findMyRating(itemId: string, deviceId: string) {
    return this.calificacionRepository.findByDeviceIdAndItemId(
      deviceId,
      itemId,
    );
  }

  async getRanking(tablaId?: string, juegoId?: string) {
    return this.calificacionRepository.getRanking(tablaId, undefined, juegoId);
  }
}
