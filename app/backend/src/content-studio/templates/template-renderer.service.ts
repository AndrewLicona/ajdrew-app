import { Injectable } from '@nestjs/common';

/**
 * Servicio que renderiza placeholders en templates.
 *
 * Sintaxis soportada:
 *  - {{clave}}              → valor simple
 *  - {{clave.subclave}}     → navegación anidada
 *  - {{clave | truncate:280}} → truncado a N caracteres (preserva palabras)
 *  - {{#if clave}}...{{/if}} → bloque condicional (incluye solo si clave es truthy)
 *
 * Ejemplos:
 *  - "¡Sorteo de {{premio}}!" + {premio: "PS5"} → "¡Sorteo de PS5!"
 *  - "Juego: {{juego.nombre}}" + {juego: {nombre: "Clash Royale"}} → "Juego: Clash Royale"
 */
@Injectable()
export class TemplateRenderer {
  /**
   * Renderiza un template con los datos proporcionados.
   * Si el template es null/undefined devuelve undefined.
   */
  render(template: string | null | undefined, data: Record<string, any>): string {
    if (!template) return '';

    let result = template;

    // 1. Bloques condicionales {{#if clave}}...{{/if}}
    result = result.replace(
      /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_, key, content) => {
        const value = this.resolvePath(data, key);
        return value ? content : '';
      },
    );

    // 2. Truncado {{clave | truncate:N}}
    result = result.replace(
      /\{\{\s*([\w.]+)\s*\|\s*truncate:(\d+)\s*\}\}/g,
      (_, key, max) => {
        const value = this.resolvePath(data, key);
        const text = String(value ?? '');
        return this.truncate(text, parseInt(max, 10));
      },
    );

    // 3. Placeholders simples {{clave}} y {{clave.subclave}}
    result = result.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const value = this.resolvePath(data, key);
      if (value === undefined || value === null) return '';
      if (value instanceof Date) return value.toLocaleDateString('es-CO');
      if (typeof value === 'object') return '';
      return String(value);
    });

    return result;
  }

  /**
   * Trunca un texto a N caracteres preservando palabras completas.
   */
  truncate(texto: string, max = 280): string {
    if (!texto) return '';
    if (texto.length <= max) return texto;
    return texto.substring(0, max - 3).replace(/\s+\S*$/, '') + '...';
  }

  /**
   * Extrae la lista de placeholders usados en un template.
   * Útil para validación y para mostrar al usuario qué variables puede usar.
   */
  extractPlaceholders(template: string): string[] {
    const placeholders = new Set<string>();
    const regex = /\{\{\s*([\w.]+)(?:\s*\|\s*truncate:\d+)?\s*\}\}/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(template)) !== null) {
      placeholders.add(match[1]);
    }
    return Array.from(placeholders);
  }

  /**
   * Resuelve una ruta con notación de puntos sobre un objeto.
   */
  private resolvePath(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
}