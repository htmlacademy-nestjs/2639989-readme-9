import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';
import {
  TitleLength,
  PostValidateMessage, TextLength
} from '../../blog-post.constant';

export class UpdateTextPayloadDto {
  @ApiPropertyOptional({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Обновленный заголовок'
  })
  @IsOptional()
  @IsString()
  @MinLength(TitleLength.Min, {
    message: PostValidateMessage.TitleMinLengthNotValid
  })
  @MaxLength(TitleLength.Max, {
    message: PostValidateMessage.TitleMaxLengthNotValid
  })
  title?: string;

  @ApiPropertyOptional({
    minLength: TextLength.AnnounceMin,
    maxLength: TextLength.AnnounceMax,
    example: 'Обновленный анонс статьи'
  })
  @IsOptional()
  @IsString()
  @MinLength(TextLength.AnnounceMin, {
    message: PostValidateMessage.AnnounceMinLengthNotValid
  })
  @MaxLength(TextLength.AnnounceMax, {
    message: PostValidateMessage.AnnounceMinLengthNotValid
  })
  announce?: string;

  @ApiPropertyOptional({
    minLength: TextLength.TextMin,
    maxLength: TextLength.TextMax,
    example: 'Обновленный текст публикации...'
  })
  @IsOptional()
  @IsString()
  @MinLength(TextLength.TextMin, {
    message: PostValidateMessage.TextMinLengthNotValid
  })
  @MaxLength(TextLength.TextMax, {
    message: PostValidateMessage.TextMinLengthNotValid
  })
  text?: string;
}
