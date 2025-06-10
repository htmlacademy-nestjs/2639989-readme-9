import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength
} from 'class-validator';
import {
  TagValidation,
  TagValidateMessage
} from '../blog-tag.constant';

export class CreateTagDto {
  @ApiProperty({
    description: 'Уникальное имя для тега',
    example: 'книги'
  })
  @IsString({ message: TagValidateMessage.MustBeString })
  @IsNotEmpty({ message: TagValidateMessage.Required })
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
