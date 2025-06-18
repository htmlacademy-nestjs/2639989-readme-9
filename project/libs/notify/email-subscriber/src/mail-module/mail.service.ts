import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import {Newsletter, Subscriber} from '@project/core';
import { NotifyConfig } from '@project/notify-config';

import {
  EMAIL_ADD_SUBSCRIBER_SUBJECT,
  EMAIL_DIGEST_SUBJECT,
  EMAIL_PASSWORD_CHANGE_SUBJECT,
  EMAIL_REGISTER_SUBJECT
} from './mail.constant';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof NotifyConfig>

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: subscriber
    })
  }

  public async sendNotifyRegister(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_REGISTER_SUBJECT,
      template: './register',
      context: subscriber
    })
  }

  public async sendNotifyChangePassword(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_PASSWORD_CHANGE_SUBJECT,
      template: './change-password',
      context: subscriber
    })
  }

  public async sendNotifyNewsletter(newsletter: Newsletter) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: newsletter.user.email,
      subject: EMAIL_DIGEST_SUBJECT,
      template: './newsletter',
      context: newsletter
    })
  }
}
