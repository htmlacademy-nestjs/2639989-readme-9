import {Module} from '@nestjs/common';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';

import {getRabbitMQOptions} from '@project/helpers';

import {NotifyService} from './notify.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(
      getRabbitMQOptions('rabbit')
    )
  ],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule {
}
