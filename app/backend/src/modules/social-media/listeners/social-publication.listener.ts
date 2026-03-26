import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { DiscordService } from '../services/discord.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';
import { YoutubeService } from '../services/youtube.service';

import {
  generarImagenSorteo,
  SorteoImageData,
} from '../generators/sorteo-image.generator';
import { RankingImageGenerator } from '../../../calificaciones/application/ranking-image-generator';
import { VsImageGenerator } from '../generators/vs-image.generator';
import { CloudinaryProvider } from '../../../media/cloudinary.provider';

@Injectable()
export class SocialPublicationListener {
  private readonly logger = new Logger(SocialPublicationListener.name);

  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
    private xService: XService,
    private metaService: MetaService,
    private youtubeService: YoutubeService,
    private rankingImageGenerator: RankingImageGenerator,
    private vsImageGenerator: VsImageGenerator,
    private cloudinary: CloudinaryProvider,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // TUTORIALES
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.tutorial.published')
  async handleTutorialPublished(payload: { tutorialId: string }) {
    this.logger.log(`Handling tutorial published event: ${payload.tutorialId}`);

    try {
      const tutorial = await this.prisma.tutorial.findUnique({
        where: { id: payload.tutorialId },
        include: { juego: true },
      });

      if (!tutorial || !tutorial.activo) {
        this.logger.warn(
          `Tutorial not found or not active: ${payload.tutorialId}`,
        );
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const tutorialUrl = `${frontendUrl}/tutoriales/${tutorial.slug}`;

      // Usar la imagen del tutorial o del juego
      const imageUrl = tutorial.image || (tutorial as any).juego?.image;

      // Texto para redes sociales
      const text = this.buildTutorialText(tutorial);

      // Publicar en Discord
      await this.discordService.publishTutorial(tutorial, text, imageUrl || '');

      // Publicar en X
      await this.xService.publishTutorial(tutorial, text, imageUrl || '');

      // Publicar en Meta (Facebook e Instagram)
      await this.metaService.publishTutorial(tutorial, text, imageUrl || '');

      this.logger.log(`Tutorial published successfully: ${tutorial.titulo}`);
    } catch (error) {
      this.logger.error('Error handling tutorial published event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SORTEOS - CREACIÓN
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.sorteo.created')
  async handleSorteoCreated(payload: { sorteoId: string }) {
    this.logger.log(`Handling sorteo created event: ${payload.sorteoId}`);

    try {
      const sorteo = await this.prisma.sorteo.findUnique({
        where: { id: payload.sorteoId },
        include: { juego: true },
      });

      if (!sorteo || sorteo.estado !== 'ACTIVO') {
        this.logger.warn(`Sorteo not found or not active: ${payload.sorteoId}`);
        return;
      }

      // Generar imagen del sorteo
      const imageData: SorteoImageData = {
        titulo: sorteo.titulo,
        premio: sorteo.premio,
        fechaFin: sorteo.fechaFin,
        imagenUrl: sorteo.image || undefined,
        juegoNombre: sorteo.juego?.nombre,
      };

      const imageBuffer = await generarImagenSorteo(imageData);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const sorteoUrl = `${frontendUrl}/sorteos/${sorteo.id}`;

      // Texto para redes sociales
      const text = this.buildSorteoCreatedText(sorteo);

      // Publicar en Discord con imagen generada
      await this.discordService.publishSorteoCreated(sorteo, text, imageBuffer);

      // Publicar en X
      await this.xService.publishSorteoCreated(sorteo, text, imageBuffer);

      // Subir imagen a Cloudinary para Meta y YouTube
      const pseudoFile = { buffer: imageBuffer };
      const folder = `sorteos/${sorteo.id}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload sorteo image to Cloudinary');
      }

      // Publicar en Meta
      await this.metaService.publishSorteoCreated(sorteo, text, cloudinaryUrl);

      // Publicar en YouTube
      await this.youtubeService.publishVideoFromImage(
        cloudinaryUrl,
        `¡NUEVO SORTEO! - ${sorteo.titulo}`,
        `Participa en el sorteo de ${sorteo.premio} en Elite Rankings.`,
        ['Sorteo', 'Giveaway', sorteo.juego?.nombre || 'Gaming'],
        { sorteoId: sorteo.id }
      );

      this.logger.log(`Sorteo published successfully: ${sorteo.titulo}`);
    } catch (error) {
      this.logger.error('Error handling sorteo created event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SORTEOS - GANADORES
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.sorteo.winners')
  async handleSorteoWinners(payload: {
    sorteoId: string;
    winnerIds: string[];
  }) {
    this.logger.log(`Handling sorteo winners event: ${payload.sorteoId}`);

    try {
      const sorteo = await this.prisma.sorteo.findUnique({
        where: { id: payload.sorteoId },
        include: {
          juego: true,
          ganadores: { include: { usuario: true } },
        },
      });

      if (!sorteo) {
        this.logger.warn(`Sorteo not found: ${payload.sorteoId}`);
        return;
      }

      // Generar imagen del sorteo (misma que creación)
      const imageData: SorteoImageData = {
        titulo: sorteo.titulo,
        premio: sorteo.premio,
        fechaFin: sorteo.fechaFin,
        imagenUrl: sorteo.image || undefined,
        juegoNombre: sorteo.juego?.nombre,
      };

      const imageBuffer = await generarImagenSorteo(imageData);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const sorteoUrl = `${frontendUrl}/sorteos/${sorteo.id}`;

      // Obtener nombres de ganadores
      const winnerNames = sorteo.ganadores
        .map(
          (g) =>
            g.usuario?.nombre ||
            g.nombreManual ||
            g.usuario?.email ||
            g.emailManual ||
            'Participante',
        )
        .slice(0, 3);

      // Texto para redes sociales
      const text = this.buildSorteoWinnersText(sorteo, winnerNames);

      // Publicar en Discord
      await this.discordService.publishSorteoWinners(
        sorteo,
        text,
        imageBuffer,
        winnerNames,
      );

      // Publicar en X
      await this.xService.publishSorteoWinners(
        sorteo,
        text,
        imageBuffer,
        winnerNames,
      );

      // Guardar imagen y publicar en Meta
      const pseudoFile = { buffer: imageBuffer };
      const folder = `sorteos/${sorteo.id}/winners`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (cloudinaryUrl) {
        await this.metaService.publishSorteoWinners(
          sorteo,
          text,
          cloudinaryUrl,
          winnerNames,
        );
      }

      this.logger.log(
        `Sorteo winners published successfully: ${sorteo.titulo}`,
      );
    } catch (error) {
      this.logger.error('Error handling sorteo winners event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RANKINGS - ACTUALIZACIÓN
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.ranking.updated')
  async handleRankingUpdated(payload: { categoriaId: string }) {
    this.logger.log(`Handling ranking updated event: ${payload.categoriaId}`);

    try {
      // payload.categoriaId puede ser el ID de una TablaCalificacion (lo más usual para rankings)
      const tabla = await this.prisma.tablaCalificacion.findUnique({
        where: { id: payload.categoriaId },
        include: { juego: true },
      });

      if (!tabla) {
        this.logger.warn(`TablaCalificacion not found: ${payload.categoriaId}`);
        return;
      }

      // Obtener top 5 items de la tabla
      const itemsInTabla = await this.prisma.tablaItem.findMany({
        where: { tablaId: tabla.id },
        select: { itemId: true },
      });
      const itemIds = itemsInTabla.map((i) => i.itemId);

      if (itemIds.length === 0) return;

      // Agrupar calificaciones para promedios
      const rankingData = await this.prisma.calificacion.groupBy({
        by: ['itemId'],
        where: { itemId: { in: itemIds }, tablaId: tabla.id },
        _avg: { puntuacion: true },
        orderBy: { _avg: { puntuacion: 'desc' } },
        take: 5,
      });

      const topIds = rankingData.map((r) => r.itemId);
      const items = await this.prisma.itemCalificable.findMany({
        where: { id: { in: topIds } },
      });

      const itemsMap = new Map(items.map((i) => [i.id, i]));

      // Preparar datos para generar imagen
      const topItems = rankingData
        .filter((r) => itemsMap.has(r.itemId))
        .map((r) => {
          const item = itemsMap.get(r.itemId)!;
          return {
            itemName: item.nombre,
            itemImage: item.image || undefined,
            averageRating: r._avg?.puntuacion || 0,
          };
        });

      const imageBuffer = await this.rankingImageGenerator.generateRankingImage(
        tabla.nombre,
        topItems,
      );

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const rankingUrl = `${frontendUrl}/calificaciones/${tabla.id}`;

      // Texto para redes sociales
      const text = this.buildRankingText(tabla, topItems);

      // Subir imagen a Cloudinary
      const pseudoFile = { buffer: imageBuffer };
      const folder = `rankings/${tabla.id}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload ranking image to Cloudinary');
      }

      // Publicar en Discord
      await this.discordService.publishRanking(tabla as any, text, cloudinaryUrl);

      // Publicar en X
      await this.xService.publishRanking(tabla as any, text, imageBuffer);

      // Publicar en Meta
      await this.metaService.publishRanking(tabla as any, text, cloudinaryUrl);

      // Publicar en YouTube
      await this.youtubeService.publishVideoFromImage(
        cloudinaryUrl,
        `Ranking Actualizado: ${tabla.nombre}`,
        `Consulta el Top 5 de ${tabla.nombre} en nuestra web.`,
        ['Ranking', 'Top5', tabla.juego?.nombre || 'Gaming']
      );

      this.logger.log(`Ranking published successfully: ${tabla.nombre}`);
    } catch (error) {
      this.logger.error('Error handling ranking updated event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TABLA DE CALIFICACIÓN - CREACIÓN
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.tabla.created')
  async handleTablaCreated(payload: { tablaId: string }) {
    this.logger.log(`Handling tabla created event: ${payload.tablaId}`);

    try {
      const tabla = await this.prisma.tablaCalificacion.findUnique({
        where: { id: payload.tablaId },
        include: {
          juego: true,
          items: { include: { item: true }, take: 5 },
        },
      });

      if (!tabla) {
        this.logger.warn(`TablaCalificacion not found: ${payload.tablaId}`);
        return;
      }

      // Buscar ratings reales y conteo de votos de la BD para cada ítem
      const topItems = await Promise.all(
        tabla.items.map(async (ti) => {
          const aggResult = await this.prisma.calificacion.aggregate({
            where: { itemId: ti.item.id },
            _avg: { puntuacion: true },
            _count: { id: true },
          });
          return {
            itemName: ti.item.nombre,
            itemImage: ti.item.image || undefined,
            averageRating: aggResult._avg.puntuacion ?? 0,
            voteCount: aggResult._count.id ?? 0,
          };
        }),
      );

      // Generar imagen con las cartas (sin puntuaciones)
      const imageBuffer = await this.rankingImageGenerator.generateRankingImage(
        tabla.nombre,
        topItems,
      );

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const tablaUrl = `${frontendUrl}/calificaciones/${tabla.slug || tabla.id}`;

      const text = this.buildTablaCreatedText(tabla);

      // Subir imagen de creación a Cloudinary
      const pseudoFile = { buffer: imageBuffer };
      const folder = `rankings/${tabla.id}/created`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload tabla creation image to Cloudinary');
      }

      // Publicar en Discord
      await this.discordService.publishRanking(tabla as any, text, cloudinaryUrl);

      // Publicar en X
      await this.xService.publishRanking(tabla as any, text, imageBuffer);

      // Publicar en Meta
      await this.metaService.publishRanking(tabla as any, text, cloudinaryUrl);

      this.logger.log(`Tabla created published successfully: ${tabla.nombre}`);
    } catch (error) {
      this.logger.error('Error handling tabla created event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BRACKET / VOTACIÓN - CREACIÓN
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('social.bracket.created')
  async handleBracketCreated(payload: { bracketId: string }) {
    this.logger.log(`Handling bracket created event: ${payload.bracketId}`);

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: {
          juego: true,
          matches: {
            where: { ronda: 1 },
            include: { itemA: true, itemB: true },
          },
        },
      });

      if (!bracket) {
        this.logger.warn(`Bracket not found: ${payload.bracketId}`);
        return;
      }

      const text = this.buildBracketCreatedText(bracket);

      const matchedGames = bracket.matches.filter(m => m.itemA && m.itemB);

      if (matchedGames.length === 0) {
        this.logger.warn(`No matches found for bracket: ${payload.bracketId}`);
        return;
      }

      let finalBuffer: Buffer;

      if (matchedGames.length === 1) {
        const match = matchedGames[0];
        finalBuffer = await this.vsImageGenerator.generateVsImage(
          bracket.tematica,
          1,
          { name: match.itemA!.nombre, image: match.itemA!.image || undefined },
          { name: match.itemB!.nombre, image: match.itemB!.image || undefined },
        );
      } else {
        const mappedMatches = matchedGames.map(m => ({
          itemA: m.itemA ? { name: m.itemA.nombre, image: m.itemA.image || undefined } : null,
          itemB: m.itemB ? { name: m.itemB.nombre, image: m.itemB.image || undefined } : null,
        }));
        finalBuffer = await this.vsImageGenerator.generateRoundListImage(
          bracket.tematica,
          1,
          mappedMatches,
        );
      }

      const pseudoFile = { buffer: finalBuffer };
      const folder = `brackets/${bracket.id}/created`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
          throw new Error('Failed to upload bracket creation image to Cloudinary');
      }

      await this.prisma.votacionBracket.update({
        where: { id: bracket.id },
        data: { imageUrl: JSON.stringify([cloudinaryUrl]) },
      });

      // Publicar en Discord
      await this.discordService.publishPhaseAnnouncement(
        payload.bracketId,
        1,
        cloudinaryUrl,
      );

      // Publicar en X
      await this.xService.publishBracketCreated(bracket, text, finalBuffer);

      // Publicar en Meta
      await this.metaService.publishBracketCreated(bracket, text, cloudinaryUrl);

      this.logger.log(
        `Bracket created published: ${bracket.tematica} — with Cloudinary URL: ${cloudinaryUrl}`,
      );
    } catch (error) {
      this.logger.error('Error handling bracket created event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BRACKET / VOTACIÓN - AVANCE DE FASE
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('bracket.phase.started')
  async handleBracketPhaseStarted(payload: {
    bracketId: string;
    round: number;
    matches: any[];
  }) {
    this.logger.log(
      `Handling bracket phase started event: ${payload.bracketId} (Round ${payload.round})`,
    );

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: { juego: true },
      });

      if (!bracket) return;

      const text = this.buildPhaseAnnouncementText(bracket, payload.round);

      // Generar imagen de la fase (lista de matches)
      const mappedMatches = payload.matches
        .filter((m) => m.itemA && m.itemB)
        .map((m) => ({
          itemA: { name: m.itemA.nombre, image: m.itemA.image || undefined },
          itemB: { name: m.itemB.nombre, image: m.itemB.image || undefined },
        }));

      if (mappedMatches.length === 0) return;

      const imageBuffer = await this.vsImageGenerator.generateRoundListImage(
        bracket.tematica,
        payload.round,
        mappedMatches,
      );

      const pseudoFile = { buffer: imageBuffer };
      const folder = `brackets/${bracket.id}/round-${payload.round}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      if (!cloudinaryUrl) {
        throw new Error('Failed to upload phase image to Cloudinary');
      }

      // 1. Discord
      await this.discordService.publishPhaseAnnouncement(
        bracket.id,
        payload.round,
        cloudinaryUrl,
      );

      // 2. X
      await this.xService.publishBracketCreated(bracket, text, imageBuffer);

      // 3. Meta
      await this.metaService.publishPhaseAnnouncement(
        bracket.id,
        payload.round,
        cloudinaryUrl,
      );

      // 4. YouTube
      await this.youtubeService.publishPhaseAnnouncement(
        bracket.id,
        payload.round,
        cloudinaryUrl,
      );

      this.logger.log(
        `Phase announcement published: ${bracket.tematica} — Round ${payload.round}`,
      );
    } catch (error) {
      this.logger.error('Error handling phase started event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BRACKET / VOTACIÓN - CAMPEÓN
  // ──────────────────────────────────────────────────────────────────────────

  @OnEvent('bracket.champion.declared')
  async handleBracketChampionDeclared(payload: {
    bracketId: string;
    winnerId: string;
  }) {
    this.logger.log(`Handling champion declared event: ${payload.bracketId}`);

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: { juego: true },
      });

      const winner = await this.prisma.itemCalificable.findUnique({
        where: { id: payload.winnerId },
      });

      if (!bracket || !winner) return;

      const text = `👑 ¡TENEMOS CAMPEÓN! 👑\n\nTorneo: ${bracket.tematica}\nGanador: ${winner.nombre}\n\nGracias por participar. ¡Pronto nuevos torneos!\n\najdrew.site #EliteRankings`;

      // Simplemente usamos el anuncio de fase final (round 999 simboliza fin)
      const imageUrl = winner.image || '';

      await this.discordService.publishPhaseAnnouncement(
        bracket.id,
        999,
        imageUrl,
      );
      await this.metaService.publishMatchResult(
        bracket.id,
        999,
        imageUrl,
        winner.nombre,
      );

      this.logger.log(`Champion announcement published: ${winner.nombre}`);
    } catch (error) {
      this.logger.error('Error handling champion event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HELPERS - TEXTOS
  // ──────────────────────────────────────────────────────────────────────────

  private buildTutorialText(tutorial: any): string {
    const gameEmoji = tutorial.juego?.nombre?.includes('FC') ? '⚽' : '🎮';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/tutoriales/${tutorial.slug}`;

    return (
      `${gameEmoji} ¡NUEVO TUTORIAL! ${tutorial.titulo}\n\n` +
      `📚 ${tutorial.descripcion?.slice(0, 100) || 'Aprende con esta guía completa'}\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Tutorial #${tutorial.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private buildSorteoCreatedText(sorteo: any): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/sorteos/${sorteo.id}`;
    const diasRestantes = Math.ceil(
      (sorteo.fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    return (
      `🎁 ¡NUEVO SORTEO! ${sorteo.titulo}\n\n` +
      `🏆 Premio: ${sorteo.premio}\n` +
      `⏰ Faltan ${diasRestantes} días\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Sorteo #Giveaway #${sorteo.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private buildSorteoWinnersText(sorteo: any, winnerNames: string[]): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/sorteos/${sorteo.id}`;

    return (
      `🏆 ¡GANADORES DEL SORTEO! ${sorteo.titulo}\n\n` +
      `✨ Ganadores: ${winnerNames.join(', ')}\n` +
      `🎉 ¡Felicidades a todos!\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Sorteo #Ganadores #${sorteo.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private buildRankingText(categoria: any, topItems: any[]): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/calificaciones/${categoria.id}`;

    const top3 = topItems
      .map(
        (item, i) =>
          `#${i + 1} ${item.itemName} (${item.averageRating.toFixed(1)}★)`,
      )
      .join('\n');

    return (
      `📊 ¡RANKING ACTUALIZADO! ${categoria.nombre}\n\n` +
      `🏆 TOP 3:\n${top3}\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Ranking #Top #${categoria.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private async saveBracketImage(
    imageBuffer: Buffer,
    bracketId: string,
  ): Promise<string> {
    // Obsoleto: Usar CloudinaryProvider directamente en los handlers
    return '';
  }

  private buildTablaCreatedText(tabla: any): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/calificaciones/${tabla.slug || tabla.id}`;

    const itemCount = tabla.items?.length || 0;

    return (
      `📊 ¡NUEVA TABLA DE CALIFICACIÓN! ${tabla.nombre}\n\n` +
      `🎮 ${itemCount} participantes listos para ser calificados\n` +
      `⭐ ¡Entra y vota por tus favoritos!\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Ranking #Calificacion #${tabla.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private buildBracketCreatedText(bracket: any): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/votaciones/${bracket.slug}`;

    const matchCount = bracket.matches?.length || 0;
    const totalParticipants = matchCount * 2;

    return (
      `🏆 ¡NUEVO TORNEO! ${bracket.tematica}\n\n` +
      `⚔️ ${totalParticipants} participantes en un bracket épico\n` +
      `🎮 ${bracket.juego?.nombre || 'Gaming'}\n\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #Bracket #Votacion #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }

  private buildPhaseAnnouncementText(bracket: any, round: number): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${frontendUrl}/votaciones/${bracket.slug}`;

    return (
      `⚔️ ¡NUEVA RONDA! ${bracket.tematica}\n\n` +
      `🔥 La Ronda ${round} ya está disponible.\n\n` +
      `🗳️ ¡Entra y vota por tus favoritos!\n` +
      `👉 ${url}\n\n` +
      `@AJDREWGameplays #EliteRankings #Bracket #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`
    );
  }
}
