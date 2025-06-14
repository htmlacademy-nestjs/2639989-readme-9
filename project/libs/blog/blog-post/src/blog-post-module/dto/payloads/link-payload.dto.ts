import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsString,
  MaxLength,
  IsOptional
} from 'class-validator';
import {
  PostValidateMessage, TextLength
} from '../../blog-post.constant';

export class LinkPayloadDto {
  @ApiProperty({
    example: 'https://example.com/article'
  })
  @IsUrl({}, { message: PostValidateMessage.URLNotValid })
  public url: string;

  @ApiProperty({
    required: false,
    example: 'Интересная статья о Node.js',
    maxLength: TextLength.LinkDescMax
  })
  @IsString()
  @IsOptional()
  @MaxLength(TextLength.LinkDescMax, {
    message: PostValidateMessage.DescriptionMaxLengthNotValid
  })
  public description?: string;
}
