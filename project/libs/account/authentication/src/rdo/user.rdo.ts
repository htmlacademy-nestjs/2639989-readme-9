import { Expose } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class UserRdo {

  @ApiProperty({
    description: 'Уникальный id пользователя',
    example: '134ce8babd-cc30-4805-9b12-d9420398e7c5',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Путь до аватара пользователя',
    example: 'images/user.png',
  })
  @Expose()
  public avatar: string;

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  public email: string;

  @ApiProperty({
    description: 'Дата создания аккаунта пользователя',
    example: '1981-03-12',
  })
  public dateOfBirth: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Keks',
  })
  public firstname: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Ivanov'
  })
  public lastname: string;
}
