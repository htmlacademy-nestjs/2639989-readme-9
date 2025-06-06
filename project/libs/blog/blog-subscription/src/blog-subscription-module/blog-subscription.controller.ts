import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common';
import { fillDto } from '@project/helpers';
import { BlogSubscriptionService } from './blog-subscription.service';
import { CreateBlogSubscriptionDto } from './dto/create-blog-subscription.dto';
import { BlogSubscriptionRdo } from './rdo/blog-subscription.rdo';

@Controller('subscriptions')
export class BlogSubscriptionController {
  constructor(
    private readonly blogSubscriptionService: BlogSubscriptionService
  ) {}

  @Post('/')
  public async create(
    @Body() dto: CreateBlogSubscriptionDto
  ) {
    const newSub = await this.blogSubscriptionService.subscribe(dto);
    return fillDto(BlogSubscriptionRdo, newSub.toPOJO());
  }

  @Get('/follower/:followerId')
  public async findAllByFollower(
    @Param('followerId') followerId: string
  ) {
    const subs = await this.blogSubscriptionService.getSubscriptionsByFollower(followerId);
    return subs.map(item => fillDto(BlogSubscriptionRdo, item.toPOJO()));
  }

  @Get('/following/:followingId')
  public async findAllFollowers(
    @Param('followingId') followingId: string
  ) {
    const subs = await this.blogSubscriptionService.getFollowersOfUser(followingId);
    return subs.map(item => fillDto(BlogSubscriptionRdo, item.toPOJO()));
  }

  @Get('/:followerId/:followingId')
  public async findOne(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string
  ) {
    const sub = await this.blogSubscriptionService.getSubscription(followerId, followingId);
    return fillDto(BlogSubscriptionRdo, sub.toPOJO());
  }

  @Delete('/:followerId/:followingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string
  ) {
    await this.blogSubscriptionService.unsubscribe(followerId, followingId);
  }
}
