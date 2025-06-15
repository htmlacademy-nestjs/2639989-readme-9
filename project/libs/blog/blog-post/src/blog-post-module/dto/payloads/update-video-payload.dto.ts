import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength} from 'class-validator';
import {PostValidateMessage, TitleLength, VideoValidation} from '../../blog-post.constant';

export class UpdateVideoPayloadDto {
  @ApiPropertyOptional({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Новое название видео'
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
    example: 'https://youtube.com/watch?v=новое_видео'
  })
  @IsOptional()
  @IsUrl()
  @Matches(VideoValidation.YoutubeRegex, {
    message: PostValidateMessage.YouTubeURLNotValid
  })
  videoUrl?: string;
}
