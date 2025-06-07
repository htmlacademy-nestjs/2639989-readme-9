import {Comment, Entity, StorableEntity} from '@project/core';

export class BlogCommentEntity extends Entity implements StorableEntity<Comment> {
  public userId: string;
  public postId: string;
  public text: string;
  public createdAt: Date;

  constructor(comment?: Comment) {
    super();
    this.populate(comment);
  }

  public populate(comment?: Comment) {
    if (!comment) {
      return;
    }

    this.id = comment.id ?? undefined;
    this.userId = comment.userId ?? undefined;
    this.postId = comment.postId ?? undefined;
    this.text = comment.text;
    this.createdAt = comment.createdAt ?? undefined;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
      text: this.text,
      createdAt: this.createdAt,
    };
  }
}
