import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT} from "./app.config";
import {CheckAuthGuard} from "./guards/check-auth.guard";
import {UsersController} from "./users.controller";
import {BlogController} from "./blog.controller";
import {CommentsController} from "./comments.controller";
import {FilesController} from "./files.controller";
import {LikesController} from "./likes.controller";
import {TagsController} from "./tags.controller";
import {SubscriptionsController} from "./subscriptions.controller";
import {NotifyController} from "./notify.controller";

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
  ],
  controllers: [
    UsersController,
    BlogController,
    CommentsController,
    LikesController,
    TagsController,
    SubscriptionsController,
    NotifyController,
    FilesController
  ],
  providers: [CheckAuthGuard],
})
export class AppModule {
}
