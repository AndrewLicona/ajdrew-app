import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DiscordService } from '../services/discord.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';
import { YoutubeService } from '../services/youtube.service';
import { BracketImageService } from '../services/bracket-image.service';

@Injectable()
export class BracketPhaseListener {
    private readonly logger = new Logger(BracketPhaseListener.name);

    constructor(
        private discordService: DiscordService,
        private xService: XService,
        private metaService: MetaService,
        private youtubeService: YoutubeService,
        private imageService: BracketImageService
    ) { }

    @OnEvent('bracket.phase.started')
    async handlePhaseStarted(payload: { bracketId: string; round: number }) {
        this.logger.log(`Handling phase started event for bracket ${payload.bracketId}, round ${payload.round}`);

        try {
            // 1. Generate bracket image
            const imageBuffer = await this.imageService.generateBracketImage(
                payload.bracketId,
                payload.round
            );

            // 2. Publish to Discord
            await this.discordService.publishPhaseAnnouncement(
                payload.bracketId,
                payload.round,
                imageBuffer
            );

            // 3. Publish to X (Twitter)
            await this.xService.publishPhaseAnnouncement(
                payload.bracketId,
                payload.round,
                imageBuffer
            );

            // 4. Publish to Meta (Facebook & Instagram)
            // Meta requires a public URL
            const imageUrl = await this.imageService.saveImageLocally(
                imageBuffer,
                payload.bracketId,
                payload.round
            );

            await this.metaService.publishPhaseAnnouncement(
                payload.bracketId,
                payload.round,
                imageUrl
            );

            // 5. Publish to YouTube (Video/Short)
            await this.youtubeService.publishPhaseAnnouncement(
                payload.bracketId,
                payload.round,
                imageUrl
            );
        } catch (error) {
            this.logger.error('Error handling bracket phase started event', error);
        }
    }
}
