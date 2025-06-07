import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { Post } from '@project/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostFilter, postFilterToPrismaFilter } from './blog-post.filter';
import { MAX_POSTS_LIMIT } from './blog-post.constant';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<BlogPostEntity, Post> {
  constructor(
    entityFactory: BlogPostFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async find(filter?: BlogPostFilter): Promise<BlogPostEntity[]> {
    const where = filter ? postFilterToPrismaFilter(filter) : undefined;

    const records = await this.client.post.findMany({
      where,
      take: MAX_POSTS_LIMIT,
      orderBy: { createdAt: 'desc' }
    });

    return records.map((record) => this.createEntityFromDocument(record));
  }

  public async findById(id: string): Promise<BlogPostEntity> {
    const record = await this.client.post.findUnique({
      where: { id }
    });

    if (!record) {
      throw new NotFoundException(`Пост с id ${id} не найден.`);
    }

    return this.createEntityFromDocument(record);
  }

  public async save(postEntity: BlogPostEntity): Promise<void> {
    try {
      const data: Prisma.PostCreateInput = {
        userId:       postEntity.userId,
        type:         postEntity.type,
        payload:      postEntity.payload,
        publishedAt:  postEntity.publishedAt,
        status:       postEntity.status,
        isRepost:     postEntity.isRepost,
        originalPost: postEntity.originalPostId
          ? { connect: { id: postEntity.originalPostId } }
          : undefined,
      };

      const created = await this.client.post.create({ data });

      postEntity.id = created.id;
      postEntity.createdAt = created.createdAt;
    } catch (err) {
      throw err;
    }
  }

  public async update(postEntity: BlogPostEntity): Promise<void> {
    try {
      const data: Prisma.PostCreateInput = {
        id:           postEntity.id,
        userId:       postEntity.userId,
        type:         postEntity.type,
        payload:      postEntity.payload,
        createdAt:    postEntity.createdAt,
        publishedAt:  postEntity.publishedAt,
        status:       postEntity.status,
        isRepost:     postEntity.isRepost,
        originalPost: postEntity.originalPostId
          ? { connect: { id: postEntity.originalPostId } }
          : undefined,
      };

      await this.client.post.update({
        where: { id: postEntity.id },
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      console.log(id);
      await this.client.post.delete({
        where: { id }
      });
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`Пост с id ${id} не найден.`);
    }
  }

  public async findByIds(ids: string[]): Promise<BlogPostEntity[]> {
    const records = await this.client.post.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    return records.map((record) => this.createEntityFromDocument(record));
  }
}
