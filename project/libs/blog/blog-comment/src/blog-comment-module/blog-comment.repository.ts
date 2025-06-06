import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { Comment } from '@project/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentFactory } from './blog-comment.factory';
import { BlogCommentFilter, commentFilterToPrismaFilter } from './blog-comment.filter';

@Injectable()
export class BlogCommentRepository extends BasePostgresRepository<BlogCommentEntity, Comment> {
  constructor(
    entityFactory: BlogCommentFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async findById(commentId: string): Promise<BlogCommentEntity> {
    const found = await this.client.comment.findUnique({
      where: { id: commentId }
    });

    if (!found) {
      throw new NotFoundException(`Комментарий с ID ${commentId} не найден`);
    }
    return this.createEntityFromDocument(found);
  }

  public async findByPostId(filter: BlogCommentFilter): Promise<BlogCommentEntity[]> {
    const prismaFilter = commentFilterToPrismaFilter(filter);
    const rawComments = await this.client.comment.findMany({
      where: { postId: prismaFilter.postId },
      orderBy: { createdAt: 'desc' },
      take: prismaFilter.take,
      skip: prismaFilter.skip
    });
    return rawComments.map((item) => this.createEntityFromDocument(item));
  }

  public async save(entity: BlogCommentEntity): Promise<void> {
    const { userId, postId, text } = entity.toPOJO();

    const record = await this.client.comment.create({
      data: {
        userId,
        text,
        post: {
          connect: { id: postId }
        }
      }
    });

    entity.id = record.id;
    entity.createdAt = record.createdAt;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({
      where: {
        id,
      }
    });
  }

  public async update(entity: BlogCommentEntity): Promise<void> {
    await this.client.comment.update({
      where: {id: entity.id},
      data: {
        text: entity.text,
      }
    });
  }

  public async ensureOwnsComment(commentId: string, userId: string): Promise<void> {
    const exists = await this.client.comment.findFirst({
      where: { id: commentId, userId }
    });
    if (!exists) {
      throw new ForbiddenException(`Вы не можете изменить/удалить этот комментарий`);
    }
  }
}
