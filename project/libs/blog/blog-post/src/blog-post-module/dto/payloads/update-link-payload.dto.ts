import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsOptional, IsString, IsUrl, MaxLength} from 'class-validator';
import {PostValidateMessage, TextLength} from '../../blog-post.constant';

export class UpdateLinkPayloadDto {
  @ApiPropertyOptional({
    example: 'https://example.com/new-article'
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    example: 'Обновленное описание ссылки',
    maxLength: TextLength.LinkDescMax
  })
  @IsOptional()
  @IsString()
  @MaxLength(TextLength.LinkDescMax, {
    message: PostValidateMessage.DescriptionMaxLengthNotValid
  })
  description?: string;
}
