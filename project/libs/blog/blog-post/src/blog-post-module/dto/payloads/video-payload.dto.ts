import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  Matches
} from 'class-validator';
import {
  TitleLength,
  VideoValidation,
  PostValidateMessage
} from '../../blog-post.constant';

export class VideoPayloadDto {
  @ApiProperty({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Обзор нового JavaScript фреймворка'
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
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
  @IsUrl({}, { message: PostValidateMessage.URLNotValid })
  @Matches(VideoValidation.YoutubeRegex, {
    message: PostValidateMessage.YouTubeURLNotValid
  })
  public videoUrl: string;
}
