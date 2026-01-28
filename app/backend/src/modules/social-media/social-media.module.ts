import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DiscordService } from './services/discord.service';
import { XService } from './services/x.service';
import { BracketImageService } from './services/bracket-image.service';
import { BracketPhaseListener } from './listeners/bracket-phase.listener';
import { AdminDiscordController } from './controllers/admin-discord.controller';
import { AdminXController } from './controllers/admin-x.controller';
import { AdminMetaController } from './controllers/admin-meta.controller';
import { MetaService } from './services/meta.service';
import { YoutubeService } from './services/youtube.service';
import { AdminYoutubeController } from './controllers/admin-youtube.controller';

@Module({
    imports: [],
    controllers: [AdminDiscordController, AdminXController, AdminMetaController, AdminYoutubeController],
    providers: [
        PrismaService,
        DiscordService,
        XService,
        MetaService,
        YoutubeService,
        BracketImageService,
        BracketPhaseListener
    ],
    exports: [DiscordService, XService, MetaService, YoutubeService, BracketImageService]
})
export class SocialMediaModule { }
