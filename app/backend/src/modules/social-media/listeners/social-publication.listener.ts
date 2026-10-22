import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  generarImagenSorteo,
  SorteoImageData,
} from '../generators/sorteo-image.generator';
import { RankingImageGenerator } from '../../../calificaciones/application/ranking-image-generator';
import { VsImageGenerator } from '../generators/vs-image.generator';
import { CloudinaryProvider } from '../../../media/cloudinary.provider';
import { SocialTextBuilder } from '../../../content-studio/text-builder.service';
import { MetaService } from '../services/meta.service';
import { YoutubeService } from '../services/youtube.service';
import { DiscordService } from '../services/discord.service';

@Injectable()
export class SocialPublicationListener {
  private readonly logger = new Logger(SocialPublicationListener.name);

  constructor(
    private prisma: PrismaService,
    private rankingImageGenerator: RankingImageGenerator,
    private vsImageGenerator: VsImageGenerator,
    private cloudinary: CloudinaryProvider,
    private textBuilder: SocialTextBuilder,
    private metaService: MetaService,
    private youtubeService: YoutubeService,
    private discordService: DiscordService,
  ) {}

  private readonly PLATAFORMAS = ['discord', 'x', 'meta', 'youtube'] as const;

  private async uploadToCloudinary(buffer: Buffer, folder: string): Promise<string | null> {
    try {
      const pseudoFile = { buffer };
      return await this.cloudinary.uploadImage(pseudoFile, folder);
    } catch (error) {
      this.logger.error(`Error subiendo a Cloudinary: ${error.message}`);
      return null;
    }
  }

  private async createPublications(
    evento: string,
    referenciaTipo: string,
    referenciaId: string,
    data: any,
    imageUrl: string | null | undefined,
    imageBuffer: Buffer | undefined,
    customTexts?: Record<string, string>,
  ) {
    const results: any[] = [];

    for (const plataforma of this.PLATAFORMAS) {
      if (plataforma === 'youtube' && !imageUrl) continue;

      let textoFinal = customTexts?.[plataforma];
      if (!textoFinal) {
        try {
          textoFinal = await this.textBuilder.build(evento.replace('.', '_'), plataforma, data);
        } catch {
          textoFinal = '';
        }
      }

      if (!textoFinal) continue;

      const pub = await this.prisma.socialPublication.create({
        data: {
          evento,
          referenciaTipo,
          referenciaId,
          plataforma,
          estado: 'GENERADO',
          textoFinal,
          imageUrl,
          metadata: {
            source: 'auto-generated',
            juegoId: data?.juegoId,
            juegoNombre: data?.juego?.nombre,
            hasImageBuffer: !!imageBuffer,
          },
        },
      });

      if (imageBuffer && !imageUrl && (plataforma === 'meta' || plataforma === 'youtube')) {
        const uploadedUrl = await this.uploadToCloudinary(imageBuffer, `${referenciaTipo}/${referenciaId}`);
        if (uploadedUrl) {
          await this.prisma.socialPublication.update({
            where: { id: pub.id },
            data: { imageUrl: uploadedUrl },
          });
        }
      }

      results.push(pub);
    }

    return results;
  }

  @OnEvent('social.tutorial.published')
  async handleTutorialPublished(payload: { tutorialId: string }) {
    this.logger.log(`Generando contenido social para tutorial: ${payload.tutorialId}`);

    try {
      const tutorial = await this.prisma.tutorial.findUnique({
        where: { id: payload.tutorialId },
        include: { juego: true },
      });

      if (!tutorial || !tutorial.activo) return;

      const imageUrl = tutorial.image || tutorial.juego?.image;
      const textoDefault = `📚 ¡NUEVO TUTORIAL! ${tutorial.titulo}\n\n${tutorial.descripcion || ''}\n\nAprende más en: ${process.env.FRONTEND_URL || 'https://ajdrew.site'}/tutoriales/${tutorial.slug}\n\n#AJDREW #Tutorial #${tutorial.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;

      if (imageUrl) {
        try {
          await this.metaService.publishTutorial(tutorial, textoDefault, imageUrl);
          await this.youtubeService.publishVideoFromImage(
            imageUrl,
            `Tutorial: ${tutorial.titulo}`,
            tutorial.descripcion || 'Tutorial oficial de AJDREW',
            ['Tutorial', 'AJDREW', tutorial.juego?.nombre || 'Gaming'],
            { tutorialId: tutorial.id },
          );
          await this.discordService.publishTutorial(tutorial, textoDefault, imageUrl);
        } catch (e) {
          this.logger.error(`Error publicando tutorial en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'tutorial.published',
        'tutorial',
        tutorial.id,
        tutorial,
        imageUrl,
        undefined,
      );

      this.logger.log(`Contenido generado para tutorial: ${tutorial.titulo}`);
    } catch (error) {
      this.logger.error('Error generando contenido para tutorial', error);
    }
  }

  @OnEvent('social.sorteo.created')
  async handleSorteoCreated(payload: { sorteoId: string }) {
    this.logger.log(`Generando contenido social para sorteo: ${payload.sorteoId}`);

    try {
      const sorteo = await this.prisma.sorteo.findUnique({
        where: { id: payload.sorteoId },
        include: { juego: true },
      });

      if (!sorteo || sorteo.estado !== 'ACTIVO') return;

      const imageData: SorteoImageData = {
        titulo: sorteo.titulo,
        premio: sorteo.premio,
        fechaFin: sorteo.fechaFin,
        imagenUrl: sorteo.image || undefined,
        juegoNombre: sorteo.juego?.nombre,
      };

      const imageBuffer = await generarImagenSorteo(imageData);
      const cloudinaryUrl = await this.uploadToCloudinary(imageBuffer, `sorteos/${sorteo.id}`);
      const finalImageUrl = cloudinaryUrl || sorteo.image;

      const textoDefault = `🎁 ¡NUEVO SORTEO! ${sorteo.titulo}\n\nPremio: ${sorteo.premio}\n\nParticipa en: ${process.env.FRONTEND_URL || 'https://ajdrew.site'}/sorteos\n\n#AJDREW #Sorteo #${sorteo.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;

      if (finalImageUrl) {
        try {
          await this.metaService.publishSorteoCreated(sorteo, textoDefault, finalImageUrl);
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `Sorteo: ${sorteo.titulo} - Gana ${sorteo.premio}`,
            `Participa en el sorteo de AJDREW. Premio: ${sorteo.premio}`,
            ['Sorteo', 'AJDREW', sorteo.juego?.nombre || 'Gaming'],
            { sorteoId: sorteo.id },
          );
          await this.discordService.publishSorteoCreated(sorteo, textoDefault, imageBuffer);
        } catch (e) {
          this.logger.error(`Error publicando sorteo en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'sorteo.created',
        'sorteo',
        sorteo.id,
        sorteo,
        finalImageUrl,
        imageBuffer,
      );

      this.logger.log(`Contenido generado para sorteo: ${sorteo.titulo}`);
    } catch (error) {
      this.logger.error('Error generando contenido para sorteo', error);
    }
  }

  @OnEvent('social.sorteo.winners')
  async handleSorteoWinners(payload: { sorteoId: string; winnerIds: string[] }) {
    this.logger.log(`Generando contenido social para ganadores de sorteo: ${payload.sorteoId}`);

    try {
      const sorteo = await this.prisma.sorteo.findUnique({
        where: { id: payload.sorteoId },
        include: {
          juego: true,
          ganadores: { include: { usuario: true } },
        },
      });

      if (!sorteo) return;

      const imageData: SorteoImageData = {
        titulo: sorteo.titulo,
        premio: sorteo.premio,
        fechaFin: sorteo.fechaFin,
        imagenUrl: sorteo.image || undefined,
        juegoNombre: sorteo.juego?.nombre,
      };

      const imageBuffer = await generarImagenSorteo(imageData);
      const cloudinaryUrl = await this.uploadToCloudinary(imageBuffer, `sorteos/${sorteo.id}/winners`);
      const finalImageUrl = cloudinaryUrl || sorteo.image;

      const winnerNames = sorteo.ganadores
        .map((g) => g.usuario?.nombre || g.nombreManual || g.usuario?.email || g.emailManual || 'Participante')
        .slice(0, 3);

      const dataWithWinners = { ...sorteo, ganadores: winnerNames.join(', ') };
      const textoDefault = `🏆 ¡GANADORES DEL SORTEO! ${sorteo.titulo}\n\nFelicidades a los ganadores: ${winnerNames.join(', ')}\n\n#AJDREW #SorteoGanadores`;

      if (finalImageUrl) {
        try {
          await this.metaService.publishSorteoWinners(sorteo, textoDefault, finalImageUrl, winnerNames);
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `Ganadores Sorteo: ${sorteo.titulo}`,
            `Resultados y ganadores del sorteo ${sorteo.titulo}`,
            ['Sorteo', 'Ganadores', 'AJDREW'],
            { sorteoId: sorteo.id },
          );
          await this.discordService.publishSorteoWinners(sorteo, textoDefault, imageBuffer, winnerNames);
        } catch (e) {
          this.logger.error(`Error publicando ganadores en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'sorteo.winners',
        'sorteo',
        sorteo.id,
        dataWithWinners,
        finalImageUrl,
        imageBuffer,
      );

      this.logger.log(`Contenido generado para ganadores: ${sorteo.titulo}`);
    } catch (error) {
      this.logger.error('Error generando contenido para ganadores', error);
    }
  }

  @OnEvent('social.ranking.updated')
  async handleRankingUpdated(payload: { tablaId: string }) {
    this.logger.log(`Generando contenido social para ranking: ${payload.tablaId}`);

    try {
      const tabla = await this.prisma.tablaCalificacion.findUnique({
        where: { id: payload.tablaId },
        include: { juego: true, categoria: true },
      });

      if (!tabla) return;

      const itemsInTabla = await this.prisma.tablaItem.findMany({
        where: { tablaId: tabla.id },
        select: { itemId: true },
      });
      const itemIds = itemsInTabla.map((i) => i.itemId);
      if (itemIds.length === 0) return;

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

      const cloudinaryUrl = await this.uploadToCloudinary(imageBuffer, `rankings/${tabla.id}`);
      const finalImageUrl = cloudinaryUrl || tabla.image;

      const dataWithTop = { ...tabla, topItems };
      const textoDefault = `📊 ¡RANKING ACTUALIZADO! ${tabla.nombre}\n\nConsulta los mejores valorados en AJDREW: ${process.env.FRONTEND_URL || 'https://ajdrew.site'}/calificaciones/${tabla.id}\n\n#AJDREW #Ranking #${tabla.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;

      if (finalImageUrl) {
        try {
          await this.metaService.publishRanking(tabla, textoDefault, finalImageUrl);
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `Ranking Actualizado: ${tabla.nombre}`,
            `Top valoraciones y calificaciones en ${tabla.nombre}`,
            ['Ranking', 'Calificaciones', 'AJDREW', tabla.juego?.nombre || 'Gaming'],
            { tablaId: tabla.id },
          );
          await this.discordService.publishRanking(tabla, textoDefault, finalImageUrl);
        } catch (e) {
          this.logger.error(`Error publicando ranking en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'ranking.updated',
        'ranking',
        tabla.id,
        dataWithTop,
        finalImageUrl,
        imageBuffer,
      );

      this.logger.log(`Contenido generado para ranking: ${tabla.nombre}`);
    } catch (error) {
      this.logger.error('Error generando contenido para ranking', error);
    }
  }

  @OnEvent('social.tabla.created')
  async handleTablaCreated(payload: { tablaId: string }) {
    this.logger.log(`Generando contenido social para nueva tabla: ${payload.tablaId}`);

    try {
      const tabla = await this.prisma.tablaCalificacion.findUnique({
        where: { id: payload.tablaId },
        include: { juego: true, items: { include: { item: true }, take: 5 } },
      });

      if (!tabla) return;

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

      const imageBuffer = await this.rankingImageGenerator.generateRankingImage(
        tabla.nombre,
        topItems,
      );

      const cloudinaryUrl = await this.uploadToCloudinary(imageBuffer, `rankings/${tabla.id}/created`);
      const finalImageUrl = cloudinaryUrl || tabla.image;

      if (finalImageUrl) {
        await this.prisma.tablaCalificacion.update({
          where: { id: tabla.id },
          data: { image: finalImageUrl },
        });
      }

      const textoDefault = `⭐ ¡NUEVA TABLA DE CALIFICACIÓN! ${tabla.nombre}\n\nComienza a calificar y puntuar tus elementos favoritos en: ${process.env.FRONTEND_URL || 'https://ajdrew.site'}/calificaciones/${tabla.id}\n\n#AJDREW #Calificaciones`;

      if (finalImageUrl) {
        try {
          await this.metaService.publishRanking(tabla, textoDefault, finalImageUrl);
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `Nueva Tabla de Calificación: ${tabla.nombre}`,
            `Nueva tabla de calificaciones creada en AJDREW`,
            ['Calificaciones', 'AJDREW', tabla.juego?.nombre || 'Gaming'],
            { tablaId: tabla.id },
          );
          await this.discordService.publishRanking(tabla, textoDefault, finalImageUrl);
        } catch (e) {
          this.logger.error(`Error publicando nueva tabla en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'tabla.created',
        'ranking',
        tabla.id,
        tabla,
        finalImageUrl,
        imageBuffer,
      );

      this.logger.log(`Contenido generado para tabla: ${tabla.nombre}`);
    } catch (error) {
      this.logger.error('Error generando contenido para tabla', error);
    }
  }

  @OnEvent('social.bracket.created')
  async handleBracketCreated(payload: { bracketId: string }) {
    this.logger.log(`Generando contenido social para bracket: ${payload.bracketId}`);

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

      if (!bracket) return;

      const matchedGames = bracket.matches.filter((m) => m.itemA && m.itemB);
      if (matchedGames.length === 0) return;

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
        const mappedMatches = matchedGames.map((m) => ({
          itemA: m.itemA ? { name: m.itemA.nombre, image: m.itemA.image || undefined } : null,
          itemB: m.itemB ? { name: m.itemB.nombre, image: m.itemB.image || undefined } : null,
        }));
        finalBuffer = await this.vsImageGenerator.generateRoundListImage(
          bracket.tematica,
          1,
          mappedMatches,
        );
      }

      const cloudinaryUrl = await this.uploadToCloudinary(finalBuffer, `brackets/${bracket.id}/created`);
      const finalImageUrl = cloudinaryUrl || bracket.imageUrl;

      if (finalImageUrl) {
        await this.prisma.votacionBracket.update({
          where: { id: bracket.id },
          data: { imageUrl: finalImageUrl },
        });
      }

      const textoDefault = `🗳️ ¡NUEVO TORNEO / VOTACIÓN! ${bracket.tematica}\n\nEntra a votar por tus favoritos en: ${process.env.FRONTEND_URL || 'https://ajdrew.site'}/votaciones/${bracket.slug}\n\n#AJDREW #Votaciones #${bracket.juego?.nombre?.replace(/\s+/g, '') || 'Gaming'}`;

      if (finalImageUrl) {
        try {
          await this.metaService.publishBracketCreated(bracket, textoDefault, finalImageUrl);
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `Torneo: ${bracket.tematica}`,
            `Nuevo torneo de votación creado en AJDREW`,
            ['Torneo', 'Votaciones', 'AJDREW', bracket.juego?.nombre || 'Gaming'],
            { bracketId: bracket.id, round: 1 },
          );
          await this.discordService.publishPhaseAnnouncement(bracket.id, 1, finalImageUrl);
        } catch (e) {
          this.logger.error(`Error publicando bracket en redes externas: ${e.message}`);
        }
      }

      await this.createPublications(
        'bracket.created',
        'bracket',
        bracket.id,
        bracket,
        finalImageUrl,
        finalBuffer,
      );

      this.logger.log(`Contenido generado para bracket: ${bracket.tematica}`);
    } catch (error) {
      this.logger.error('Error generando contenido para bracket', error);
    }
  }

  @OnEvent('bracket.phase.started')
  async handleBracketPhaseStarted(payload: { bracketId: string; round: number }) {
    this.logger.log(`Generando contenido social para fase: ${payload.bracketId} (Ronda ${payload.round})`);

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

      const matchesToUse = bracket.matches.filter((m) => m.itemA && m.itemB);
      if (matchesToUse.length === 0) return;

      const mappedMatches = matchesToUse.map((m) => ({
        itemA: { name: m.itemA!.nombre, image: m.itemA!.image || undefined },
        itemB: { name: m.itemB!.nombre, image: m.itemB!.image || undefined },
      }));

      const finalBuffer = await this.vsImageGenerator.generateRoundListImage(
        bracket.tematica,
        payload.round,
        mappedMatches,
      );

      const cloudinaryUrl = await this.uploadToCloudinary(finalBuffer, `brackets/${bracket.id}/round-${payload.round}`);
      const finalImageUrl = cloudinaryUrl || bracket.imageUrl;

      if (finalImageUrl) {
        try {
          await this.youtubeService.publishVideoFromImage(
            finalImageUrl,
            `${bracket.tematica} - Ronda ${payload.round}`,
            `La Ronda ${payload.round} ha comenzado en ${bracket.tematica}. ¡Entra a votar!`,
            ['Votaciones', 'AJDREW', bracket.juego?.nombre || 'Gaming'],
            { bracketId: bracket.id, round: payload.round },
          );
        } catch (e) {
          this.logger.error(`Error publicando fase en YouTube: ${e.message}`);
        }
      }

      await this.createPublications(
        'bracket.phase',
        'bracket',
        bracket.id,
        { ...bracket, ronda: payload.round },
        finalImageUrl,
        finalBuffer,
      );

      this.logger.log(`Contenido generado para fase: ${bracket.tematica} - Ronda ${payload.round}`);
    } catch (error) {
      this.logger.error('Error generando contenido para fase', error);
    }
  }

  @OnEvent('bracket.champion.declared')
  async handleBracketChampionDeclared(payload: { bracketId: string; winnerId: string }) {
    this.logger.log(`Generando contenido social para campeón: ${payload.bracketId}`);

    try {
      const bracket = await this.prisma.votacionBracket.findUnique({
        where: { id: payload.bracketId },
        include: { juego: true },
      });

      const winner = await this.prisma.itemCalificable.findUnique({
        where: { id: payload.winnerId },
      });

      if (!bracket || !winner) return;

      const imageUrl = winner.image || undefined;

      const dataForTemplate = {
        ...bracket,
        premioItem: winner.nombre,
        ganadorImage: winner.image,
      };

      try {
        if (imageUrl) {
          await this.youtubeService.publishVideoFromImage(
            imageUrl,
            `¡CAMPEÓN! ${winner.nombre} en ${bracket.tematica}`,
            `El gran ganador de ${bracket.tematica} es ${winner.nombre}.`,
            ['Campeón', 'Votaciones', 'AJDREW'],
            { bracketId: bracket.id },
          );
        }
      } catch (e) {
        this.logger.error(`Error publicando campeón en YouTube: ${e.message}`);
      }

      await this.createPublications(
        'bracket.champion',
        'bracket',
        bracket.id,
        dataForTemplate,
        imageUrl,
        undefined,
      );

      this.logger.log(`Contenido generado para campeón: ${winner.nombre}`);
    } catch (error) {
      this.logger.error('Error generando contenido para campeón', error);
    }
  }
}
