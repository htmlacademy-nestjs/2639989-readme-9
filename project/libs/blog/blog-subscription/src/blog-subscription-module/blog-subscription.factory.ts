import {Injectable} from '@nestjs/common';
import {BlogSubscriptionEntity} from './blog-subscription.entity';
import {EntityFactory, Subscription} from '@project/core';

@Injectable()
export class BlogSubscriptionFactory implements EntityFactory<BlogSubscriptionEntity> {
  public create(subscription: Subscription): BlogSubscriptionEntity {
    return new BlogSubscriptionEntity(subscription);
  }
}
