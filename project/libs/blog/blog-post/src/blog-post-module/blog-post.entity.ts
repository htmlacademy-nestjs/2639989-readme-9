import {Entity, Post, PostStatus, PostType, StorableEntity} from '@project/core';
import {Prisma} from "@prisma/client";

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public userId: string;
  public type: PostType;
  public payload: Prisma.JsonValue;
  public createdAt: Date;
  public publishedAt: Date;
  public status: PostStatus;
  public isRepost: boolean;
  public originalPostId?: string | null;

  constructor(post?: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? undefined;
    this.userId = post.userId;
    this.type = post.type;
    this.payload = post.payload;
    this.createdAt = post.createdAt ?? undefined;
    this.publishedAt = post.publishedAt;
    this.status = post.status;
    this.isRepost = post.isRepost ?? undefined;
    this.originalPostId = post.originalPostId ?? undefined;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      payload: this.payload,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
      status: this.status,
      isRepost: this.isRepost,
      originalPostId: this.originalPostId ?? undefined,
    };
  }
}
