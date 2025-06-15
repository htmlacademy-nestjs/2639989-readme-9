import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {AuthenticationUserNameLength, PostValidateMessage, TextLength} from '../../blog-post.constant';

export class UpdateQuotePayloadDto {
  @ApiPropertyOptional({
    minLength: TextLength.QuoteMin,
    maxLength: TextLength.QuoteMax,
    example: 'Обновленная цитата'
  })
  @IsOptional()
  @IsString()
  @MinLength(TextLength.QuoteMin, {
    message: PostValidateMessage.QuoteMinLengthNotValid
  })
  @MaxLength(TextLength.QuoteMax, {
    message: PostValidateMessage.QuoteMinLengthNotValid
  })
  text?: string;

  @ApiPropertyOptional({
    minLength: AuthenticationUserNameLength.Min,
    maxLength: AuthenticationUserNameLength.Max,
    example: 'Новый автор'
  })
  @IsOptional()
  @IsString()
  @MinLength(AuthenticationUserNameLength.Min, {
    message: PostValidateMessage.QuoteAuthorMinLengthNotValid
  })
  @MaxLength(AuthenticationUserNameLength.Max, {
    message: PostValidateMessage.QuoteAuthorMinLengthNotValid
  })
  author?: string;
}
