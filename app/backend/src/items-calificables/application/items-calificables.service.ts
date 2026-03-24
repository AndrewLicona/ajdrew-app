// items-calificables/application/items-calificables.service.ts
import { Injectable } from '@nestjs/common';
import { CreateItemCalificableDto } from './dto/create-item-calificable.dto';
import { UpdateItemCalificableDto } from './dto/update-item-calificable.dto';
import { ItemCalificableRepository } from '../infrastructure/persistence/item-calificable.repository';

@Injectable()
export class ItemsCalificablesService {
  constructor(private readonly itemCalificableRepository: ItemCalificableRepository) { }

  create(createItemCalificableDto: CreateItemCalificableDto) {
    return this.itemCalificableRepository.create(createItemCalificableDto);
  }

  createMany(items: CreateItemCalificableDto[]) {
    return this.itemCalificableRepository.createMany(items);
  }


  findAll(params: {
    categoryId?: string;
    tablaId?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    deviceId?: string;
  }) {
    return this.itemCalificableRepository.findAll(params);
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