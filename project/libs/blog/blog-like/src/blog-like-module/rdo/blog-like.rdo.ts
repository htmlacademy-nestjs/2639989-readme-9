import { Expose } from 'class-transformer';

export class BlogLikeRdo {
  @Expose()
  public userId!: string;

  @Expose()
  public postId!: string;

  @Expose()
  public createdAt!: Date;
}
