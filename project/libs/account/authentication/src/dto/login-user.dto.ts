import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  public email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Ivanov'
  })
  public password: string;
}
