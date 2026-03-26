import { Controller, Get, Post, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BracketMediaService } from '../services/bracket-media.service';
import { AJDREW_THEME_GREEN } from '../generators/bracket-image.generator';

@Controller('social-media')
export class SocialMediaController {
  constructor(
    private readonly bracketMedia: BracketMediaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('preview/bracket')
  async previewBracket(
    @Query('tipo') tipo: 'apertura' | 'resultado' = 'apertura',
    @Res() res: Response,
  ) {
    const buffer = await this.bracketMedia.generarPreview({
      tipo,
      ronda: 'Semifinal',
      torneoNombre: 'Torneo Royale #1',
      cartaA: {
        id: 'carta-a-1',
        nombre: 'Caballero Negro',
        juego: 'Clash Royale',
        votos: tipo === 'resultado' ? 1203 : 0,
        porcentaje: tipo === 'resultado' ? 67 : 50,
        esGanador: tipo === 'resultado' ? true : undefined,
      },
      cartaB: {
        id: 'carta-b-1',
        nombre: 'Gigante',
        juego: 'Clash Royale',
        votos: tipo === 'resultado' ? 592 : 0,
        porcentaje: tipo === 'resultado' ? 33 : 50,
        esGanador: tipo === 'resultado' ? false : undefined,
      },
      horasCierre: tipo === 'apertura' ? 24 : undefined,
      theme: AJDREW_THEME_GREEN,
    });

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache',
    });
    res.send(buffer);
  }

  @Post('ranking/:categoriaId/publish')
  async publishRankingManually(@Param('categoriaId') categoriaId: string) {
    this.eventEmitter.emit('social.ranking.updated', { categoriaId });
    return {
      success: true,
      message: 'Evento de publicación de ranking emitido.',
    };
  }
}
