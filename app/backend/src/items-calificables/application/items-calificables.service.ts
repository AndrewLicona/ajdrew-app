// items-calificables/application/items-calificables.service.ts
import { Injectable } from '@nestjs/common';
import { CreateItemCalificableDto } from './dto/create-item-calificable.dto';
import { UpdateItemCalificableDto } from './dto/update-item-calificable.dto';
import { ItemCalificableRepository } from '../infrastructure/persistence/item-calificable.repository';

@Injectable()
export class ItemsCalificablesService {
  constructor(private readonly itemCalificableRepository: ItemCalificableRepository) {}

  create(createItemCalificableDto: CreateItemCalificableDto) {
    return this.itemCalificableRepository.create(createItemCalificableDto);
  }

  findAll(categoryId?: string, deviceId?: string) {
    return this.itemCalificableRepository.findAll(categoryId, deviceId);
  }

  findOne(id: string, deviceId?: string) {
    return this.itemCalificableRepository.findOne(id, deviceId);
  }

  update(id: string, updateItemCalificableDto: UpdateItemCalificableDto) {
    return this.itemCalificableRepository.update(id, updateItemCalificableDto);
  }

  remove(id: string) {
    return this.itemCalificableRepository.remove(id);
  }
}