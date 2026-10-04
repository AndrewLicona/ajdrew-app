import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para actualizar una plantilla editable desde el admin.
 */
export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  template?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}