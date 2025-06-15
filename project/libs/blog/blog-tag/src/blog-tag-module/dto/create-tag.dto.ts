import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {TagValidateMessage, TagValidation} from '../blog-tag.constant';

export class CreateTagDto {
  @ApiProperty({
    description: 'Уникальное имя для тега',
    example: 'книги'
  })
  @IsString({message: TagValidateMessage.MustBeString})
  @IsNotEmpty({message: TagValidateMessage.Required})
  @MinLength(TagValidation.MIN_LENGTH, {
    message: TagValidateMessage.TooShort
  })
  @MaxLength(TagValidation.MAX_LENGTH, {
    message: TagValidateMessage.TooLong
  })
  @Matches(TagValidation.REGEX, {
    message: TagValidateMessage.InvalidFormat
  })
  public name: string;
}
