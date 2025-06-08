import {ConflictException, Injectable, InternalServerErrorException, NotFoundException,} from '@nestjs/common';

import {BlogPostRepository} from './blog-post.repository';
import {BlogPostEntity} from './blog-post.entity';
import {CreateBlogPostDto} from './dto/create-blog-post.dto';
import {UpdateBlogPostDto} from './dto/update-blog-post.dto';
import {PostStatus, PostType} from "@project/core";

@Injectable()
export class BlogPostService {
  constructor(private readonly blogPostRepository: BlogPostRepository) {
  }

  public async getPosts(filter?: {
    userId?: string;
    type?: PostType;
    status?: PostStatus;
    isRepost?: boolean;
  }): Promise<BlogPostEntity[]> {
    return await this.blogPostRepository.find(filter);
  }

  public async getPost(id: string): Promise<BlogPostEntity> {
    const entity = await this.blogPostRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Пост с id ${id} не найден.`);
    }
    return entity;
  }

  public async createPost(dto: CreateBlogPostDto): Promise<BlogPostEntity> {
    const entity = new BlogPostEntity(dto);

    if (dto.originalPostId) {
      try {
        await this.blogPostRepository.findById(dto.originalPostId);
      } catch {
        throw new NotFoundException(`Оригинальный пост с id ${dto.originalPostId} не найден.`);
      }
    }

    try {
      await this.blogPostRepository.save(entity);
      return entity;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('Конфликт данных при создании поста.');
      }
      throw new InternalServerErrorException('Не удалось создать пост.');
    }
  }

  public async updatePost(id: string, dto: UpdateBlogPostDto): Promise<BlogPostEntity> {
    const existing = await this.blogPostRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Пост с id ${id} не найден.`);
    }

    if (dto.userId !== undefined) {
      existing.userId = dto.userId;
    }
    if (dto.type !== undefined) {
      existing.type = dto.type;
    }
    if (dto.payload !== undefined) {
      existing.payload = dto.payload;
    }
    if (dto.publishedAt !== undefined) {
      existing.publishedAt = new Date(dto.publishedAt);
    }
    if (dto.status !== undefined) {
      existing.status = dto.status;
    }
    if (dto.isRepost !== undefined) {
      existing.isRepost = dto.isRepost;
    }
    if (dto.originalPostId !== undefined) {
      if (dto.originalPostId === id) {
        throw new ConflictException('Нельзя сделать репост самого себя.');
      }
      try {
        await this.blogPostRepository.findById(dto.originalPostId);
      } catch {
        throw new NotFoundException(`Оригинальный пост с id ${dto.originalPostId} не найден.`);
      }
      existing.originalPostId = dto.originalPostId;
    }

    try {
      await this.blogPostRepository.update(existing);
      return existing;
    } catch (err) {
      throw new InternalServerErrorException('Не удалось обновить данные поста.');
    }
  }

  public async deletePost(id: string): Promise<void> {
    await this.blogPostRepository.deleteById(id);
  }
}
