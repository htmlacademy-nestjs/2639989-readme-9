import {ApiProperty} from '@nestjs/swagger';
import {IsDate} from 'class-validator';

export class SendNewsletterDto {
  @ApiProperty({
    description: 'Начальная дата для выборки публикаций (опционально)',
    example: '2025-01-01'
  })
  @IsDate()
  public startDate: Date;
}
