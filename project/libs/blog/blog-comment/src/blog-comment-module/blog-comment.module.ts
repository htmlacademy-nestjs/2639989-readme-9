import {Module} from '@nestjs/common';
import {BlogCommentController} from './blog-comment.controller';
import {BlogCommentService} from './blog-comment.service';
import {BlogCommentRepository} from './blog-comment.repository';
import {BlogCommentFactory} from './blog-comment.factory';
import {PrismaClientModule} from '@project/blog-models';

@Module({
  imports: [PrismaClientModule],
  providers: [
    BlogCommentRepository,
    BlogCommentService,
    BlogCommentFactory
  ],
  controllers: [BlogCommentController],
  exports: [BlogCommentService]
})
export class BlogCommentModule {
}
