import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';

import {BlogTagRepository} from './blog-tag.repository';
import {BlogTagEntity} from './blog-tag.entity';
import {CreateTagDto} from './dto/create-tag.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {Prisma} from "@prisma/client";

@Injectable()
export class BlogTagService {
  constructor(
    private readonly blogTagRepository: BlogTagRepository
  ) {
  }

  public async getTag(id: string): Promise<BlogTagEntity> {
    return this.blogTagRepository.findById(id);
  }

  public async getAllTags(): Promise<BlogTagEntity[]> {
    return await this.blogTagRepository.find();
  }

  public async createTag(dto: CreateTagDto): Promise<BlogTagEntity> {
    const existsTag = (await this.blogTagRepository.find({name: dto.name})).at(0);
    if (existsTag) {
      throw new ConflictException('Тег с таким названием уже есть');
    }

    const newTag = new BlogTagEntity(dto);
    await this.blogTagRepository.save(newTag);

    return newTag;
  }

  public async deleteTag(id: string): Promise<void> {
    try {
      await this.blogTagRepository.deleteById(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Tag с ID ${id} не найден`);
      }

      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
        throw new ConflictException(
          `Нельзя удалить тег ${id}, так как он используется в публикациях`
        );
      }

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Не удалось удалить тег: (${e.code}) ${e.meta?.cause ?? e.message}`
        );
      }

      throw new InternalServerErrorException(
        `Сбой при удалении тега. Попробуйте позже.`
      );
    }
  }

  public async updateTag(id: string, dto: UpdateTagDto): Promise<BlogTagEntity> {
    const blogTagEntity = new BlogTagEntity(dto);
    blogTagEntity.id = id;

    try {
      await this.blogTagRepository.update(blogTagEntity);
      return blogTagEntity;
    } catch {
      throw new NotFoundException(`Тег с id ${id} не найден`);
    }
  }

  public async getTagsByIds(tagIds: string[]): Promise<BlogTagEntity[]> {
    const tags = await this.blogTagRepository.findByIds(tagIds);

    if (tags.length !== tagIds.length) {
      const foundTagIds = tags.map((tag) => tag.id);
      const notFoundTagIds = tagIds.filter((categoryId) => !foundTagIds.includes(categoryId));

      if (notFoundTagIds.length > 0) {
        throw new NotFoundException(`Теги с id ${notFoundTagIds.join(', ')} не найдены.`);
      }
    }

    return tags;
  }
}
