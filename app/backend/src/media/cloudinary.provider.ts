import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryProvider {
  private readonly logger = new Logger(CloudinaryProvider.name);

  constructor() {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;

    this.logger.log(`Inicializando CloudinaryProvider con cloud_name: "${cloud_name || 'UNDEFINED'}"`);

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
  }

  async uploadImage(file: any, folder: string = 'ajdrew'): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('El archivo no contiene buffer de datos');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `ajdrew/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Error de Cloudinary API: ${JSON.stringify(error)}`);
            return reject(error);
          }
          if (!result || !result.secure_url) {
            return reject(new Error('Cloudinary upload failed: no result'));
          }
          resolve(result.secure_url);
        },
      );
      upload.end(file.buffer);
    });
  }
}
