
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ItemsCalificablesModule } from './items-calificables/items-calificables.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, CategoriasModule, ItemsCalificablesModule, CalificacionesModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService   
  ],
})
export class AppModule {}
