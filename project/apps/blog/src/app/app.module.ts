import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BlogTagModule} from "../../../../libs/blog/blog-tag/src/blog-tag-module/blog-tag.module";

@Module({
  imports: [BlogTagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
