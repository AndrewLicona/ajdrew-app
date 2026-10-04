import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import {
  SUPPORTED_EVENT_TYPES,
  SUPPORTED_PLATFORMS,
} from '../../templates/default-templates';

/**
 * DTO para generar preview de contenido social SIN publicar.
 *
 * Ejemplo:
 *  POST /api/content-studio/preview
 *  {
 *    "tipo": "sorteo",
 *    "referenciaId": "ckxxxxxxx",
 *    "plataformas": ["discord", "x"]
 *  }
 */
export class PreviewDto {
  /**
   * Tipo de recurso del cual se quiere previsualizar el contenido social.
   */
  @IsString()
  @IsIn(['sorteo', 'tutorial', 'bracket', 'ranking'])
  tipo: 'sorteo' | 'tutorial' | 'bracket' | 'ranking';

  /**
   * ID del recurso (sorteo, tutorial, bracket o ranking).
   */
  @IsString()
  referenciaId: string;

  /**
   * Plataformas para las que se quiere preview. Si no se especifica, se generan para todas.
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn([...SUPPORTED_PLATFORMS], { each: true })
  plataformas?: string[];

  /**
   * (Opcional) Override manual del texto por plataforma.
   * Útil para preview de variaciones antes de publicar.
   */
  @IsOptional()
  textosOverride?: Record<string, string>;
}

/**
 * Mapeo de tipo de recurso → tipo de evento en SocialTemplate.
 * Ej: 'sorteo' → 'sorteo_created'
 */
export function mapTipoToEvento(tipo: string): string {
  const map: Record<string, string> = {
    soteo: 'sorteo_created',
    sorteo: 'sorteo_created',
    tutorial: 'tutorial_published',
    bracket: 'bracket_created',
    ranking: 'ranking_updated',
  };
  return map[tipo] || tipo;
}

export { SUPPORTED_EVENT_TYPES, SUPPORTED_PLATFORMS };