import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateRenderer } from './templates/template-renderer.service';
import {
  DEFAULT_TEMPLATES,
  SUPPORTED_PLATFORMS,
} from './templates/default-templates';

/**
 * Servicio que construye el texto para una publicación social.
 *
 * Flujo:
 *  1. Busca el template en la tabla SocialTemplate (DB) por (tipo, plataforma).
 *  2. Si existe y activo=true, renderiza con TemplateRenderer usando los datos del recurso.
 *  3. Si no existe en DB, usa el DEFAULT_TEMPLATES hardcoded como fallback.
 *  4. Si tampoco hay default, lanza warning y devuelve string vacío.
 *
 * Esto permite que el admin edite los textos desde /admin/content-studio/templates
 * sin necesidad de tocar código ni reiniciar servicios.
 *
 * Es 100% backward-compatible: si no se ha hecho seed en DB, el comportamiento
 * es idéntico al código anterior (usa los defaults hardcoded).
 */
@Injectable()
export class SocialTextBuilder {
  private readonly logger = new Logger(SocialTextBuilder.name);

  /**
   * Cache en memoria de templates, para no golpear la DB en cada publicación.
   * Se invalida cada 5 minutos o manualmente con `clearCache()`.
   */
  private cache: Map<string, { template: string; ts: number }> = new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

  constructor(
    private prisma: PrismaService,
    private renderer: TemplateRenderer,
  ) {}

  /**
   * Construye el texto para una plataforma específica.
   *
   * @param evento Tipo de evento (ej 'sorteo_created', 'tutorial_published')
   * @param plataforma Plataforma destino ('discord', 'x', 'meta', 'youtube')
   * @param data Objeto con los datos del recurso (sorteo, tutorial, bracket, etc)
   */
  async build(
    evento: string,
    plataforma: string,
    data: Record<string, any>,
  ): Promise<string> {
    const tmpl = await this.getTemplate(evento, plataforma);

    if (!tmpl) {
      this.logger.warn(
        `No hay template (DB ni default) para evento=${evento} plataforma=${plataforma}`,
      );
      return '';
    }

    return this.renderer.render(tmpl, this.enrichData(data, plataforma));
  }

  /**
   * Construye el texto para todas las plataformas soportadas.
   * Útil para mostrar preview antes de enviar.
   */
  async buildForAllPlataforms(
    evento: string,
    data: Record<string, any>,
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const plataforma of SUPPORTED_PLATFORMS) {
      result[plataforma] = await this.build(evento, plataforma, data);
    }
    return result;
  }

  /**
   * Trunca a 280 caracteres para Twitter/X si la plataforma es 'x'.
   */
  async buildForX(evento: string, data: Record<string, any>): Promise<string> {
    const text = await this.build(evento, 'x', data);
    return this.renderer.truncate(text, 280);
  }

  /**
   * Invalida el cache (llamar después de editar un template).
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalida el cache de un template específico.
   */
  invalidate(evento: string, plataforma: string): void {
    this.cache.delete(this.cacheKey(evento, plataforma));
  }

  // ──────────────────────────────────────────────────────────────────
  // PRIVADOS
  // ──────────────────────────────────────────────────────────────────

  private cacheKey(evento: string, plataforma: string): string {
    return `${evento}::${plataforma}`;
  }

  private async getTemplate(
    evento: string,
    plataforma: string,
  ): Promise<string | null> {
    const key = this.cacheKey(evento, plataforma);

    // 1. Cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.ts < this.CACHE_TTL_MS) {
      return cached.template;
    }

    // 2. DB
    const dbTmpl = await this.prisma.socialTemplate.findUnique({
      where: {
        tipo_plataforma: {
          tipo: evento,
          plataforma,
        },
      },
    });

    if (dbTmpl && dbTmpl.activo) {
      this.cache.set(key, { template: dbTmpl.template, ts: Date.now() });
      return dbTmpl.template;
    }

    // 3. Fallback a defaults hardcoded
    const def = DEFAULT_TEMPLATES.find(
      (t) => t.tipo === evento && t.plataforma === plataforma,
    );
    if (def) {
      this.cache.set(key, { template: def.template, ts: Date.now() });
      return def.template;
    }

    return null;
  }

  /**
   * Enriquece los datos con campos derivados comunes (url pública, etc).
   */
  private enrichData(
    data: Record<string, any>,
    plataforma: string,
  ): Record<string, any> {
    const enriched = { ...data };

    // URL pública si no está
    if (!enriched.url) {
      const frontendUrl =
        process.env.FRONTEND_URL || 'http://localhost:3001';
      if (data.slug) {
        enriched.url = `${frontendUrl}/${this.inferSection(data)}/${data.slug}`;
      } else if (data.id) {
        enriched.url = `${frontendUrl}/${this.inferSection(data)}/${data.id}`;
      } else {
        enriched.url = frontendUrl;
      }
    }

    // Para X (Twitter), añadir flag de truncado si el texto es largo
    if (plataforma === 'x' && enriched.textoSinTruncar) {
      // noop - el renderer aplica truncate solo cuando hay {{... | truncate:N}}
    }

    return enriched;
  }

  private inferSection(data: Record<string, any>): string {
    if (data.tematica || data.matches) return 'votaciones';
    if (data.premio || data.fechaFin) return 'sorteos';
    if (data.videoUrl || data.pasos) return 'tutoriales';
    if (data.items || data.categoria) return 'calificaciones';
    return '';
  }
}