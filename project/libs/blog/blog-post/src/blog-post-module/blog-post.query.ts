import {IsIn, IsNumber, IsOptional, IsPositive, IsString, IsUUID} from 'class-validator';
import {Transform} from 'class-transformer';
import {PostType} from '@project/core';
import {ApiPropertyOptional} from '@nestjs/swagger';
import {AvailablePostType, MAX_POSTS_LIMIT} from "./blog-post.constant";

export class BlogPostQuery {
  @ApiPropertyOptional({
    type: Number,
    description: 'Текущая страница',
    example: 1,
    default: 1
  })
  @Transform(({value}) => +value || 1)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public page? = 1;

  @ApiPropertyOptional({
    type: Number,
    description: `Количество элементов на странице (макс: ${MAX_POSTS_LIMIT})`,
    example: 10,
    default: 10
  })
  @Transform(({value}) => Math.min(parseInt(value, 10), MAX_POSTS_LIMIT))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public limit? = 10;

  @ApiPropertyOptional({
    type: String,
    enum: Object.values(AvailablePostType),
    isArray: true,
    description: 'Фильтр по типам постов',
    example: [AvailablePostType.TEXT, AvailablePostType.VIDEO]
  })
  @IsOptional()
  @Transform(({value}) =>
    Array.isArray(value) ? value : value ? [value] : undefined
  )
  @IsString({each: true})
  @IsIn(Object.values(AvailablePostType), {each: true})
  public postTypes?: PostType[];

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Фильтр по ID тегов',
    example: ['tag1', 'tag2']
  })
  @IsOptional()
  @Transform(({value}) =>
    Array.isArray(value) ? value : value ? [value] : undefined
  )
  @IsUUID('all', {each: true})
  public tagIds?: string[];

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Направление сортировки по дате создания',
    example: 'desc',
    default: 'desc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public sortDirection?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Включать репосты в результаты',
    default: false
  })
  @IsOptional()
  @Transform(({value}) => value === 'true' || value === true)
  public includeReposts?: boolean;
}
