import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {BlogTagRepository} from './blog-tag.repository';
import {BlogTagEntity} from './blog-tag.entity';
import {CreateTagDto} from './dto/create-tag.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {TagExceptionMessage, TAGS_LIMIT, TagValidation} from './blog-tag.constant';

@Injectable()
export class BlogTagService {
  constructor(
    private readonly blogTagRepository: BlogTagRepository
  ) {
  }

  public validateTagName(name: string): boolean {
    const normalized = this.normalizeTagName(name);
    return (
      normalized.length >= TagValidation.MIN_LENGTH &&
      normalized.length <= TagValidation.MAX_LENGTH &&
      TagValidation.REGEX.test(normalized)
    );
  }

  public async getTag(id: string): Promise<BlogTagEntity> {
    const tag = await this.blogTagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(TagExceptionMessage.NotFound);
    }
    return tag;
  }

  public async getAllTags(
    limit: number = TAGS_LIMIT.Default
  ): Promise<BlogTagEntity[]> {
    try {
      return (await this.blogTagRepository.find()).slice(0, limit);
    } catch (e) {
      throw new InternalServerErrorException(
        TagExceptionMessage.GetFailed,
        {cause: e}
      );
    }
  }

  public async createTag(dto: CreateTagDto): Promise<BlogTagEntity> {
    const name = this.normalizeTagName(dto.name);

    if (!this.validateTagName(name)) {
      throw new ForbiddenException(TagExceptionMessage.InvalidTagName);
    }

    const existsTag = await this.blogTagRepository.find({name});
    if (existsTag) {
      throw new ConflictException(TagExceptionMessage.Conflict);
    }

    try {
      const newTag = new BlogTagEntity(dto);
      await this.blogTagRepository.save(newTag);

      return newTag;
    } catch (e) {
      throw new InternalServerErrorException(
        TagExceptionMessage.CreateFailed,
        {cause: e}
      );
    }
  }

  public async updateTag(
    id: string,
    dto: UpdateTagDto
  ): Promise<BlogTagEntity> {
    const name = this.normalizeTagName(dto.name);

    if (!this.validateTagName(name)) {
      throw new ForbiddenException(TagExceptionMessage.InvalidTagName);
    }

    const tag = await this.getTag(id);
    const existingTag = await this.blogTagRepository.find({name});

    if (existingTag && existingTag[0].id !== id) {
      throw new ConflictException(TagExceptionMessage.Conflict);
    }

    try {
      const updatedTag = new BlogTagEntity({...tag, name});
      await this.blogTagRepository.update(updatedTag);

      return updatedTag;
    } catch (e) {
      throw new InternalServerErrorException(
        TagExceptionMessage.UpdateFailed,
        {cause: e}
      );
    }
  }

  public async deleteTag(id: string): Promise<void> {
    const tag = await this.getTag(id);

    if(!tag){
      throw new NotFoundException(TagExceptionMessage.NotFound);
    }

    try {
      await this.blogTagRepository.deleteById(id);
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new ConflictException(
            TagExceptionMessage.UsedInPosts,
            {cause: e}
          );
        }

        if (e.code === 'P2025') {
          throw new NotFoundException(
            TagExceptionMessage.NotFound,
            {cause: e}
          );
        }
      }

      throw new InternalServerErrorException(
        TagExceptionMessage.DeleteFailed,
        {cause: e}
      );
    }
  }

  public async getTagsByIds(tagIds: string[]): Promise<BlogTagEntity[]> {
    if (tagIds.length > TAGS_LIMIT.MaxPerPost) {
      throw new ForbiddenException(TagExceptionMessage.TooManyTags);
    }

    try {
      const tags = await this.blogTagRepository.findByIds(tagIds);

      if (tags.length !== tagIds.length) {
        const foundTagIds = tags.map((tag) => tag.id);
        const notFoundTagIds = tagIds.filter((categoryId) => !foundTagIds.includes(categoryId));

        if (notFoundTagIds.length > 0) {
          throw new NotFoundException(TagExceptionMessage.NotAllFound + notFoundTagIds.join(', '));
        }
      }

      return tags;
    } catch (e) {
      throw new InternalServerErrorException(
        TagExceptionMessage.GetFailed,
        {cause: e}
      );
    }
  }

  private normalizeTagName(name: string): string {
    return name.trim().toLowerCase();
  }
}
