import {Entity, StorableEntity, Subscription} from '@project/core';

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
  }

  public toPOJO(): Subscription {
    return {
      followerId: this.followerId,
      followingId: this.followingId
    };
  }
}
