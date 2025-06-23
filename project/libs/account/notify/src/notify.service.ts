import {Inject, Injectable} from '@nestjs/common';
import {AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import {ConfigType} from '@nestjs/config';

import {RabbitRouting} from '@project/core';

import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {CreateNewsletterDto} from "./dto/create-newsletter.dto";
import {rabbitConfig} from "@project/account-config";

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbiOptions: ConfigType<typeof rabbitConfig>,
  ) {
  }

  public async addSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish(
      this.rabbiOptions.exchange,
      RabbitRouting.AddSubscriber,
      {...dto}
    );
  }

  public async registerSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish(
      this.rabbiOptions.exchange,
      RabbitRouting.Register,
      {...dto}
    );
  }

  public async changePassword(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish(
      this.rabbiOptions.exchange,
      RabbitRouting.ChangePassword,
      {...dto}
    );
  }

  public async sendNewsletter(dto: CreateNewsletterDto) {
    this.rabbitClient.publish(
      this.rabbiOptions.exchange,
      RabbitRouting.Newsletter,
      {...dto});
  }
}
