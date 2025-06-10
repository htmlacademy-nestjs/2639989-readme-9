import {ApiProperty} from '@nestjs/swagger';
import {PostStatus, PostType} from '@prisma/client';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'ID пользователя, создавшего пост',
    example: 'b1a2c3d4-e5f6-...'
  })
  public userId: string;

  @ApiProperty({
    description: 'Тип поста (TEXT, VIDEO, QUOTE, PHOTO, LINK)',
    example: PostType.TEXT
  })
  public type: PostType;

  @ApiProperty({
    description: 'Произвольный JSON-payload для поста',
    example: {text: 'Привет, мир!'}
  })
  public payload: any;

  @ApiProperty({
    description: 'Дата и время публикации',
    example: '2025-06-06T12:00:00.000Z'
  })
  public publishedAt: string;

  @ApiProperty({
    description: 'Статус поста (DRAFT или PUBLISHED)',
    example: PostStatus.PUBLISHED
  })
  public status: PostStatus;

  @ApiProperty({
    description: 'Является ли пост репостом',
    example: false,
    required: false
  })
  public isRepost?: boolean;

  @ApiProperty({
    description: 'ID оригинального поста, если этот пост — репост',
    example: 'a9b8c7d6-...'
  })
  public originalPostId?: string;
}
