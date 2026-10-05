import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryProvider } from './cloudinary.provider';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Query('folder') folder: string = 'general',
  ) {
    if (!file) {
      this.logger.error('No se recibió ningún archivo en la petición');
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    try {
      this.logger.log(`Subiendo archivo "${file.originalname}" (${file.size} bytes) a carpeta "${folder}"...`);
      const url = await this.cloudinaryProvider.uploadImage(file, folder);
      this.logger.log(`Subida exitosa: ${url}`);
      return { url };
    } catch (err: any) {
      this.logger.error(`Fallo al subir a Cloudinary: ${err.message}`, err.stack);
      throw new InternalServerErrorException(err.message || 'Error al subir imagen a Cloudinary');
    }
  }
}
