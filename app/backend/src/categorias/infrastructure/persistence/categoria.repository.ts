
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoriaDto } from '../../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../../application/dto/update-categoria.dto';

@Injectable() 
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: createCategoriaDto });
  }

  async findAll() {
    return this.prisma.categoria.findMany();
  }

  async findOne(id: string) {
    return this.prisma.categoria.findUnique({ where: { id } });
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: string) {
    return this.prisma.categoria.delete({ where: { id } });
  }
}
