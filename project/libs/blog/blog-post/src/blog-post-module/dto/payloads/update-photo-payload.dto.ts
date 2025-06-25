import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString, IsUrl, MaxLength, MinLength} from 'class-validator';
import {PostValidateMessage, TitleLength} from '../../blog-post.constant';

export class UpdatePhotoPayloadDto {
  @ApiPropertyOptional({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Новый заголовок фото'
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
}
