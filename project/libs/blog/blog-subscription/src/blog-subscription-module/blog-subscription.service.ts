import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {BlogSubscriptionRepository} from './blog-subscription.repository';
import {BlogSubscriptionEntity} from './blog-subscription.entity';
import {CreateBlogSubscriptionDto} from './dto/create-blog-subscription.dto';
import {NotifyService} from "@project/account-notify";
import {BlogPostService} from "@project/blog-post";
import {AuthenticationService} from '@project/authentication';

@Injectable()
export class BlogSubscriptionService {
  constructor(
    private readonly blogSubscriptionRepository: BlogSubscriptionRepository,
    private readonly blogPostService: BlogPostService,
    private readonly userService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {
  }

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

  public async sendNewsletter(userId: string, startDate: Date) {
    const subscriptions = await this.blogSubscriptionRepository.findAllByFollower(userId);
    const authorIds = subscriptions.map(sub => sub.followingId);

    const newPosts = [];
    for (const author of authorIds) {
      const authorPosts = await this.blogPostService.getPostsByPeriod(
        startDate ? new Date(startDate) : this.getDefaultStartDate(),
        author
      );
      newPosts.push(...authorPosts);
    }

    const user = await this.userService.getUser(userId);

    await this.notifyService.sendNewsletter({
      user: user,
      posts: newPosts,
      created: new Date()
    });

    return {success: true, count: newPosts.length};
  }

  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }
}
