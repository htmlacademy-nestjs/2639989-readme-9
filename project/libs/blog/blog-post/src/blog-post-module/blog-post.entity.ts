import {Entity, Post, PostStatus, PostType, StorableEntity} from '@project/core';
import {BlogLikeEntity, BlogLikeFactory} from "@project/blog-like";

import {Prisma} from "@prisma/client";
import {BlogCommentEntity, BlogCommentFactory} from "@project/blog-comment";
import {BlogTagEntity, BlogTagFactory} from "@project/blog-tag";
import { AvailablePostStatus } from './blog-post.constant';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public authorId!: string;
  public type!: PostType;
  public payload!: Record<string, any>;
  public createdAt!: Date;
  public publishedAt?: Date | null;
  public status!: PostStatus;
  public isRepost!: boolean;
  public originalPostId?: string | null;
  public tags: BlogTagEntity[] = [];
  public likes: BlogLikeEntity[] = [];
  public comments: BlogCommentEntity[] = [];

  constructor(post?: Post) {
    super();
    if (post) {
      this.populate(post);
    } else {
      this.createdAt = new Date();
      this.status = AvailablePostStatus.PUBLISHED;
      this.isRepost = false;
      this.publishedAt = null;
    }
  }

  public populate(post: Post): void {
    this.id = post.id ?? '';
    this.authorId = post.userId;
    this.type = post.type;
    this.payload = post.payload as Record<string, any>;
    this.createdAt = post.createdAt ?? new Date();
    this.publishedAt = post.publishedAt ?? null;
    this.status = post.status;
    this.isRepost = post.isRepost ?? false;
    this.originalPostId = post.originalPostId ?? null;
    this.tags = [];
    this.likes = [];
    this.comments = [];

    const blogCommentFactory = new BlogCommentFactory();
    for (const comment of post.comments) {
      const blogCommentEntity = blogCommentFactory.create(comment);
      this.comments.push(blogCommentEntity);
    }

    const blogTagFactory = new BlogTagFactory();
    for (const tag of post.tags) {
      const blogTagEntity = blogTagFactory.create(tag);
      this.tags.push(blogTagEntity);
    }

    const blogLikeFactory = new BlogLikeFactory();
    for (const like of post.likes) {
      const blogLikeEntity = blogLikeFactory.create(like);
      this.likes.push(blogLikeEntity);
    }
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      userId: this.authorId,
      type: this.type,
      payload: this.payload as Prisma.JsonValue,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
      status: this.status,
      isRepost: this.isRepost,
      originalPostId: this.originalPostId || null,

      tags: this.tags?.map(tag => tag.toPOJO()),
      likes: this.likes?.map(like => like.toPOJO()),
      comments: this.comments?.map(comment => comment.toPOJO()),
    };
  }
}
