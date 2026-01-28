import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
    controllers: [MediaController],
    providers: [CloudinaryProvider],
    exports: [CloudinaryProvider],
})
export class MediaModule { }
