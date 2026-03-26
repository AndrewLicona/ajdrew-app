// src/calificaciones/interfaces/calificaciones.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  HttpCode,
  Header,
  Headers,
} from '@nestjs/common';
import { CalificacionesService } from '../application/calificaciones.service';
import { CreateCalificacionDto } from '../application/dto/create-calificacion.dto';
import { RankingMediaService } from '../application/ranking-media.service';
import type { Request } from 'express';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(
    private readonly calificacionesService: CalificacionesService,
    private readonly rankingMediaService: RankingMediaService,
  ) {}

  @Post()
  create(
    @Body() createCalificacionDto: CreateCalificacionDto,
    @Req() request: Request,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const ip = request.ip;
    return this.calificacionesService.create(
      createCalificacionDto,
      ip,
      deviceId,
    );
  }

  @Get()
  findAll() {
    return this.calificacionesService.findAll();
  }

  @Get('average/:itemId')
  getAverageRating(@Param('itemId') itemId: string) {
    return this.calificacionesService.getAverageRating(itemId);
  }

  @Get('my-rating/:itemId')
  async findMyRating(
    @Param('itemId') itemId: string,
    @Req() request: Request,
    @Headers('x-device-id') deviceId?: string,
  ) {
    if (!deviceId) {
      return { puntuacion: 0 };
    }
    const rating = await this.calificacionesService.findMyRating(
      itemId,
      deviceId,
    );
    if (!rating) {
      return { puntuacion: 0 };
    }
    return rating;
  }

  @Get('ranking-list')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getRanking(
    @Query('tablaId') tablaId?: string,
    @Query('juegoId') juegoId?: string,
  ) {
    return this.calificacionesService.getRanking(tablaId, juegoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(id);
  }
}
