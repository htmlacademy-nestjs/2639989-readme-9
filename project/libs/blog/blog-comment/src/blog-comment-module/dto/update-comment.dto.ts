import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, Length} from 'class-validator';
import {MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH} from '../blog-comment.constant';

export class UpdateCommentDto {
  @ApiProperty({
    description: `Новый текст комментария (от ${MIN_COMMENT_LENGTH} до ${MAX_COMMENT_LENGTH} символов)`,
    example: 'Обновлённый текст комментария'
  })
  @IsString()
  @IsNotEmpty()
  @Length(MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH)
  public text: string;
}
