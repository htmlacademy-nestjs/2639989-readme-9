import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsUUID, Length} from 'class-validator';
import {MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH} from '../blog-comment.constant';

export class CreateCommentDto {
  @ApiProperty({
    description: 'UUID пользователя, которой написал комментарий',
    example: '6d308040-96a2-4162-bea6-2338e9976540'
  })
  @IsUUID()
  public userId!: string;

  @ApiProperty({
    description: 'UUID публикации, к которой привязывается комментарий',
    example: '6d308040-96a2-4162-bea6-2338e9976540'
  })
  @IsUUID()
  public postId!: string;

  @ApiProperty({
    description: `Текст комментария (от ${MIN_COMMENT_LENGTH} до ${MAX_COMMENT_LENGTH} символов)`,
    example: 'Очень познавательно, спасибо!'
  })
  @IsString()
  @IsNotEmpty()
  @Length(MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH)
  public text!: string;
}
