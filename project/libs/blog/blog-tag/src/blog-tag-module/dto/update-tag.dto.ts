import {ApiProperty} from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({
    description: 'Уникальное имя для тега',
    example: 'Книги'
  })
  public name: string;
}
