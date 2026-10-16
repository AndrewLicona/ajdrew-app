import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DeviceIdMiddleware } from './common/middleware/device-id.middleware';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser for deviceId cookie
  app.use(cookieParser());

  // Serve static files from public directory (disco)
  app.use('/public', express.static(path.join(process.cwd(), 'public')));

  // DeviceId middleware (applies to all routes)
  app.use((req: any, res: any, next: any) => new DeviceIdMiddleware().use(req, res, next));

  // Configuración mejorada de CORS
  app.enableCors({
    origin: [
      'https://andrewlamaquina.my',
      'https://ajdrew.andrewlamaquina.my',
      'http://localhost:3300',
      'http://localhost:8081',
      'http://localhost:3000',
      'http://localhost:3001',
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      'http://frontend:3300',
      'http://frontend:80',
      'http://frontend',
      'https://ajdrew.site',
      'http://ajdrew.site',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  // Configuración de prefijo global
  app.setGlobalPrefix('api');

  const port = 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces

  Logger.log(`🚀 Servidor ejecutándose en:`, 'Bootstrap');
  Logger.log(`   - Local:   http://localhost:${port}`, 'Bootstrap');
  Logger.log(
    `📊 Estado DB:  http://localhost:${port}/api/db-status`,
    'Bootstrap',
  );
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
