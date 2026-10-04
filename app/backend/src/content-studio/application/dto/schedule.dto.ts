import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { SUPPORTED_PLATFORMS } from '../../templates/default-templates';

/**
 * DTO para programar una publicación para una fecha futura.
 *
 * A diferencia de PublishDto, no emite los eventos inmediatamente:
 * crea registros con estado=PROGRAMADO y programadoPara=<fecha>.
 * Un cron job procesa los PROGRAMADO cuya fecha ya pasó.
 */
export class ScheduleDto {
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
   * Fecha y hora a la que se quiere publicar (ISO 8601).
   */
  @IsDateString()
  programadoPara: string;

  @IsOptional()
  textosOverride?: Record<string, string>;

  @IsOptional()
  imageOverride?: string;
}