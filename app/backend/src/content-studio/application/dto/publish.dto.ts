import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { SUPPORTED_PLATFORMS } from '../../templates/default-templates';

/**
 * DTO para publicar inmediatamente en las plataformas seleccionadas.
 *
 * Crea registros en SocialPublication (estado=PENDIENTE) y emite los eventos
 * correspondientes para que los listeners sociales existentes procesen la
 * publicación real (manteniendo compatibilidad con la arquitectura actual).
 */
export class PublishDto {
  @IsString()
  @IsIn(['sorteo', 'tutorial', 'bracket', 'ranking'])
  tipo: 'sorteo' | 'tutorial' | 'bracket' | 'ranking';

  @IsString()
  referenciaId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn([...SUPPORTED_PLATFORMS], { each: true })
  plataformas: string[];

  /**
   * Override del texto por plataforma (si se quiere ajustar antes de publicar).
   */
  @IsOptional()
  textosOverride?: Record<string, string>;

  /**
   * Override de la URL de la imagen (si se quiere usar una imagen distinta a la del recurso).
   */
  @IsOptional()
  imageOverride?: string;

  /**
   * Si true, la publicación es inmediata. Si false, requiere ScheduleDto.
   */
  @IsOptional()
  inmediato?: boolean = true;
}