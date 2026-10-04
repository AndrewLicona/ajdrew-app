import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentStudioService } from './content-studio.service';
import { ContentStudioController } from './content-studio.controller';
import { TemplateRenderer } from './templates/template-renderer.service';
import { SocialTextBuilder } from './text-builder.service';
import { ScheduledPublicationsCron } from './scheduled-publications.cron';

@Module({
  imports: [PrismaModule],
  controllers: [ContentStudioController],
  providers: [
    ContentStudioService,
    TemplateRenderer,
    SocialTextBuilder,
    ScheduledPublicationsCron,
  ],
  exports: [ContentStudioService, TemplateRenderer, SocialTextBuilder],
})
export class ContentStudioModule {}