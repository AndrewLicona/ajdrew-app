import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ItemsCalificablesModule } from './items-calificables/items-calificables.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { JuegosModule } from './juegos/juegos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { SorteosModule } from './sorteos/sorteos.module';
import { VotacionesModule } from './votaciones/votaciones.module';
import { MediaModule } from './media/media.module';
import { TutorialesModule } from './tutoriales/tutoriales.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocialMediaModule } from './modules/social-media/social-media.module';
import { TablasCalificacionModule } from './tablas-calificacion/tablas-calificacion.module';

@Module({
  imports: [
    PrismaModule,
    CategoriasModule,
    ItemsCalificablesModule,
    CalificacionesModule,
    JuegosModule,
    UsuariosModule,
    AuthModule,
    SorteosModule,
    VotacionesModule,
    MediaModule,
    TutorialesModule,
    DashboardModule,
    PublicacionesModule,
    EventEmitterModule.forRoot(),
    SocialMediaModule,
    TablasCalificacionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
