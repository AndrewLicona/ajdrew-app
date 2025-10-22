
import { Module } from '@nestjs/common';
import { CategoriasController } from './interfaces/categorias.controller';
import { CategoriasService } from './application/categorias.service';
import { CategoriaRepository } from './infrastructure/persistence/categoria.repository';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriaRepository]
})
export class CategoriasModule {}
