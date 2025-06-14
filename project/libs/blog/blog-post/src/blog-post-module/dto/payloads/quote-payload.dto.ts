import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';
import {
  AuthenticationUserNameLength,
  PostValidateMessage
} from '../../blog-post.constant';
import {TextLength} from "../../blog-post.constant";

export class QuotePayloadDto {
  @ApiProperty({
    minLength: TextLength.QuoteMin,
    maxLength: TextLength.QuoteMax,
    example: 'Программирование — это разбиение чего-то большого и невозможного на что-то маленькое и реальное.'
  })
  @IsString({ message: PostValidateMessage.PayloadRequired })
  @MinLength(TextLength.QuoteMin, {
    message: PostValidateMessage.QuoteMinLengthNotValid
  })
  @MaxLength(TextLength.QuoteMax, {
    message: PostValidateMessage.QuoteMinLengthNotValid
  })
  public text: string;

  @ApiProperty({
    minLength: AuthenticationUserNameLength.Min,
    maxLength: AuthenticationUserNameLength.Max,
    example: 'Jazzwant'
  })
  @IsString({ message: PostValidateMessage.PayloadRequired })
  @MinLength(AuthenticationUserNameLength.Min, {
    message: PostValidateMessage.QuoteAuthorMinLengthNotValid
  })
  @MaxLength(AuthenticationUserNameLength.Max, {
    message: PostValidateMessage.QuoteAuthorMinLengthNotValid
  })
  public author: string;
}
