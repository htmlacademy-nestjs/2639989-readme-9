import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {
  AuthenticationUserPasswordLength,
  AuthenticationValidateMessage
} from "../authentication-module/authentication.constant";

export class LoginUserDto {

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  @IsNotEmpty({message: AuthenticationValidateMessage.EmailRequired})
  public email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Ivanov'
  })
  @IsString({message: AuthenticationValidateMessage.PasswordNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.PasswordRequired})
  @Length(AuthenticationUserPasswordLength.Min, AuthenticationUserPasswordLength.Max,
    {message: AuthenticationValidateMessage.PasswordLengthNotValid})
  public password: string;
}
