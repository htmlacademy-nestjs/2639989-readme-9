import { Module } from '@nestjs/common';
import { BlogSubscriptionController } from './blog-subscription.controller';
import { BlogSubscriptionService } from './blog-subscription.service';
import { BlogSubscriptionRepository } from './blog-subscription.repository';
import { BlogSubscriptionFactory } from './blog-subscription.factory';
import { PrismaClientModule } from '@project/blog-models';

@Module({
  imports: [PrismaClientModule],
  controllers: [BlogSubscriptionController],
  providers: [
    BlogSubscriptionFactory,
    BlogSubscriptionRepository,
    BlogSubscriptionService
  ],
  exports: [BlogSubscriptionService]
})
export class BlogSubscriptionModule {}
