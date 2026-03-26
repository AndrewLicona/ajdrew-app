import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { DiscordService } from '../services/discord.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';
import { YoutubeService } from '../services/youtube.service';
import { VsImageGenerator } from '../generators/vs-image.generator';

import { CloudinaryProvider } from '../../../media/cloudinary.provider';

@Injectable()
export class BracketPhaseListener {
  private readonly logger = new Logger(BracketPhaseListener.name);

  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
    private xService: XService,
    private metaService: MetaService,
    private youtubeService: YoutubeService,
    private vsImageGenerator: VsImageGenerator,
    private cloudinary: CloudinaryProvider,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // NUEVA FASE / RONDA — genera 1 imagen VS por cada match
  // ──────────────────────────────────────────────────────────────────────────
  @OnEvent('bracket.phase.started')
  async handlePhaseStarted(payload: { bracketId: string; round: number }) {
    this.logger.log(`Phase started: bracket ${payload.bracketId}, round ${payload.round}`);

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: {
          matches: {
            where: { ronda: payload.round },
            include: { itemA: true, itemB: true },
          },
        },
      });

      if (!bracket) {
        this.logger.warn(`Bracket not found: ${payload.bracketId}`);
        return;
      }

      const matchedGames = bracket.matches.filter(m => m.itemA && m.itemB);

      if (matchedGames.length === 0) {
        this.logger.warn(`No matches found for round ${payload.round}`);
        return;
      }

      let finalBuffer: Buffer;

      if (matchedGames.length === 1) {
        // Final o única match -> VS Image
        const match = matchedGames[0];
        finalBuffer = await this.vsImageGenerator.generateVsImage(
          bracket.tematica,
          payload.round,
          { name: match.itemA!.nombre, image: match.itemA!.image || undefined },
          { name: match.itemB!.nombre, image: match.itemB!.image || undefined },
        );
      } else {
        // Ronda con múltiples matches -> Round List Image
        const mappedMatches = matchedGames.map(m => ({
          itemA: m.itemA ? { name: m.itemA.nombre, image: m.itemA.image || undefined } : null,
          itemB: m.itemB ? { name: m.itemB.nombre, image: m.itemB.image || undefined } : null,
        }));
        finalBuffer = await this.vsImageGenerator.generateRoundListImage(
          bracket.tematica,
          payload.round,
          mappedMatches,
        );
      }

      // Subir imagen a Cloudinary
      const pseudoFile = { buffer: finalBuffer };
      const folder = `brackets/${payload.bracketId}/round_${payload.round}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload bracket phase image to Cloudinary');
      }

      // Guardar URL pública como array JSON (para carrusel de admin)
      await this.prisma.votacionBracket.update({
        where: { id: payload.bracketId },
        data: { imageUrl: JSON.stringify([cloudinaryUrl]) },
      });

      // Publicar en Discord usando la URL directa (optimizada sin pasar Buffer si el servicio lo soporta, o pasar URL y ajustar el servicio)
      await this.discordService.publishPhaseAnnouncement(
        payload.bracketId,
        payload.round,
        cloudinaryUrl, // Cambiaremos DiscordService para recibir URL directo
      );

      // Publicar en X (mantiene buffer porque su API sube media en crudo)
      await this.xService.publishPhaseAnnouncement(
        payload.bracketId,
        payload.round,
        finalBuffer,
      );

      this.logger.log(`Round ${payload.round} published with Cloudinary URL: ${cloudinaryUrl}`);
    } catch (error) {
      this.logger.error('Error handling bracket phase started event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CAMPEÓN DECLARADO — genera imagen VS de la final con ganador resaltado
  // ──────────────────────────────────────────────────────────────────────────
  @OnEvent('bracket.champion.declared')
  async handleChampionDeclared(payload: { bracketId: string; championId: string }) {
    this.logger.log(`Champion declared for bracket ${payload.bracketId}`);

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: {
          matches: {
            orderBy: { ronda: 'desc' },
            take: 1,
            include: { itemA: true, itemB: true },
          },
        },
      });

      if (!bracket) {
        this.logger.warn('Bracket not found');
        return;
      }

      // La última match es la final
      const finalMatch = bracket.matches[0];
      const isChampionA = finalMatch?.itemAId === payload.championId;
      const winner = isChampionA ? finalMatch?.itemA : finalMatch?.itemB;
      const finalist = isChampionA ? finalMatch?.itemB : finalMatch?.itemA;

      // Fallback si no se encuentra la match final
      const champion = winner ?? await this.prisma.itemCalificable.findUnique({
        where: { id: payload.championId },
      });

      if (!champion) {
        this.logger.warn('Champion not found');
        return;
      }

      // Imagen VS con ganador resaltado
      const champBuffer = await this.vsImageGenerator.generateChampionImage(
        bracket.tematica,
        { name: champion.nombre, image: champion.image || undefined },
        finalist ? { name: finalist.nombre, image: finalist.image || undefined } : null,
      );

      // Subir imagen del campeón a Cloudinary
      const pseudoFile = { buffer: champBuffer };
      const folder = `brackets/${payload.bracketId}/champion`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload champion image to Cloudinary');
      }

      // Guardar imagen del campeón como JSON array (compatible con el carrusel del admin)
      await this.prisma.votacionBracket.update({
        where: { id: payload.bracketId },
        data: { imageUrl: JSON.stringify([cloudinaryUrl]) },
      });

      // Publicar en Discord (usando URL directo)
      await this.discordService.publishPhaseAnnouncement(
        payload.bracketId,
        999,
        cloudinaryUrl,
      );

      // Publicar en X (usando buffer)
      await this.xService.publishPhaseAnnouncement(
        payload.bracketId,
        999,
        champBuffer,
      );

      this.logger.log(`Champion image published: ${champion.nombre}`);
    } catch (error) {
      this.logger.error('Error handling champion declared event', error);
    }
  }
}
