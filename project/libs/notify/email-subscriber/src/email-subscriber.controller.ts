import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { RabbitRouting } from '@project/core';
import {getConfig} from "@project/notify-config";
import {CreateNewsletterDto} from "./dto/create-newsletter.dto";
import { MailService } from './mail-module/mail.service';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: getConfig().rabbit.exchange,
    routingKey: RabbitRouting.AddSubscriber,
    queue: getConfig().rabbit.queue,
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: getConfig().rabbit.exchange,
    routingKey: RabbitRouting.Register,
    queue: getConfig().rabbit.queue,
  })
  public async register(subscriber: CreateSubscriberDto) {
    this.mailService.sendNotifyRegister(subscriber);
  }

  @RabbitSubscribe({
    exchange: getConfig().rabbit.exchange,
    routingKey: RabbitRouting.ChangePassword,
    queue: getConfig().rabbit.queue,
  })
  public async changePassword(subscriber: CreateSubscriberDto) {
    this.mailService.sendNotifyChangePassword(subscriber);
  }

  @RabbitSubscribe({
    exchange: getConfig().rabbit.exchange,
    routingKey: RabbitRouting.Newsletter,
    queue: getConfig().rabbit.queue,
  })
  public async newsletter(newsletter: CreateNewsletterDto) {
    const isSubscriber = await this.subscriberService.checkSubscriber(newsletter.user.email);
    if(isSubscriber) {
      this.mailService.sendNotifyNewsletter(newsletter);
    }
  }
}
