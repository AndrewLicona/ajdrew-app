import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateRenderer } from './templates/template-renderer.service';
import { PreviewDto, mapTipoToEvento } from './application/dto/preview.dto';
import { PublishDto } from './application/dto/publish.dto';
import { ScheduleDto } from './application/dto/schedule.dto';
import { UpdateTemplateDto } from './application/dto/update-template.dto';
import {
  DEFAULT_TEMPLATES,
  SUPPORTED_PLATFORMS,
} from './templates/default-templates';

export interface PreviewResult {
  [plataforma: string]: {
    texto: string;
    textoTruncado?: string;
    imageUrl?: string;
    charCount: number;
    placeholdersUsados: string[];
    placeholdersFaltantes: string[];
  };
}

@Injectable()
export class ContentStudioService implements OnModuleInit {
  private readonly logger = new Logger(ContentStudioService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private renderer: TemplateRenderer,
  ) {}

  /**
   * Auto-seed: al arrancar el módulo, inserta los templates por defecto
   * que aún no existan en DB. Así el admin puede editarlos desde
   * /admin/content-studio/templates sin tener que llamar manualmente al endpoint.
   */
  async onModuleInit() {
    try {
      const result = await this.seedDefaultTemplates();
      if (result.inserted > 0) {
        this.logger.log(
          `🌱 Content Studio: ${result.inserted} templates por defecto insertados`,
        );
      }
    } catch (error: any) {
      this.logger.warn(
        `No se pudieron insertar templates por defecto: ${error.message}`,
      );
    }
  }

  // ────────────────────────────────────────────────────────────────────
  // PREVIEW — renderiza textos e imágenes SIN publicar
  // ────────────────────────────────────────────────────────────────────
  async generatePreview(dto: PreviewDto): Promise<PreviewResult> {
    const plataformas =
      dto.plataformas && dto.plataformas.length > 0
        ? dto.plataformas
        : [...SUPPORTED_PLATFORMS];

    // 1. Cargar datos del recurso
    const data = await this.loadData(dto.tipo, dto.referenciaId);
    if (!data) {
      throw new NotFoundException(
        `Recurso ${dto.tipo}/${dto.referenciaId} no encontrado`,
      );
    }

    // 2. Resolver URL pública (necesaria para casi todos los templates)
    const evento = mapTipoToEvento(dto.tipo);
    data.url = this.buildPublicUrl(dto.tipo, dto.referenciaId, data);

    // 3. Calcular imageUrl por defecto (del recurso)
    const defaultImageUrl =
      (data as any).image ||
      (data as any).imageUrl ||
      (data as any).juego?.image ||
      undefined;

    // 4. Cargar templates desde DB (o fallback a defaults)
    const templates = await this.loadTemplates(evento);

    // 5. Renderizar por plataforma
    const result: PreviewResult = {};
    for (const plataforma of plataformas) {
      const tmpl =
        dto.textosOverride?.[plataforma] ?? templates[plataforma];

      if (!tmpl) {
        result[plataforma] = {
          texto: '',
          charCount: 0,
          placeholdersUsados: [],
          placeholdersFaltantes: [],
        };
        continue;
      }

      const rendered = this.renderer.render(tmpl, data);
      const placeholdersUsados = this.renderer.extractPlaceholders(tmpl);
      const placeholdersFaltantes = this.detectMissingPlaceholders(
        placeholdersUsados,
        data,
      );

      // Para X (Twitter) generar versión truncada
      const textoTruncado =
        plataforma === 'x'
          ? this.renderer.truncate(rendered, 280)
          : undefined;

      result[plataforma] = {
        texto: rendered,
        textoTruncado,
        imageUrl: defaultImageUrl,
        charCount: rendered.length,
        placeholdersUsados,
        placeholdersFaltantes,
      };
    }

    return result;
  }

  // ────────────────────────────────────────────────────────────────────
  // PUBLISH NOW — crea SocialPublication + emite eventos
  // ────────────────────────────────────────────────────────────────────
  async publishNow(dto: PublishDto) {
    const preview = await this.generatePreview({
      tipo: dto.tipo,
      referenciaId: dto.referenciaId,
      plataformas: dto.plataformas,
      textosOverride: dto.textosOverride,
    });

    const evento = mapTipoToEvento(dto.tipo);
    const data = await this.loadData(dto.tipo, dto.referenciaId);

    // Crear un registro por plataforma (trazabilidad)
    const created: any[] = [];
    for (const plataforma of dto.plataformas) {
      const previewPlataforma = preview[plataforma];
      if (!previewPlataforma || !previewPlataforma.texto) continue;

      const pub = await this.prisma.socialPublication.create({
        data: {
          evento,
          referenciaTipo: dto.tipo,
          referenciaId: dto.referenciaId,
          plataforma,
          estado: 'PENDIENTE',
          textoFinal: previewPlataforma.texto,
          imageUrl: dto.imageOverride || previewPlataforma.imageUrl,
          intentos: 0,
          metadata: {
            source: 'content-studio',
            userTriggered: true,
            juegoId: (data as any)?.juegoId,
            juegoNombre: (data as any)?.juego?.nombre,
          },
        },
      });
      created.push(pub);

      // Emitir evento compatible con los listeners existentes
      // Los listeners sociales ya manejan sus plataformas
      this.emitCompatEvent(evento, plataforma, data, dto.referenciaId);
    }

    return {
      success: true,
      message: `${created.length} publicación(es) encoladas`,
      publications: created,
    };
  }

  // ────────────────────────────────────────────────────────────────────
  // SCHEDULE — crea SocialPublication con estado=PROGRAMADO
  // ────────────────────────────────────────────────────────────────────
  async schedulePublication(dto: ScheduleDto) {
    const preview = await this.generatePreview({
      tipo: dto.tipo,
      referenciaId: dto.referenciaId,
      plataformas: dto.plataformas,
      textosOverride: dto.textosOverride,
    });

    const programadoPara = new Date(dto.programadoPara);
    if (programadoPara <= new Date()) {
      throw new BadRequestException(
        'La fecha programada debe ser futura',
      );
    }

    const evento = mapTipoToEvento(dto.tipo);
    const created: any[] = [];
    for (const plataforma of dto.plataformas) {
      const previewPlataforma = preview[plataforma];
      if (!previewPlataforma || !previewPlataforma.texto) continue;

      const pub = await this.prisma.socialPublication.create({
        data: {
          evento,
          referenciaTipo: dto.tipo,
          referenciaId: dto.referenciaId,
          plataforma,
          estado: 'PROGRAMADO',
          textoFinal: previewPlataforma.texto,
          imageUrl: dto.imageOverride || previewPlataforma.imageUrl,
          programadoPara,
        },
      });
      created.push(pub);
    }

    return {
      success: true,
      message: `${created.length} publicación(es) programadas para ${programadoPara.toISOString()}`,
      publications: created,
    };
  }

  // ────────────────────────────────────────────────────────────────────
  // LIST — feed de publicaciones para el dashboard admin
  // ────────────────────────────────────────────────────────────────────
  async listPublications(params: {
    estado?: string;
    plataforma?: string;
    page?: number;
    limit?: number;
    referenciaTipo?: string;
    referenciaId?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.estado) where.estado = params.estado;
    if (params.plataforma) where.plataforma = params.plataforma;
    if (params.referenciaTipo) where.referenciaTipo = params.referenciaTipo;
    if (params.referenciaId) where.referenciaId = params.referenciaId;

    const [publications, total] = await Promise.all([
      this.prisma.socialPublication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.socialPublication.count({ where }),
    ]);

    return {
      publications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ────────────────────────────────────────────────────────────────────
  // RETRY — reintenta una publicación fallida
  // ────────────────────────────────────────────────────────────────────
  async retryPublication(id: string) {
    const pub = await this.prisma.socialPublication.findUnique({
      where: { id },
    });
    if (!pub) {
      throw new NotFoundException(`Publicación ${id} no encontrada`);
    }
    if (pub.estado === 'PUBLICADO') {
      throw new BadRequestException('Esta publicación ya fue exitosa');
    }

    // Resetear estado a PENDIENTE y reemitir evento
    await this.prisma.socialPublication.update({
      where: { id },
      data: { estado: 'PENDIENTE', errorMsg: null, intentos: 0 },
    });

    const data = await this.loadData(pub.referenciaTipo, pub.referenciaId);
    this.emitCompatEvent(
      pub.evento,
      pub.plataforma,
      data,
      pub.referenciaId,
    );

    return { success: true, message: 'Publicación reencolada', id };
  }

  // ────────────────────────────────────────────────────────────────────
  // TEMPLATES — CRUD de plantillas editables
  // ────────────────────────────────────────────────────────────────────
  async listTemplates() {
    const dbTemplates = await this.prisma.socialTemplate.findMany({
      orderBy: [{ tipo: 'asc' }, { plataforma: 'asc' }],
    });

    // Combinar con defaults para que el admin vea todos los disponibles
    const merged: any[] = [...dbTemplates];
    for (const def of DEFAULT_TEMPLATES) {
      const exists = dbTemplates.find(
        (t) => t.tipo === def.tipo && t.plataforma === def.plataforma,
      );
      if (!exists) {
        merged.push({
          id: null,
          tipo: def.tipo,
          plataforma: def.plataforma,
          template: def.template,
          activo: true,
          isDefault: true,
        });
      }
    }

    return merged.sort((a, b) => {
      if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo);
      return a.plataforma.localeCompare(b.plataforma);
    });
  }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    if (!id || id === 'null') {
      throw new BadRequestException('No se puede editar un template por defecto desde aquí');
    }
    return this.prisma.socialTemplate.update({
      where: { id },
      data: dto,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // SEED — inserta templates por defecto si no existen
  // ────────────────────────────────────────────────────────────────────
  async seedDefaultTemplates() {
    let inserted = 0;
    let skipped = 0;
    for (const tmpl of DEFAULT_TEMPLATES) {
      try {
        await this.prisma.socialTemplate.create({
          data: tmpl,
        });
        inserted++;
      } catch (e: any) {
        if (e.code === 'P2002') {
          skipped++;
        } else {
          throw e;
        }
      }
    }
    this.logger.log(
      `Templates: ${inserted} insertados, ${skipped} ya existían`,
    );
    return { inserted, skipped };
  }

  // ────────────────────────────────────────────────────────────────────
  // HELPERS PRIVADOS
  // ────────────────────────────────────────────────────────────────────
  private async loadData(tipo: string, id: string): Promise<any> {
    switch (tipo) {
      case 'sorteo':
        return this.prisma.sorteo.findUnique({
          where: { id },
          include: { juego: true },
        });
      case 'tutorial':
        return this.prisma.tutorial.findUnique({
          where: { id },
          include: { juego: true },
        });
      case 'bracket':
        return this.prisma.votacionBracket.findUnique({
          where: { id },
          include: { juego: true },
        });
      case 'ranking':
        return this.prisma.tablaCalificacion.findUnique({
          where: { id },
          include: { juego: true, categoria: true },
        });
      default:
        throw new BadRequestException(`Tipo no soportado: ${tipo}`);
    }
  }

  private async loadTemplates(evento: string): Promise<Record<string, string>> {
    const tmpls = await this.prisma.socialTemplate.findMany({
      where: { tipo: evento, activo: true },
    });
    const map: Record<string, string> = {};
    for (const t of tmpls) map[t.plataforma] = t.template;
    // Fallback a defaults hardcoded si no hay en DB
    for (const def of DEFAULT_TEMPLATES) {
      if (def.tipo === evento && !map[def.plataforma]) {
        map[def.plataforma] = def.template;
      }
    }
    return map;
  }

  private buildPublicUrl(
    tipo: string,
    id: string,
    data: any,
  ): string {
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3001';
    switch (tipo) {
      case 'sorteo':
        return `${frontendUrl}/sorteos`;
      case 'tutorial':
        return `${frontendUrl}/tutoriales/${data?.slug || id}`;
      case 'bracket':
        return `${frontendUrl}/votaciones/${data?.slug || id}`;
      case 'ranking':
        return `${frontendUrl}/calificaciones/${id}`;
      default:
        return frontendUrl;
    }
  }

  private detectMissingPlaceholders(
    used: string[],
    data: Record<string, any>,
  ): string[] {
    const missing: string[] = [];
    for (const path of used) {
      const value = path
        .split('.')
        .reduce((acc, key) => acc?.[key], data);
      if (value === undefined || value === null || value === '') {
        missing.push(path);
      }
    }
    return missing;
  }

  /**
   * Emite eventos compatibles con los listeners sociales existentes
   * (social-publication.listener.ts y bracket-phase.listener.ts).
   */
  private emitCompatEvent(
    evento: string,
    plataforma: string,
    data: any,
    referenciaId: string,
  ) {
    const eventName = `social.${evento}`;
    this.logger.log(
      `Emitiendo ${eventName} para plataforma ${plataforma}`,
    );

    // Mapeo de eventos content-studio → eventos que ya escuchan los listeners
    const compatMap: Record<string, string> = {
      sorteo_created: 'social.sorteo.created',
      sorteo_winners: 'social.sorteo.winners',
      tutorial_published: 'social.tutorial.published',
      bracket_created: 'social.bracket.created',
      bracket_phase: 'bracket.phase.started',
      bracket_champion: 'bracket.champion.declared',
      tabla_created: 'social.tabla.created',
      ranking_updated: 'social.ranking.updated',
    };

    const realEvent = compatMap[evento] || eventName;

    this.eventEmitter.emit(realEvent, {
      publicacionId: referenciaId,
      plataforma,
      data,
      manual: true,
    });
  }
}