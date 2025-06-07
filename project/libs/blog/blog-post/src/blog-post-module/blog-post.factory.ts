import {Injectable} from '@nestjs/common';
import {EntityFactory, Post} from '@project/core';
import {BlogPostEntity} from './blog-post.entity';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  public create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }
}
