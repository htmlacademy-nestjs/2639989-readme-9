import {Expose} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class LoggedUserRdo {

  @ApiProperty({
    description: 'Уникальный id пользователя',
    example: '134ce8babd-cc30-4805-9b12-d9420398e7c5',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'Токен доступа пользователя',
    example: 'user@user.local'
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'Токен обновления пользователя',
  })
  @Expose()
  public refreshToken: string;
}
