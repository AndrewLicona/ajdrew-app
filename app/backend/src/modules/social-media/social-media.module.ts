import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DiscordService } from './services/discord.service';
import { XService } from './services/x.service';
import { BracketImageService } from './services/bracket-image.service';
import { BracketMediaService } from './services/bracket-media.service';
import { BracketPhaseListener } from './listeners/bracket-phase.listener';
import { SocialPublicationListener } from './listeners/social-publication.listener';
import { AdminDiscordController } from './controllers/admin-discord.controller';
import { AdminXController } from './controllers/admin-x.controller';
import { AdminMetaController } from './controllers/admin-meta.controller';
import { MetaService } from './services/meta.service';
import { YoutubeService } from './services/youtube.service';
import { AdminYoutubeController } from './controllers/admin-youtube.controller';
import { MediaModule } from '../../media/media.module';
import { SocialMediaController } from './controllers/social-media.controller';
import { RankingImageGenerator } from '../../calificaciones/application/ranking-image-generator';
import { VsImageGenerator } from './generators/vs-image.generator';

@Module({
  imports: [MediaModule],
  controllers: [
    AdminDiscordController,
    AdminXController,
    AdminMetaController,
    AdminYoutubeController,
    SocialMediaController,
  ],
  providers: [
    PrismaService,
    DiscordService,
    XService,
    MetaService,
    YoutubeService,
    BracketImageService,
    BracketMediaService,
    BracketPhaseListener,
    SocialPublicationListener,
    RankingImageGenerator,
    VsImageGenerator,
  ],
  exports: [
    DiscordService,
    XService,
    MetaService,
    YoutubeService,
    BracketImageService,
    BracketMediaService,
  ],
})
export class SocialMediaModule {}
