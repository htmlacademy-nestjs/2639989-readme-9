import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const environment = configService.get('application.environment');
  const isDev = environment === 'development';

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('API сервис для пользователей')
      .setDescription('API сервис для пользователей')
      .setVersion('1.0')
      .addTag('account')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(GLOBAL_PREFIX, app, documentFactory);
    Logger.log(
      `🚀 Swagger for Accounts API is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
    );
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(
    `🚀 Accounts API is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
