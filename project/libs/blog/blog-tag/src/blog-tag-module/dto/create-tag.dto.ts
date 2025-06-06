import {ApiProperty} from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Уникальное имя для тега',
    example: 'Книги'
  })
  public name: string;
}
