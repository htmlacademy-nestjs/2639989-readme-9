import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length
} from 'class-validator';
import {
  BlogCommentValidateMessage,
  CommentLength
} from '../blog-comment.constant';

export class CreateCommentDto {
  @ApiProperty({
    description: 'UUID публикации',
    example: '6d308040-96a2-4162-bea6-2338e9976540'
  })
  @IsUUID(undefined, {
    message: BlogCommentValidateMessage.PostIdNotValid
  })
  @IsNotEmpty({
    message: BlogCommentValidateMessage.PostIdRequired
  })
  public postId!: string;

  @ApiProperty({
    description: `Текст комментария (${CommentLength.MIN}-${CommentLength.MAX} символов)`,
    example: 'Это очень полезная информация, спасибо!'
  })
  @IsString({
    message: BlogCommentValidateMessage.TextNotString
  })
  @IsNotEmpty({
    message: BlogCommentValidateMessage.TextRequired
  })
  @Length(
    CommentLength.MIN,
    CommentLength.MAX,
    { message: BlogCommentValidateMessage.TextLengthNotValid }
  )
  public text!: string;
}
