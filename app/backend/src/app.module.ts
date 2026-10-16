import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { ContentStudioModule } from './content-studio/content-studio.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { YtModule } from './yt/yt.module';

@Module({
  imports: [
    // Rate limiting - límite alto para desarrollo, excluye GET de lectura frecuente
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 1000, // 1000 requests per minute per IP (desarrollo)
    }]),
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
    ContentStudioModule,
    AuthGoogleModule,
    YtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
