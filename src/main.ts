import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { runSeeders } from './database/seeders';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar pipes de validação globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  // Configurar CORS
  app.enableCors();
  
  // Configurar prefixo global para API
  app.setGlobalPrefix('api');
  
  // Executar seeders
  const dataSource = app.get(DataSource);
  await runSeeders(dataSource);
  
  await app.listen(3000);
  console.log(`Aplicação rodando na porta 3000`);
}
bootstrap();
