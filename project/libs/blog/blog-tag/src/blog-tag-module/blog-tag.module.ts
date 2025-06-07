import {Module} from '@nestjs/common';

import {PrismaClientModule} from '@project/blog-models';
import {BlogTagRepository} from './blog-tag.repository';
import {BlogTagController} from './blog-tag.controller';
import {BlogTagService} from './blog-tag.service';
import {BlogTagFactory} from './blog-tag.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogTagRepository, BlogTagService, BlogTagFactory],
  controllers: [BlogTagController],
  exports: [BlogTagService],
})
export class BlogTagModule {
}
