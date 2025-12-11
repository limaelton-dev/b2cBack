import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configura interceptor global para serialização (class-transformer)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // Função recursiva para extrair erros de validação (incluindo aninhados)
  const extractValidationErrors = (errors: ValidationError[]): string[] => {
    const messages: string[] = [];
    
    for (const error of errors) {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        messages.push(...extractValidationErrors(error.children));
      }
    }
    
    return messages;
  };

  // Configura pipes de validação globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    transformOptions: { 
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    },
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errors = extractValidationErrors(validationErrors);
      return new BadRequestException(errors);
    },
  }));
  
  // Configura CORS
  app.enableCors();
  
  // Configura prefixo global para API
  app.setGlobalPrefix('api');
  
  // Configura Swagger
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
