import { Entity, StorableEntity } from '@project/core';
import { Subscription } from '@project/core';

export class BlogSubscriptionEntity extends Entity implements StorableEntity<Subscription> {
  public followerId!: string;
  public followingId!: string;

  constructor(subscription?: Subscription) {
    super();
    this.populate(subscription);
  }

  public populate(subscription?: Subscription) {
    if (!subscription) {
      return;
    }
    this.followerId = subscription.followerId;
    this.followingId = subscription.followingId;
    this.id = `${subscription.followerId}_${subscription.followingId}`;
  }

  public toPOJO(): Subscription {
    return {
      followerId: this.followerId,
      followingId: this.followingId
    };
  }
}
