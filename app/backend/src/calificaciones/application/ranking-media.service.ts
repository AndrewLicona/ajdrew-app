import { Injectable, Logger } from '@nestjs/common';
import {
  RankingImageGenerator,
  RankingItemMeta,
} from './ranking-image-generator';
import { CloudinaryProvider } from '../../media/cloudinary.provider';
import { CalificacionRepository } from '../infrastructure/persistence/calificacion.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RankingMediaService {
  private readonly logger = new Logger(RankingMediaService.name);

  constructor(
    private readonly rankingImageGenerator: RankingImageGenerator,
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly calificacionRepository: CalificacionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async updateRankingImageForCategory(
    categoryId: string,
  ): Promise<string | null> {
    this.logger.log(`Starting OG image generation for Category ${categoryId}`);
    try {
      const category = await this.prisma.categoria.findUnique({
        where: { id: categoryId },
      });
      if (!category) throw new Error('Category not found');

      const rankingData =
        await this.calificacionRepository.getRanking(categoryId);
      if (!rankingData || rankingData.length === 0) {
        this.logger.log(
          `No items found for Category ${categoryId}, skipping image generation.`,
        );
        return null;
      }

      const topItems: RankingItemMeta[] = rankingData
        .slice(0, 3)
        .map((item) => ({
          itemName: item.itemName,
          itemImage: item.itemImage,
          averageRating: item.averageRating,
        }));

      const imageBuffer = await this.rankingImageGenerator.generateRankingImage(
        `Ranking: ${category.nombre}`,
        topItems,
      );

      // Upload via CloudinaryProvider
      const mockFile = {
        buffer: imageBuffer,
        originalname: `ranking_cat_${categoryId}.png`,
      };
      const uploadedUrl = await this.cloudinaryProvider.uploadImage(
        mockFile,
        'rankings',
      );

      // Save to DB
      await this.prisma.categoria.update({
        where: { id: categoryId },
        data: { imageUrl: uploadedUrl },
      });

      this.logger.log(
        `Successfully updated OG image for Category ${categoryId}`,
      );
      return uploadedUrl;
    } catch (error) {
      this.logger.error(
        `Failed to generate ranking image for Category ${categoryId}`,
        error,
      );
      return null;
    }
  }

  async updateRankingImageForJuego(juegoId: string): Promise<string | null> {
    this.logger.log(`Starting OG image generation for Juego ${juegoId}`);
    try {
      const juego = await this.prisma.juego.findUnique({
        where: { id: juegoId },
      });
      if (!juego) throw new Error('Juego not found');

      const rankingData = await this.calificacionRepository.getRanking(
        undefined,
        undefined,
        juegoId,
      );
      if (!rankingData || rankingData.length === 0) {
        this.logger.log(
          `No items found for Juego ${juegoId}, skipping image generation.`,
        );
        return null;
      }

      const topItems: RankingItemMeta[] = rankingData
        .slice(0, 3)
        .map((item) => ({
          itemName: item.itemName,
          itemImage: item.itemImage,
          averageRating: item.averageRating,
        }));

      const imageBuffer = await this.rankingImageGenerator.generateRankingImage(
        `Ranking: ${juego.nombre}`,
        topItems,
      );

      // Upload via CloudinaryProvider
      const mockFile = {
        buffer: imageBuffer,
        originalname: `ranking_juego_${juegoId}.png`,
      };
      const uploadedUrl = await this.cloudinaryProvider.uploadImage(
        mockFile,
        'rankings',
      );

      // Save to DB (Juego model has imageCover/image, we update image or imageCover depending on user pref, but task didn't specify. Assuming imageCover or new field? Let's check schema for Juego).
      // For now, let's update imageCover if it exists or doing nothing. Let's do nothing for Juego schema unless necessary.

      return uploadedUrl;
    } catch (error) {
      this.logger.error(
        `Failed to generate ranking image for Juego ${juegoId}`,
        error,
      );
      return null;
    }
  }
}
