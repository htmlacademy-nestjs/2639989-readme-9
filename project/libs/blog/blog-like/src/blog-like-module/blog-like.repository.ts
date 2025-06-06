import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { Like } from '@project/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogLikeEntity } from './blog-like.entity';
import { BlogLikeFactory } from './blog-like.factory';

@Injectable()
export class BlogLikeRepository extends BasePostgresRepository<BlogLikeEntity, Like> {
  constructor(
    entityFactory: BlogLikeFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async findByUserAndPost(userId: string, postId: string): Promise<BlogLikeEntity> {
    const found = await this.client.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    if (!found) {
      throw new NotFoundException(`Лайк от пользователя ${userId} к публикации ${postId} не найден`);
    }
    return this.entityFactory.create(found);
  }

  public async findAllByPost(postId: string): Promise<BlogLikeEntity[]> {
    const rawLikes = await this.client.like.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }
    });
    return rawLikes.map(item => this.entityFactory.create(item));
  }

  public async create(entity: BlogLikeEntity): Promise<BlogLikeEntity> {
    try {
      const created = await this.client.like.create({
        data: {
          userId: entity.userId,
          post: {
            connect: { id: entity.postId }
          }
        }
      });
      return this.entityFactory.create(created);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException(`Пользователь ${entity.userId} уже лайкнул публикацию ${entity.postId}`);
      }
      throw e;
    }
  }

  public async deleteByUserAndPost(userId: string, postId: string): Promise<void> {
    await this.findByUserAndPost(userId, postId);
    await this.client.like.delete({
      where: {
        userId_postId: { userId, postId }
      }
    });
  }
}
