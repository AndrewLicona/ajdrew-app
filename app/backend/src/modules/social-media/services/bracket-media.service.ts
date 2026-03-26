import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CloudinaryProvider } from '../../../media/cloudinary.provider';
import {
  generarImagenBracket,
  AJDREW_THEME_GREEN,
  BracketMatchImageOptions,
  RondaNombre,
} from '../generators/bracket-image.generator';

import { MetaService } from './meta.service';
import { XService } from './x.service';
import { PrismaService } from '../../../prisma/prisma.service';

// ─── Eventos del dominio ──────────────────────────────────────────────────────

export class BracketMatchAbiertoEvent {
  constructor(
    public readonly matchId: string,
    public readonly torneoNombre: string,
    public readonly ronda: RondaNombre,
    public readonly juego: string,
    public readonly cartaAId: string,
    public readonly cartaANombre: string,
    public readonly cartaAImagenUrl: string,
    public readonly cartaBId: string,
    public readonly cartaBNombre: string,
    public readonly cartaBImagenUrl: string,
    public readonly horasCierre: number,
  ) {}
}

export class BracketMatchCerradoEvent {
  constructor(
    public readonly matchId: string,
    public readonly torneoNombre: string,
    public readonly ronda: RondaNombre,
    public readonly juego: string,
    public readonly cartaAId: string,
    public readonly cartaANombre: string,
    public readonly cartaAImagenUrl: string,
    public readonly cartaAVotos: number,
    public readonly cartaAPorcentaje: number,
    public readonly cartaBId: string,
    public readonly cartaBNombre: string,
    public readonly cartaBImagenUrl: string,
    public readonly cartaBVotos: number,
    public readonly cartaBPorcentaje: number,
    public readonly ganadorId: string,
  ) {}
}

export interface BracketImageResult {
  matchId: string;
  tipo: 'apertura' | 'resultado';
  buffer: Buffer;
  cloudinaryUrl?: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

@Injectable()
export class BracketMediaService {
  private readonly logger = new Logger(BracketMediaService.name);

  constructor(
    private readonly cloudinary: CloudinaryProvider,
    private readonly meta: MetaService,
    private readonly x: XService,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('bracket.match.abierto')
  async onMatchAbierto(event: BracketMatchAbiertoEvent): Promise<void> {
    this.logger.log(`Generando imagen APERTURA para match ${event.matchId}`);

    try {
      const result = await this.generarYSubir(
        {
          tipo: 'apertura',
          ronda: event.ronda,
          torneoNombre: event.torneoNombre,
          cartaA: {
            id: event.cartaAId,
            nombre: event.cartaANombre,
            juego: event.juego,
            imagenUrl: event.cartaAImagenUrl,
            votos: 0,
            porcentaje: 50,
          },
          cartaB: {
            id: event.cartaBId,
            nombre: event.cartaBNombre,
            juego: event.juego,
            imagenUrl: event.cartaBImagenUrl,
            votos: 0,
            porcentaje: 50,
          },
          horasCierre: event.horasCierre,
          theme: AJDREW_THEME_GREEN,
        },
        event.matchId,
      );

      this.logger.log(`Imagen apertura lista: ${result.cloudinaryUrl}`);

      if (result.cloudinaryUrl) {
        // Tarea 6: Publicar a Meta
        await this.meta.publishPhaseAnnouncement(
          event.matchId,
          1, // Placeholder round, o mapear
          result.cloudinaryUrl,
        );

        // Publicar a X
        await this.x.publishPhaseAnnouncement(event.matchId, 1, result.buffer);

        // Update bracket imageUrl
        const match = await this.prisma.bracketMatch.findUnique({
          where: { id: event.matchId },
          select: { bracketId: true },
        });
        if (match) {
          await this.prisma.votacionBracket.update({
            where: { id: match.bracketId },
            data: { imageUrl: result.cloudinaryUrl },
          });
        }
      }
    } catch (err) {
      this.logger.error(
        `Error generando imagen apertura: ${err.message}`,
        err.stack,
      );
    }
  }

  @OnEvent('bracket.match.cerrado')
  async onMatchCerrado(event: BracketMatchCerradoEvent): Promise<void> {
    this.logger.log(`Generando imagen RESULTADO para match ${event.matchId}`);

    try {
      const result = await this.generarYSubir(
        {
          tipo: 'resultado',
          ronda: event.ronda,
          torneoNombre: event.torneoNombre,
          cartaA: {
            id: event.cartaAId,
            nombre: event.cartaANombre,
            juego: event.juego,
            imagenUrl: event.cartaAImagenUrl,
            votos: event.cartaAVotos,
            porcentaje: event.cartaAPorcentaje,
            esGanador: event.ganadorId === event.cartaAId,
          },
          cartaB: {
            id: event.cartaBId,
            nombre: event.cartaBNombre,
            juego: event.juego,
            imagenUrl: event.cartaBImagenUrl,
            votos: event.cartaBVotos,
            porcentaje: event.cartaBPorcentaje,
            esGanador: event.ganadorId === event.cartaBId,
          },
          theme: AJDREW_THEME_GREEN,
        },
        event.matchId,
      );

      this.logger.log(`Imagen resultado lista: ${result.cloudinaryUrl}`);

      if (result.cloudinaryUrl) {
        // Publicar Ganador
        const winnerName =
          event.ganadorId === event.cartaAId
            ? event.cartaANombre
            : event.cartaBNombre;

        await this.meta.publishMatchResult(
          event.matchId,
          1,
          result.cloudinaryUrl,
          winnerName,
        );

        await this.x.publishMatchResult(
          event.matchId,
          1,
          result.buffer,
          winnerName,
        );

        // Update bracket imageUrl
        const match = await this.prisma.bracketMatch.findUnique({
          where: { id: event.matchId },
          select: { bracketId: true },
        });
        if (match) {
          await this.prisma.votacionBracket.update({
            where: { id: match.bracketId },
            data: { imageUrl: result.cloudinaryUrl },
          });
        }
      }
    } catch (err) {
      this.logger.error(
        `Error generando imagen resultado: ${err.message}`,
        err.stack,
      );
    }
  }

  async generarYSubir(
    opts: BracketMatchImageOptions,
    matchId: string,
  ): Promise<BracketImageResult> {
    const buffer = await generarImagenBracket(opts);

    // Adaptación a CloudinaryProvider: espera un objeto con buffer
    const pseudoFile = { buffer };
    const folder = `brackets/${matchId}`;

    const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

    return {
      matchId,
      tipo: opts.tipo,
      buffer,
      cloudinaryUrl,
    };
  }

  async generarPreview(opts: BracketMatchImageOptions): Promise<Buffer> {
    return generarImagenBracket(opts);
  }
}
