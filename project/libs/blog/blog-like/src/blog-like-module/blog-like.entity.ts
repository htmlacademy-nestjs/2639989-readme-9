import { Entity, StorableEntity } from '@project/core';
import { Like } from '@project/core';

export class BlogLikeEntity extends Entity implements StorableEntity<Like> {
  public userId!: string;
  public postId!: string;
  public createdAt!: Date;

  constructor(like?: Like) {
    super();
    this.populate(like);
  }

  public populate(like?: Like) {
    if (!like) {
      return;
    }
    this.userId = like.userId;
    this.postId = like.postId;
    this.createdAt = like.createdAt!;
    this.id = `${like.userId}_${like.postId}`;
  }

  public toPOJO(): Like {
    return {
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
    };
  }
}
