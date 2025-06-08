import {Injectable} from '@nestjs/common';
import {BlogCommentEntity} from './blog-comment.entity';
import {Comment, EntityFactory} from '@project/core';

@Injectable()
export class BlogCommentFactory implements EntityFactory<BlogCommentEntity> {
  public create(comment: Comment): BlogCommentEntity {
    return new BlogCommentEntity(comment);
  }
}
