import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";
import {AuthenticationValidateMessage} from "../authentication-module/authentication.constant";

export class LoginUserDto {

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Ivanov'
  })
  @IsString({})
  public password: string;
}
