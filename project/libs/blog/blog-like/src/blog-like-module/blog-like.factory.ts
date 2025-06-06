import { Injectable } from '@nestjs/common';
import { BlogLikeEntity } from './blog-like.entity';
import {EntityFactory, Like} from '@project/core';

@Injectable()
export class BlogLikeFactory implements EntityFactory<BlogLikeEntity>{
  public create(like: Like): BlogLikeEntity {
    return new BlogLikeEntity(like);
  }
}
