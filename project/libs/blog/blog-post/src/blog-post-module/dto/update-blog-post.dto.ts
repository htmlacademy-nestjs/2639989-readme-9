import {ApiPropertyOptional} from '@nestjs/swagger';
import {PostStatus, PostType} from '@prisma/client';

export class UpdateBlogPostDto {
  @ApiPropertyOptional({
    description: 'ID пользователя, создавшего пост',
    example: 'b1a2c3d4-e5f6-...'
  })
  public userId?: string;

  @ApiPropertyOptional({
    description: 'Тип поста (TEXT, VIDEO, QUOTE, PHOTO, LINK)',
    example: PostType.VIDEO
  })
  public type?: PostType;

  @ApiPropertyOptional({
    description: 'Произвольный JSON-payload для поста',
    example: {url: 'https://youtu.be/...'}
  })
  public payload?: any;

  @ApiPropertyOptional({
    description: 'Дата и время публикации',
    example: '2025-06-07T18:30:00.000Z'
  })
  public publishedAt?: Date;

  @ApiPropertyOptional({
    description: 'Статус поста (DRAFT или PUBLISHED)',
    example: PostStatus.DRAFT
  })
  public status?: PostStatus;

  @ApiPropertyOptional({
    description: 'Является ли пост репостом',
    example: true
  })
  public isRepost?: boolean;

  @ApiPropertyOptional({
    description: 'ID оригинального поста, если этот пост — репост',
    example: 'a9b8c7d6-...'
  })
  public originalPostId?: string;
}
