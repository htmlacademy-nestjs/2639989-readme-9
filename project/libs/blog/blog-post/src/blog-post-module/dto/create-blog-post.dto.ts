import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {PhotoPayloadDto} from './payloads/photo-payload.dto';
import {LinkPayloadDto} from './payloads/link-payload.dto';
import {QuotePayloadDto} from './payloads/quote-payload.dto';
import {TextPayloadDto} from './payloads/text-payload.dto';
import {VideoPayloadDto} from './payloads/video-payload.dto';
import {
  AvailablePostStatus,
  AvailablePostType,
  MAX_TAGS_PER_POST,
  PostValidateMessage,
  TAG_REGEX,
  TagLength
} from '../blog-post.constant';
import {PostStatus, PostType} from "@project/core";

export class CreateBlogPostDto {
  @ApiProperty({
    enum: AvailablePostType,
    example: 'TEXT'
  })
  @IsEnum(AvailablePostType, {
    message: PostValidateMessage.TypeNotValid
  })
  public type: PostType;

  @ApiProperty()
  @ValidateNested()
  @Type(({object}) => {
    switch (object?.type) {
      case AvailablePostType.TEXT:
        return TextPayloadDto;
      case AvailablePostType.VIDEO:
        return VideoPayloadDto;
      case AvailablePostType.QUOTE:
        return QuotePayloadDto;
      case AvailablePostType.PHOTO:
        return PhotoPayloadDto;
      case AvailablePostType.LINK:
        return LinkPayloadDto;
      default:
        return TextPayloadDto;
    }
  })
  public payload: any;

  @ApiPropertyOptional({
    enum: AvailablePostStatus,
    default: AvailablePostStatus.PUBLISHED
  })
  @IsEnum(AvailablePostStatus, {
    message: PostValidateMessage.StatusNotValid
  })
  @IsOptional()
  public status: PostStatus = AvailablePostStatus.PUBLISHED;

  @ApiPropertyOptional({
    example: ['tech', 'programming']
  })
  @IsArray()
  @IsString({each: true, message: PostValidateMessage.TagNotString})
  @IsOptional()
  @ArrayMaxSize(MAX_TAGS_PER_POST, {
    message: PostValidateMessage.TooManyTags
  })
  @Matches(TAG_REGEX, {
    each: true,
    message: PostValidateMessage.TagPatternNotValid
  })
  @MinLength(TagLength.Min, {
    each: true,
    message: PostValidateMessage.TagMinLengthNotValid
  })
  @MaxLength(TagLength.Max, {
    each: true,
    message: PostValidateMessage.TagMaxLengthNotValid
  })
  public tags?: string[];

  @ApiPropertyOptional({default: false})
  @IsBoolean()
  @IsOptional()
  public isRepost?: boolean = false;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public originalPostId?: string;
}
