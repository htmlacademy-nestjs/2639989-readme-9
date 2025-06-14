import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl
} from 'class-validator';
import {
  TitleLength,
  PostValidateMessage
} from '../../blog-post.constant';

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

  @ApiPropertyOptional({
    example: 'https://example.com/new-photo.jpg'
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}
