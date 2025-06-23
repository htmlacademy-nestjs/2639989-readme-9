import {IsNotEmpty, IsString, Length} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {
  AuthenticationUserPasswordLength,
  AuthenticationValidateMessage
} from "../authentication-module/authentication.constant";

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Текущий пароль пользователя',
    example: 'oldPassword123'
  })
  @IsString({message: AuthenticationValidateMessage.PasswordNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.PasswordRequired})
  @Length(AuthenticationUserPasswordLength.Min, AuthenticationUserPasswordLength.Max,
    {message: AuthenticationValidateMessage.PasswordLengthNotValid})
  public currentPassword!: string;

  @ApiProperty({
    description: 'Новый пароль пользователя',
    example: 'newSecurePassword456'
  })
  @IsString({message: AuthenticationValidateMessage.PasswordNotValid})
  @IsNotEmpty({message: AuthenticationValidateMessage.PasswordRequired})
  @Length(AuthenticationUserPasswordLength.Min, AuthenticationUserPasswordLength.Max,
    {message: AuthenticationValidateMessage.PasswordLengthNotValid})
  public newPassword!: string;
}
