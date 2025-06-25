import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUrl, MaxLength, MinLength} from 'class-validator';
import {PostValidateMessage, TitleLength} from '../../blog-post.constant';

export class PhotoPayloadDto {
  @ApiProperty({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Мои зимние фотографии'
  })
  @IsString({message: PostValidateMessage.TitleRequired})
  @MinLength(TitleLength.Min, {
    message: PostValidateMessage.TitleMinLengthNotValid
  })
  @MaxLength(TitleLength.Max, {
    message: PostValidateMessage.TitleMaxLengthNotValid
  })
  public title: string;
}
