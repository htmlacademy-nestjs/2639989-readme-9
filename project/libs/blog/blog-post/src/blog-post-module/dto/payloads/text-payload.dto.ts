import {ApiProperty} from '@nestjs/swagger';
import {IsString, MaxLength, MinLength} from 'class-validator';
import {PostValidateMessage, TextLength, TitleLength} from '../../blog-post.constant';

export class TextPayloadDto {
  @ApiProperty({
    minLength: TitleLength.Min,
    maxLength: TitleLength.Max,
    example: 'Почему SOLID - это важно'
  })
  @IsString({message: PostValidateMessage.TitleRequired})
  @MinLength(TitleLength.Min, {
    message: PostValidateMessage.TitleMinLengthNotValid
  })
  @MaxLength(TitleLength.Max, {
    message: PostValidateMessage.TitleMaxLengthNotValid
  })
  public title: string;

  @ApiProperty({
    minLength: TextLength.AnnounceMin,
    maxLength: TextLength.AnnounceMax,
    example: 'Основные принципы SOLID разработки'
  })
  @IsString({message: PostValidateMessage.PayloadRequired})
  @MinLength(TextLength.AnnounceMin, {
    message: PostValidateMessage.AnnounceMinLengthNotValid
  })
  @MaxLength(TextLength.AnnounceMax, {
    message: PostValidateMessage.AnnounceMinLengthNotValid
  })
  public announce: string;

  @ApiProperty({
    minLength: TextLength.TextMin,
    maxLength: TextLength.TextMax,
    example: 'Принцип единственной ответственности гласит...'
  })
  @IsString({message: PostValidateMessage.PayloadRequired})
  @MinLength(TextLength.TextMin, {
    message: PostValidateMessage.TextMinLengthNotValid
  })
  @MaxLength(TextLength.TextMax, {
    message: PostValidateMessage.TextMinLengthNotValid
  })
  public text: string;
}
