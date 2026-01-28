import { Controller, Post, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryProvider } from './cloudinary.provider';

@Controller('media')
export class MediaController {
    constructor(private readonly cloudinaryProvider: CloudinaryProvider) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: any,
        @Query('folder') folder: string = 'general'
    ) {
        const url = await this.cloudinaryProvider.uploadImage(file, folder);
        return { url };
    }
}
