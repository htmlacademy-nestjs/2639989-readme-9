import { Expose } from 'class-transformer';

export class BlogSubscriptionRdo {
  @Expose()
  public followerId!: string;

  @Expose()
  public followingId!: string;
}
