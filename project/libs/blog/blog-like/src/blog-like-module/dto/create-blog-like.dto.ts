import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsUUID} from 'class-validator';
import {BlogLikeValidateMessage} from '../blog-like.constant';

export class CreateBlogLikeDto {
  @ApiProperty({
    description: 'UUID публикации для лайка',
    example: '6d308040-96a2-4162-bea6-2338e9976540'
  })
  @IsUUID(undefined, {message: BlogLikeValidateMessage.PostIdNotValid})
  @IsNotEmpty({message: BlogLikeValidateMessage.PostIdRequired})
  public postId!: string;
}
