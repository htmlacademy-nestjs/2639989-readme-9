import { Module } from '@nestjs/common';
import { BlogLikeController } from './blog-like.controller';
import { BlogLikeService } from './blog-like.service';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeFactory } from './blog-like.factory';
import { PrismaClientModule } from '@project/blog-models';

@Module({
  imports: [PrismaClientModule],
  controllers: [BlogLikeController],
  providers: [
    BlogLikeFactory,
    BlogLikeRepository,
    BlogLikeService
  ],
  exports: [BlogLikeService]
})
export class BlogLikeModule {}
