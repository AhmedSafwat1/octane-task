import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './common/logger/winston.logger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  try {
    // Create the Winston logger instance
    const logger = WinstonModule.createLogger(winstonLoggerConfig);

    // Create the app with the logger
    const app = await NestFactory.create(AppModule, {
      logger: logger,
      bufferLogs: true,
    });

    const configService = app.get(ConfigService);

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
      .setTitle(configService.get('app.name', 'Book Reading API'))
      .setDescription('API documentation for the Book Reading System')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
        },
        'access-token',
      )
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, document);

    // Global filters Exception
    app.useGlobalFilters(new AllExceptionsFilter(configService));

    // Global interceptors
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Start the server
    const port = configService.get('app.port');
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
