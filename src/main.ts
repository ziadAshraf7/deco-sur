import 'dotenv/config';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { VersioningType, Logger } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/interceptors/response.interceptor';
import { AllExceptionsFilter } from './shared/exceptions/all.exceptions.filter';
import { LoggingInterceptor } from './shared/logger/logger.interceptor';
import { I18nService, I18nValidationPipe } from 'nestjs-i18n';


async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());

  app.use(compression());

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true,            
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, app.get(I18nService)));

  app.useGlobalInterceptors(new LoggingInterceptor() , new TransformInterceptor());

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();