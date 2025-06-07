import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { Subscription } from '@project/core';
import { BasePostgresRepository } from '@project/data-access';

import { BlogSubscriptionEntity } from './blog-subscription.entity';
import { BlogSubscriptionFactory } from './blog-subscription.factory';

@Injectable()
export class BlogSubscriptionRepository extends BasePostgresRepository<BlogSubscriptionEntity, Subscription> {
  constructor(
    entityFactory: BlogSubscriptionFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async find(followerId: string, followingId: string): Promise<BlogSubscriptionEntity> {
    const found = await this.client.subscription.findUnique({
      where: {
        followerId_followingId: { followerId, followingId }
      }
    });
    if (!found) {
      throw new NotFoundException(`Подписка от пользователя ${followerId} на ${followingId} не найдена`);
    }
    return this.createEntityFromDocument(found);
  }

  public async findAllByFollower(followerId: string): Promise<BlogSubscriptionEntity[]> {
    const raw = await this.client.subscription.findMany({
      where: { followerId }
    });
    return raw.map(item => this.entityFactory.create(item));
  }

  public async findAllByFollowing(followingId: string): Promise<BlogSubscriptionEntity[]> {
    const raw = await this.client.subscription.findMany({
      where: { followingId }
    });
    return raw.map(item => this.entityFactory.create(item));
  }

  public async save(entity: BlogSubscriptionEntity): Promise<void> {
    try {
      await this.client.subscription.create({
        data: {
          followerId:  entity.followerId,
          followingId: entity.followingId
        }
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException(`Пользователь ${entity.followerId} уже подписан на ${entity.followingId}`);
      }
      throw e;
    }
  }

  public async delete(followerId: string, followingId: string): Promise<void> {
    await this.find(followerId, followingId);
    await this.client.subscription.delete({
      where: {
        followerId_followingId: { followerId, followingId }
      }
    });
  }
}
