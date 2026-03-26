import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriaRepository } from '../infrastructure/persistence/categoria.repository';

@Injectable()
export class CategoriasService {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaRepository.create(createCategoriaDto);
  }

  findAll(juegoId?: string, includeItems: boolean = false) {
    return this.categoriaRepository.findAll(juegoId, includeItems);
  }

  findOne(id: string) {
    return this.categoriaRepository.findOne(id);
  }

  update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaRepository.update(id, updateCategoriaDto);
  }

  remove(id: string) {
    return this.categoriaRepository.remove(id);
  }
}
