import {ApiProperty} from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Ivanov'
  })
  public password: string;
}
