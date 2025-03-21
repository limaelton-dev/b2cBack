import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API B2C')
    .setDescription('Documentação da API B2C')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
  console.log(`Aplicação rodando na porta 3000`);
  console.log(`Documentação disponível em: http://localhost:3000/api/docs`);
}
bootstrap();
