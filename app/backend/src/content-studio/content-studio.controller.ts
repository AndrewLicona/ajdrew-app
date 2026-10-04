import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { ContentStudioService } from './content-studio.service';
import { PreviewDto } from './application/dto/preview.dto';
import { PublishDto } from './application/dto/publish.dto';
import { ScheduleDto } from './application/dto/schedule.dto';
import { UpdateTemplateDto } from './application/dto/update-template.dto';

/**
 * Content Studio — endpoints administrativos para gestionar contenido social.
 *
 * Todos los endpoints requieren JWT + rol ADMIN o EDITOR.
 */
@Controller('content-studio')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentStudioController {
  constructor(private readonly studio: ContentStudioService) {}

  // ── Preview ──────────────────────────────────────────────────────────
  /**
   * Genera preview del contenido social SIN publicar.
   *
   * POST /api/content-studio/preview
   * Body: { tipo, referenciaId, plataformas?, textosOverride? }
   * Returns: { [plataforma]: { texto, textoTruncado, imageUrl, charCount, ... } }
   */
  @Post('preview')
  @Roles('ADMIN', 'EDITOR')
  async preview(@Body() dto: PreviewDto) {
    return this.studio.generatePreview(dto);
  }

  // ── Publicar inmediatamente ──────────────────────────────────────────
  /**
   * Publica inmediatamente en las plataformas seleccionadas.
   *
   * POST /api/content-studio/publish
   */
  @Post('publish')
  @Roles('ADMIN', 'EDITOR')
  async publish(@Body() dto: PublishDto) {
    return this.studio.publishNow(dto);
  }

  // ── Programar publicación ────────────────────────────────────────────
  /**
   * Programa una publicación para una fecha futura.
   *
   * POST /api/content-studio/schedule
   */
  @Post('schedule')
  @Roles('ADMIN', 'EDITOR')
  async schedule(@Body() dto: ScheduleDto) {
    return this.studio.schedulePublication(dto);
  }

  // ── Listar publicaciones (para dashboard) ────────────────────────────
  /**
   * Lista publicaciones con filtros opcionales.
   *
   * GET /api/content-studio/publications?estado=FALLIDO&plataforma=x&page=1
   */
  @Get('publications')
  @Roles('ADMIN', 'EDITOR')
  async listPublications(
    @Query('estado') estado?: string,
    @Query('plataforma') plataforma?: string,
    @Query('referenciaTipo') referenciaTipo?: string,
    @Query('referenciaId') referenciaId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.studio.listPublications({
      estado,
      plataforma,
      referenciaTipo,
      referenciaId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  // ── Detalle de una publicación ───────────────────────────────────────
  @Get('publications/:id')
  @Roles('ADMIN', 'EDITOR')
  async getPublication(@Param('id') id: string) {
    return this.studio['prisma'].socialPublication.findUnique({
      where: { id },
    });
  }

  // ── Reintentar publicación fallida ───────────────────────────────────
  @Post('publications/:id/retry')
  @Roles('ADMIN')
  async retry(@Param('id') id: string) {
    return this.studio.retryPublication(id);
  }

  // ── Templates editables ──────────────────────────────────────────────
  @Get('templates')
  @Roles('ADMIN', 'EDITOR')
  async listTemplates() {
    return this.studio.listTemplates();
  }

  @Patch('templates/:id')
  @Roles('ADMIN')
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.studio.updateTemplate(id, dto);
  }

  // ── Seed default templates (solo dev/setup) ──────────────────────────
  @Post('templates/seed')
  @Roles('ADMIN')
  async seedTemplates() {
    return this.studio.seedDefaultTemplates();
  }
}