import {ApiProperty} from '@nestjs/swagger';
import {
  AuthenticationUserNameLength,
  AuthenticationUserPasswordLength,
  AuthenticationValidateMessage
} from "../authentication-module/authentication.constant";
import {IsEmail, IsISO8601, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @IsEmail({}, {message: AuthenticationValidateMessage.EmailNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.EmailRequired})
  public avatar: string;

  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @IsEmail({}, {message: AuthenticationValidateMessage.EmailNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.EmailRequired})
  public email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Keks',
  })
  @IsString({message: AuthenticationValidateMessage.FirstNameLengthNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.FirstNameRequired})
  @Length(AuthenticationUserNameLength.Min, AuthenticationUserNameLength.Max,
    {message: AuthenticationValidateMessage.FirstNameLengthNotValid})
  public firstname: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Ivanov'
  })
  @IsString({message: AuthenticationValidateMessage.LastNameLengthNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.LastNameRequired})
  @Length(AuthenticationUserNameLength.Min, AuthenticationUserNameLength.Max,
    {message: AuthenticationValidateMessage.LastNameLengthNotValid})
  public lastname: string;

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
