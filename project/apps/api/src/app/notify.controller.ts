import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseFilters,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { ApplicationServiceURL } from './app.config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import {CreateNewsletterDto, CreateSubscriberDto} from '@project/email-subscriber';

@ApiTags('Notifications Gateway')
@Controller('notify')
@UseFilters(AxiosExceptionFilter)
export class NotifyController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('/subscribe')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to email notifications' })
  @ApiBody({ type: CreateSubscriberDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription created'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already subscribed'
  })
  async addSubscriber(
    @Req() req: Request,
    @Body() dto: CreateSubscriberDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/subscribe`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Post('/unsubscribe')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe from email notifications' })
  @ApiBody({ type: CreateSubscriberDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription removed'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subscription not found'
  })
  async removeSubscriber(
    @Req() req: Request,
    @Body() dto: CreateSubscriberDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/unsubscribe`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/subscriptions/:userId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscriptions status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription status',
    type: Object
  })
  async getSubscriptionStatus(
    @Req() req: Request,
    @Param('userId') userId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Notify}/subscriptions/${userId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Post('/send-newsletter')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send newsletter to subscribers' })
  @ApiBody({ type: CreateNewsletterDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Newsletter sent'
  })
  async sendNewsletter(
    @Req() req: Request,
    @Body() dto: CreateNewsletterDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/send-newsletter`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Post('/internal/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Internal: Send registration email' })
  @ApiBody({ type: CreateSubscriberDto })
  async internalRegister(
    @Body() dto: CreateSubscriberDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/internal/register`,
      dto
    );
    return data;
  }

  @Post('/internal/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Internal: Send password change email' })
  @ApiBody({ type: CreateSubscriberDto })
  async internalChangePassword(
    @Body() dto: CreateSubscriberDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/internal/change-password`,
      dto
    );
    return data;
  }
}
