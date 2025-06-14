import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl
} from 'class-validator';
import {
  TitleLength,
  PostValidateMessage
} from '../../blog-post.constant';

export class PhotoPayloadDto {
  @ApiProperty({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Мои зимние фотографии'
  })
  @IsString({ message: PostValidateMessage.TitleRequired })
  @MinLength(TitleLength.Min, {
    message: PostValidateMessage.TitleMinLengthNotValid
  })
  @MaxLength(TitleLength.Max, {
    message: PostValidateMessage.TitleMaxLengthNotValid
  })
  public title: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg'
  })
  @IsUrl({}, { message: PostValidateMessage.URLNotValid })
  public photoUrl: string;
}
