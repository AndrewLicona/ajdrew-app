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
      'http://localhost:3001',
      'http://localhost:3000',
      'http://frontend:3002',
      'http://frontend:3002',
      'http://frontend:3001',
      'http://frontend',
      'http://backend:3000',
      'http://localhost:3000/api/db-status',
      'http://localhost:3000/api/health',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  // Configuración de prefijo global
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  


  Logger.log(`🚀 Servidor ejecutándose en http://localhost:${port}`, 'Bootstrap');
  Logger.log(`📊 Ver estado de la base de datos: http://localhost:${port}/api/db-status`, 'Bootstrap');

}

bootstrap().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
