import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionEntity } from './blog-subscription.entity';
import { CreateBlogSubscriptionDto } from './dto/create-blog-subscription.dto';

@Injectable()
export class BlogSubscriptionService {
  constructor(
    private readonly blogSubscriptionRepository: BlogSubscriptionRepository
  ) {}

  public async subscribe(dto: CreateBlogSubscriptionDto): Promise<BlogSubscriptionEntity> {
    try {
      const entity = new BlogSubscriptionEntity({
        followerId: dto.followerId,
        followingId: dto.followingId
      });

      await this.blogSubscriptionRepository.save(entity);

      return entity;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Не удалось оформить подписку');
    }
  }

  public async unsubscribe(followerId: string, followingId: string): Promise<void> {
    try {
      await this.blogSubscriptionRepository.delete(followerId, followingId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Не удалось отменить подписку');
    }
  }

  public async getSubscription(followerId: string, followingId: string): Promise<BlogSubscriptionEntity> {
    return this.blogSubscriptionRepository.find(followerId, followingId);
  }

  public async getSubscriptionsByFollower(followerId: string): Promise<BlogSubscriptionEntity[]> {
    return this.blogSubscriptionRepository.findAllByFollower(followerId);
  }

  public async getFollowersOfUser(followingId: string): Promise<BlogSubscriptionEntity[]> {
    return this.blogSubscriptionRepository.findAllByFollowing(followingId);
  }
}
