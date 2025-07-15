import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use container for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });


  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Automatically transform primitive types
    },
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Book Reading API')
    .setDescription('API documentation for the Book Reading System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
