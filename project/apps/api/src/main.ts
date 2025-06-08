import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

const GLOBAL_PREFIX = 'api';
const PORT = process.env.PORT || 3000;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  if (IS_DEVELOPMENT) {
    const config = new DocumentBuilder()
      .setTitle('Главный API')
      .setDescription('Главный API сервис для Readme')
      .setVersion('1.0')
      .addTag('api')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(GLOBAL_PREFIX, app, documentFactory);
    Logger.log(
      `🚀 Swagger for API is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`
    );
  }

  await app.listen(PORT);
  Logger.log(
    `🚀 API is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
