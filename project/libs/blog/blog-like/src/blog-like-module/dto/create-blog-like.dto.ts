import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBlogLikeDto {
  @ApiProperty({
    description: 'UUID пользователя, который ставит лайк',
    example: '658170cbb954e9f5b905ccf4'
  })
  @IsUUID()
  @IsNotEmpty()
  public userId!: string;

  @ApiProperty({
    description: 'UUID публикации, которой ставят лайк',
    example: '6d308040-96a2-4162-bea6-2338e9976540'
  })
  @IsUUID()
  @IsNotEmpty()
  public postId!: string;
}
