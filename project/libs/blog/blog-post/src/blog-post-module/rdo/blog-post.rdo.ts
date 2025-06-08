import {Expose} from 'class-transformer';
import {PostStatus, PostType} from '@prisma/client';

export class BlogPostRdo {
  @Expose()
  public id!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public type!: PostType;

  @Expose()
  public payload!: Record<string, any>;

  @Expose()
  public createdAt!: Date;

  @Expose()
  public publishedAt!: Date;

  @Expose()
  public status!: PostStatus;

  @Expose()
  public isRepost!: boolean;

  @Expose()
  public originalPostId?: string;
}
