import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import fileConfig from './file.config';

const ENV_FILE_PATH = 'apps/file-vault/file-vault.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileConfig],
      envFilePath: ENV_FILE_PATH
    }),
  ]
})
export class FileVaultConfigModule {
}
