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
import { SocialTextBuilder } from '../../../content-studio/text-builder.service';
import { SocialQueueProducer } from '../../../social-queue/social-queue.producer';

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
    private textBuilder: SocialTextBuilder,
    private socialQueue: SocialQueueProducer,
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

      // Texto para redes sociales (lee template de DB, fallback a default)
      const text = await this.textBuilder.build('tutorial_published', 'discord', tutorial);
      const textX = await this.textBuilder.build('tutorial_published', 'x', tutorial);
      const textMeta = await this.textBuilder.build('tutorial_published', 'meta', tutorial);

      // Crear registros en SocialPublication y encolar para retry automatico
      const pubDiscord = await this.createSocialPublication({
        evento: 'tutorial.published',
        referenciaTipo: 'tutorial',
        referenciaId: tutorial.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: imageUrl,
      });
      const pubX = await this.createSocialPublication({
        evento: 'tutorial.published',
        referenciaTipo: 'tutorial',
        referenciaId: tutorial.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: imageUrl,
      });
      const pubMeta = await this.createSocialPublication({
        evento: 'tutorial.published',
        referenciaTipo: 'tutorial',
        referenciaId: tutorial.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: imageUrl,
      });

      // Encolar (no publicar directo)
      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: { evento: 'tutorial', data: tutorial, text, imageUrl: imageUrl || '' },
      });
      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: { evento: 'tutorial', data: tutorial, text: textX, imageUrl: imageUrl || '' },
      });
      await this.socialQueue.enqueue({
        publicationId: pubMeta.id,
        plataforma: 'meta',
        payload: { evento: 'tutorial', data: tutorial, text: textMeta, imageUrl: imageUrl || '' },
      });

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

      // Subir imagen a Cloudinary para Meta y YouTube
      const pseudoFile = { buffer: imageBuffer };
      const folder = `sorteos/${sorteo.id}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      // Textos por plataforma desde DB o fallback
      const text = await this.textBuilder.build('sorteo_created', 'discord', sorteo);
      const textX = await this.textBuilder.build('sorteo_created', 'x', sorteo);
      const textMeta = await this.textBuilder.build('sorteo_created', 'meta', sorteo);

      // Registrar publicaciones en SocialPublication
      const pubDiscord = await this.createSocialPublication({
        evento: 'sorteo.created',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'sorteo.created',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'sorteo.created',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      // Encolar en BullMQ con reintentos
      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'sorteo_created',
          data: sorteo,
          text,
          imageBuffer,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: {
          evento: 'sorteo_created',
          data: sorteo,
          text: textX,
          imageBuffer,
        },
      });

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'sorteo_created',
            data: sorteo,
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });

        const pubYoutube = await this.createSocialPublication({
          evento: 'sorteo.created',
          referenciaTipo: 'sorteo',
          referenciaId: sorteo.id,
          plataforma: 'youtube',
          textoFinal: `¡NUEVO SORTEO! - ${sorteo.titulo}`,
          imageUrl: cloudinaryUrl,
        });

        await this.socialQueue.enqueue({
          publicationId: pubYoutube.id,
          plataforma: 'youtube',
          payload: {
            evento: 'sorteo_created',
            data: { sorteoId: sorteo.id },
            imageUrl: cloudinaryUrl,
            title: `¡NUEVO SORTEO! - ${sorteo.titulo}`,
            description: `Participa en el sorteo de ${sorteo.premio} en Elite Rankings.`,
            tags: ['Sorteo', 'Giveaway', sorteo.juego?.nombre || 'Gaming'],
          },
        });
      }

      this.logger.log(`Sorteo encolado en redes sociales: ${sorteo.titulo}`);
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

      const imageData: SorteoImageData = {
        titulo: sorteo.titulo,
        premio: sorteo.premio,
        fechaFin: sorteo.fechaFin,
        imagenUrl: sorteo.image || undefined,
        juegoNombre: sorteo.juego?.nombre,
      };

      const imageBuffer = await generarImagenSorteo(imageData);

      // Subir imagen a Cloudinary
      const pseudoFile = { buffer: imageBuffer };
      const folder = `sorteos/${sorteo.id}/winners`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

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

      const dataWithWinners = { ...sorteo, ganadores: winnerNames.join(', ') };
      const text = await this.textBuilder.build('sorteo_winners', 'discord', dataWithWinners);
      const textX = await this.textBuilder.build('sorteo_winners', 'x', dataWithWinners);
      const textMeta = await this.textBuilder.build('sorteo_winners', 'meta', dataWithWinners);

      const pubDiscord = await this.createSocialPublication({
        evento: 'sorteo.winners',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'sorteo.winners',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'sorteo.winners',
        referenciaTipo: 'sorteo',
        referenciaId: sorteo.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'sorteo_winners',
          data: { ...sorteo, ganadores: winnerNames },
          text,
          imageBuffer,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: {
          evento: 'sorteo_winners',
          data: { ...sorteo, ganadores: winnerNames },
          text: textX,
          imageBuffer,
        },
      });

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'sorteo_winners',
            data: { ...sorteo, ganadores: winnerNames },
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });
      }

      this.logger.log(`Sorteo winners encolado en redes sociales: ${sorteo.titulo}`);
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

      // Texto para redes sociales (lee template de DB, fallback a default)
      const dataWithTop = { ...tabla, topItems };
      const text = await this.textBuilder.build('ranking_updated', 'discord', dataWithTop);
      const textX = await this.textBuilder.build('ranking_updated', 'x', dataWithTop);
      const textMeta = await this.textBuilder.build('ranking_updated', 'meta', dataWithTop);

      // Subir imagen a Cloudinary
      const pseudoFile = { buffer: imageBuffer };
      const folder = `rankings/${tabla.id}`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      const pubDiscord = await this.createSocialPublication({
        evento: 'ranking.updated',
        referenciaTipo: 'ranking',
        referenciaId: tabla.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'ranking.updated',
        referenciaTipo: 'ranking',
        referenciaId: tabla.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'ranking.updated',
        referenciaTipo: 'ranking',
        referenciaId: tabla.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'ranking',
          data: tabla,
          text,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: {
          evento: 'ranking',
          data: tabla,
          text: textX,
          imageBuffer,
        },
      });

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'ranking',
            data: tabla,
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });

        const pubYoutube = await this.createSocialPublication({
          evento: 'ranking.updated',
          referenciaTipo: 'ranking',
          referenciaId: tabla.id,
          plataforma: 'youtube',
          textoFinal: `Ranking Actualizado: ${tabla.nombre}`,
          imageUrl: cloudinaryUrl,
        });

        await this.socialQueue.enqueue({
          publicationId: pubYoutube.id,
          plataforma: 'youtube',
          payload: {
            evento: 'ranking',
            data: tabla,
            imageUrl: cloudinaryUrl,
            title: `Ranking Actualizado: ${tabla.nombre}`,
            description: `Consulta el Top 5 de ${tabla.nombre} en nuestra web.`,
            tags: ['Ranking', 'Top5', tabla.juego?.nombre || 'Gaming'],
          },
        });
      }

      this.logger.log(`Ranking encolado en redes sociales: ${tabla.nombre}`);
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

      // Texto para redes sociales (lee template de DB, fallback a default)
      const text = await this.textBuilder.build('tabla_created', 'discord', tabla);
      const textX = await this.textBuilder.build('tabla_created', 'x', tabla);
      const textMeta = await this.textBuilder.build('tabla_created', 'meta', tabla);

      // Subir imagen de creación a Cloudinary
      const pseudoFile = { buffer: imageBuffer };
      const folder = `rankings/${tabla.id}/created`;
      const cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);

      const pubDiscord = await this.createSocialPublication({
        evento: 'tabla.created',
        referenciaTipo: 'tabla',
        referenciaId: tabla.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'tabla.created',
        referenciaTipo: 'tabla',
        referenciaId: tabla.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'tabla.created',
        referenciaTipo: 'tabla',
        referenciaId: tabla.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'tabla',
          data: tabla,
          text,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: {
          evento: 'tabla',
          data: tabla,
          text: textX,
          imageBuffer,
        },
      });

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'tabla',
            data: tabla,
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });
      }

      this.logger.log(`Tabla created encolada en redes sociales: ${tabla.nombre}`);
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

      const text = await this.textBuilder.build('bracket_created', 'discord', bracket);
      const textX = await this.textBuilder.build('bracket_created', 'x', bracket);
      const textMeta = await this.textBuilder.build('bracket_created', 'meta', bracket);

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

      if (cloudinaryUrl) {
        await this.prisma.votacionBracket.update({
          where: { id: bracket.id },
          data: { imageUrl: JSON.stringify([cloudinaryUrl]) },
        });
      }

      const pubDiscord = await this.createSocialPublication({
        evento: 'bracket.created',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'bracket.created',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'bracket.created',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'bracket_created',
          data: bracket,
          text,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      await this.socialQueue.enqueue({
        publicationId: pubX.id,
        plataforma: 'x',
        payload: {
          evento: 'bracket_created',
          data: bracket,
          text: textX,
          imageBuffer: finalBuffer,
        },
      });

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'bracket_created',
            data: bracket,
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });
      }

      this.logger.log(`Bracket created encolado en redes: ${bracket.tematica}`);
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
    matches?: any[];
  }) {
    this.logger.log(
      `Handling bracket phase started event: ${payload.bracketId} (Round ${payload.round})`,
    );

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: {
          juego: true,
          matches: {
            where: { ronda: payload.round },
            include: { itemA: true, itemB: true },
          },
        },
      });

      if (!bracket) return;

      const text = await this.textBuilder.build('bracket_phase', 'discord', { ...bracket, ronda: payload.round });
      const textX = await this.textBuilder.build('bracket_phase', 'x', { ...bracket, ronda: payload.round });
      const textMeta = await this.textBuilder.build('bracket_phase', 'meta', { ...bracket, ronda: payload.round });

      const matchesToUse = payload.matches || bracket.matches;
      const mappedMatches = matchesToUse
        .filter((m: any) => m.itemA && m.itemB)
        .map((m: any) => ({
          itemA: { name: m.itemA.nombre, image: m.itemA.image || undefined },
          itemB: { name: m.itemB.nombre, image: m.itemB.image || undefined },
        }));

      let finalBuffer: Buffer | null = null;
      if (mappedMatches.length > 0) {
        finalBuffer = await this.vsImageGenerator.generateRoundListImage(
          bracket.tematica,
          payload.round,
          mappedMatches,
        );
      }

      let cloudinaryUrl: string | null = null;
      if (finalBuffer) {
        const pseudoFile = { buffer: finalBuffer };
        const folder = `brackets/${bracket.id}/round-${payload.round}`;
        cloudinaryUrl = await this.cloudinary.uploadImage(pseudoFile, folder);
      }

      const pubDiscord = await this.createSocialPublication({
        evento: 'bracket.phase',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubX = await this.createSocialPublication({
        evento: 'bracket.phase',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'x',
        textoFinal: textX,
        imageUrl: cloudinaryUrl || undefined,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'bracket.phase',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl: cloudinaryUrl || undefined,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'bracket_phase',
          data: { bracketId: bracket.id, round: payload.round, tematica: bracket.tematica },
          text,
          imageUrl: cloudinaryUrl || undefined,
        },
      });

      if (finalBuffer) {
        await this.socialQueue.enqueue({
          publicationId: pubX.id,
          plataforma: 'x',
          payload: {
            evento: 'bracket_phase',
            data: { bracketId: bracket.id, round: payload.round, tematica: bracket.tematica },
            text: textX,
            imageBuffer: finalBuffer,
          },
        });
      }

      if (cloudinaryUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'bracket_phase',
            data: { bracketId: bracket.id, round: payload.round, tematica: bracket.tematica },
            text: textMeta,
            imageUrl: cloudinaryUrl,
          },
        });

        const pubYoutube = await this.createSocialPublication({
          evento: 'bracket.phase',
          referenciaTipo: 'bracket',
          referenciaId: bracket.id,
          plataforma: 'youtube',
          textoFinal: `Fase Iniciada: ${bracket.tematica} - Ronda ${payload.round}`,
          imageUrl: cloudinaryUrl,
        });

        await this.socialQueue.enqueue({
          publicationId: pubYoutube.id,
          plataforma: 'youtube',
          payload: {
            evento: 'bracket_phase',
            data: { bracketId: bracket.id, round: payload.round },
            imageUrl: cloudinaryUrl,
            title: `Ronda ${payload.round} - ${bracket.tematica}`,
            description: `Vota por tus favoritos en AJDREW.`,
            tags: ['Torneo', 'Votaciones', bracket.juego?.nombre || 'Gaming'],
          },
        });
      }

      this.logger.log(`Phase announcement encolado: ${bracket.tematica} — Round ${payload.round}`);
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

      const dataForTemplate = {
        ...bracket,
        premioItem: winner.nombre,
        ganadorImage: winner.image,
      };
      const text = await this.textBuilder.build('bracket_champion', 'discord', dataForTemplate);
      const textX = await this.textBuilder.build('bracket_champion', 'x', dataForTemplate);
      const textMeta = await this.textBuilder.build('bracket_champion', 'meta', dataForTemplate);

      const imageUrl = winner.image || undefined;

      const pubDiscord = await this.createSocialPublication({
        evento: 'bracket.champion',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'discord',
        textoFinal: text,
        imageUrl,
      });

      const pubMeta = await this.createSocialPublication({
        evento: 'bracket.champion',
        referenciaTipo: 'bracket',
        referenciaId: bracket.id,
        plataforma: 'meta',
        textoFinal: textMeta,
        imageUrl,
      });

      await this.socialQueue.enqueue({
        publicationId: pubDiscord.id,
        plataforma: 'discord',
        payload: {
          evento: 'bracket_champion',
          data: { bracketId: bracket.id, ganadorNombre: winner.nombre },
          text,
          imageUrl,
        },
      });

      if (imageUrl) {
        await this.socialQueue.enqueue({
          publicationId: pubMeta.id,
          plataforma: 'meta',
          payload: {
            evento: 'bracket_champion',
            data: { bracketId: bracket.id, ganadorNombre: winner.nombre },
            text: textMeta,
            imageUrl,
          },
        });
      }

      this.logger.log(`Champion announcement encolado: ${winner.nombre}`);
    } catch (error) {
      this.logger.error('Error handling champion event', error);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Crea un registro SocialPublication para trazabilidad y lo retorna con su ID.
   */
  private async createSocialPublication(params: {
    evento: string;
    referenciaTipo: string;
    referenciaId: string;
    plataforma: 'discord' | 'x' | 'meta' | 'youtube';
    textoFinal: string;
    imageUrl?: string;
    imageBuffer?: Buffer;
    metadata?: any;
  }) {
    return this.prisma.socialPublication.create({
      data: {
        evento: params.evento,
        referenciaTipo: params.referenciaTipo,
        referenciaId: params.referenciaId,
        plataforma: params.plataforma,
        textoFinal: params.textoFinal,
        imageUrl: params.imageUrl,
        estado: 'PENDIENTE',
        metadata: params.metadata,
      },
    });
  }
}
