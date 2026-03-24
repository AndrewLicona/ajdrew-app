import { PartialType } from '@nestjs/mapped-types';
import { CreateItemCalificableDto } from './create-item-calificable.dto';

export class UpdateItemCalificableDto extends PartialType(CreateItemCalificableDto) {
  nombre?: string;
  image?: string;
  juegoId?: string;
}
