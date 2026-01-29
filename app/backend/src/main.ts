import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración mejorada de CORS
  app.enableCors({
    origin: [
      'https://andrewlamaquina.my',
      'https://ajdrew.andrewlamaquina.my',
      'http://localhost:3300',
      'http://localhost:8081',
      'http://localhost:3000',
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/, // Permitir cualquier IP local con cualquier puerto
      'http://frontend:3300',
      'http://frontend:80',
      'http://frontend',
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
  Logger.log(`   - Network: http://192.168.100.8:${port}`, 'Bootstrap');
  Logger.log(`📊 Estado DB:  http://localhost:${port}/api/db-status`, 'Bootstrap');

}

bootstrap().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
