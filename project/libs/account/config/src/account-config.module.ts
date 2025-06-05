import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {ENV_USERS_FILE_PATH} from "./account.config.constant";
import applicationConfig from "./configurations/app.config";
import mongoConfig from './configurations/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig],
      envFilePath: ENV_USERS_FILE_PATH
    }),
  ]
})
export class AccountConfigModule {}
