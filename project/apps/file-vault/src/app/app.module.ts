import {Module} from '@nestjs/common';
import {FileUploaderModule} from "@project/file-uploader";
import {FileVaultConfigModule, getMongooseOptions} from "@project/file-config";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    FileUploaderModule,
    FileVaultConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
