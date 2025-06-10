import {ApiProperty} from '@nestjs/swagger';
import {AuthenticationValidateMessage} from "../authentication-module/authentication.constant";
import {IsEmail, IsISO8601, IsString} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'Уникальный адрес пользователя',
    example: 'user@user.ru'
  })
  @IsEmail({}, { message: AuthenticationValidateMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'Дата создания аккаунта пользователя',
    example: '1981-03-12',
  })
  @IsISO8601({}, { message: AuthenticationValidateMessage.DateBirthNotValid })
  public dateOfBirth: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Keks',
  })
  @IsString({})
  public firstname: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Ivanov'
  })
  @IsString({})
  public lastname: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Ivanov'
  })
  @IsString({})
  public password: string;
}
