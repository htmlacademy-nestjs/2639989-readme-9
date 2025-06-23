import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Query,
  Req,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { ApplicationServiceURL } from './app.config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import {CreateBlogSubscriptionDto} from "@project/blog-subscription";

@ApiTags('Subscriptions Gateway')
@Controller('subscriptions')
@UseFilters(AxiosExceptionFilter)
export class SubscriptionsController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to user' })
  @ApiBody({ type: CreateBlogSubscriptionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription created'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already subscribed'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found'
  })
  async subscribe(
    @Req() req: Request,
    @Body() dto: CreateBlogSubscriptionDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Subscriptions}/`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/follower/:followerId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscriptions' })
  @ApiParam({ name: 'followerId', description: 'Follower user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscriptions list',
    type: [Object]
  })
  async getSubscriptionsByFollower(
    @Req() req: Request,
    @Param('followerId') followerId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Subscriptions}/follower/${followerId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/following/:followingId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user followers' })
  @ApiParam({ name: 'followingId', description: 'Following user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Followers list',
    type: [Object]
  })
  async getFollowersOfUser(
    @Req() req: Request,
    @Param('followingId') followingId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Subscriptions}/following/${followingId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/:followerId/:followingId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check subscription status' })
  @ApiParam({ name: 'followerId', description: 'Follower user ID' })
  @ApiParam({ name: 'followingId', description: 'Following user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription status',
    type: Object
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subscription not found'
  })
  async getSubscription(
    @Req() req: Request,
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Subscriptions}/${followerId}/${followingId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Delete('/:followerId/:followingId')
  @UseGuards(CheckAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe from user' })
  @ApiParam({ name: 'followerId', description: 'Follower user ID' })
  @ApiParam({ name: 'followingId', description: 'Following user ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Subscription removed'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subscription not found'
  })
  async unsubscribe(
    @Req() req: Request,
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string
  ) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Subscriptions}/${followerId}/${followingId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
  }

  @Get('/feed/:userId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user feed based on subscriptions' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feed posts',
    type: [Object]
  })
  async getUserFeed(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Query() query: any
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Subscriptions}/feed/${userId}`,
      {
        params: query,
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }
}
