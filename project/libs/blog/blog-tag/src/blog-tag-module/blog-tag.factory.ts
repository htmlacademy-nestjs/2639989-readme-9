import {Injectable} from '@nestjs/common';

import {Tag, EntityFactory} from '@project/core';
import {BlogTagEntity} from './blog-tag.entity';

@Injectable()
export class BlogTagFactory implements EntityFactory<BlogTagEntity> {
  public create(entityPlainData: Tag): BlogTagEntity {
    return new BlogTagEntity(entityPlainData);
  }
}
