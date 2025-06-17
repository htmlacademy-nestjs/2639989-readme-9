import {
  Controller,
  Post,
  UseGuards,
  HttpStatus, Param
} from '@nestjs/common';
import {UserDecorator} from "@project/core";
import {JwtAuthGuard} from "@project/authentication";
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {BlogSubscriptionService} from "@project/blog-subscription";

@ApiTags('Notify')
@Controller('notify')
export class NotifyController {
  constructor(
    private readonly subscribeService: BlogSubscriptionService
  ) {}

  @Post('send/:startDate')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Рассылка новых публикаций успешно запущена'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Требуется аутентификация'
  })
  public async send(
    @UserDecorator('sub') userId: string,
    @Param('startDate') startDate: Date
  ) {
    return this.subscribeService.sendNewsletter(userId, startDate);
  }
}
