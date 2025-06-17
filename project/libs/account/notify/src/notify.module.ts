import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { getRabbitMQOptions } from '@project/helpers';

import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(
      getRabbitMQOptions('rabbit')
    )
  ],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule {}
