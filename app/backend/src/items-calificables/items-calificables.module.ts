import { Module } from '@nestjs/common';
import { ItemsCalificablesController } from './interfaces/items-calificables.controller';
import { ItemsCalificablesService } from './application/items-calificables.service';
import { ItemCalificableRepository } from './infrastructure/persistence/item-calificable.repository';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsCalificablesController],
  providers: [ItemsCalificablesService, ItemCalificableRepository],
  exports: [ItemsCalificablesService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class ItemsCalificablesModule {}
