import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, Length} from 'class-validator';
import {CommentLength} from '../blog-comment.constant';

export class UpdateCommentDto {
  @ApiProperty({
    description: `Новый текст комментария (от ${CommentLength.MIN} до ${CommentLength.MAX} символов)`,
    example: 'Обновлённый текст комментария'
  })
  @IsString()
  @IsNotEmpty()
  @Length(CommentLength.MIN, CommentLength.MAX)
  public text: string;
}
