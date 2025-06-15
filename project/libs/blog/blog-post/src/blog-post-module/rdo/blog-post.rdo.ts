import {Expose, Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {PostStatus, PostType} from '@prisma/client';

export class BlogPostRdo {
  @ApiProperty({
    description: 'Уникальный идентификатор публикации',
    example: 'c3f8a8d0-7b7f-11ed-a1eb-0242ac120002'
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'ID автора публикации',
    example: 'd5f9f8d0-7b7f-11ed-a1eb-0242ac120002'
  })
  @Expose()
  public authorId!: string;

  @ApiProperty({
    description: 'Имя автора публикации',
    example: 'John Doe'
  })
  @Expose()
  public author!: string;

  @ApiProperty({
    enum: PostType,
    description: 'Тип публикации (VIDEO, TEXT, QUOTE, PHOTO, LINK)',
    example: 'TEXT'
  })
  @Expose()
  public type!: PostType;

  @ApiProperty({
    description: 'Контент публикации в специфичном формате для типа'
  })
  @Expose()
  public content!: object;

  @ApiProperty({
    description: 'Дата создания публикации',
    example: '2023-01-15T14:30:00.000Z'
  })
  @Expose()
  public createdAt!: Date;

  @ApiProperty({
    description: 'Дата публикации (если опубликована)',
    example: '2023-01-15T14:30:00.000Z',
    nullable: true
  })
  @Expose()
  public publishedAt?: Date;

  @ApiProperty({
    enum: PostStatus,
    description: 'Статус публикации (DRAFT, PUBLISHED)',
    example: 'PUBLISHED'
  })
  @Expose()
  public status!: PostStatus;

  @ApiProperty({
    description: 'Является ли публикация репостом',
    example: false
  })
  @Expose()
  public isRepost!: boolean;

  @ApiProperty({
    description: 'ID оригинальной публикации (для репостов)',
    example: 'e7f7a8d0-7b7f-11ed-a1eb-0242ac120002',
    nullable: true
  })
  @Expose()
  public originalPostId?: string;

  @ApiProperty({
    description: 'Автор оригинальной публикации',
    example: 'Jane Smith',
    nullable: true
  })
  @Expose()
  public originalAuthor?: string;

  @ApiProperty({
    description: 'Список тегов публикации',
    example: ['технологии', 'программирование'],
    type: [String]
  })
  @Expose()
  public tags: string[] = [];

  @ApiProperty({
    description: 'Количество комментариев',
    example: 15
  })
  @Expose()
  @Transform(({value}) => value || 0)
  public commentsCount!: number;

  @ApiProperty({
    description: 'Количество лайков',
    example: 42
  })
  @Expose()
  @Transform(({value}) => value || 0)
  public likesCount!: number;

  @ApiProperty({
    description: 'Количество просмотров',
    example: 120
  })
  @Expose()
  @Transform(({value}) => value || 0)
  public viewsCount!: number;
}
