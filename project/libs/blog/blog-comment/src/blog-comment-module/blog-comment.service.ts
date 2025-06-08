import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {BlogCommentRepository} from './blog-comment.repository';
import {BlogCommentEntity} from './blog-comment.entity';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import {CommentLength} from "./blog-comment.constant";

@Injectable()
export class CommentService {
  constructor(
    private readonly BlogCommentRepository: BlogCommentRepository
  ) {
  }

  public async createComment(dto: CreateCommentDto): Promise<BlogCommentEntity> {
    if (!dto.postId) {
      throw new BadRequestException('postId обязателен');
    }

    if (!dto.userId) {
      throw new BadRequestException('userId обязателен');
    }

    if (dto.text.length < CommentLength.MIN || dto.text.length > CommentLength.MAX) {
      throw new BadRequestException(`Комментарий должен быть от ${CommentLength.MIN} до ${CommentLength.MAX} символов`);
    }

    try {
      const entity = new BlogCommentEntity({
        userId: dto.userId,
        postId: dto.postId,
        text: dto.text,
      });
      await this.BlogCommentRepository.save(entity);

      return entity;
    } catch (e) {
      throw new InternalServerErrorException('Не удалось создать комментарий');
    }
  }

  public async updateComment(userId: string, commentId: string, dto: UpdateCommentDto): Promise<BlogCommentEntity> {
    await this.BlogCommentRepository.ensureOwnsComment(commentId, userId);

    if (dto.text.length < CommentLength.MIN || dto.text.length > CommentLength.MAX) {
      throw new BadRequestException(`Комментарий должен быть от ${CommentLength.MIN} до ${CommentLength.MAX} символов`);
    }

    const blogTagEntity = new BlogCommentEntity(dto);
    blogTagEntity.id = commentId;

    try {
      await this.BlogCommentRepository.update(blogTagEntity);
      return blogTagEntity;
    } catch (e) {
      throw new InternalServerErrorException('Не удалось обновить комментарий');
    }
  }

  public async deleteComment(userId: string, commentId: string): Promise<void> {
    await this.BlogCommentRepository.ensureOwnsComment(commentId, userId);
    try {
      await this.BlogCommentRepository.deleteById(commentId);
    } catch (e) {
      throw new InternalServerErrorException('Не удалось удалить комментарий');
    }
  }

  public async getCommentById(commentId: string): Promise<BlogCommentEntity> {
    return this.BlogCommentRepository.findById(commentId);
  }

  public async getCommentsByPost(postId: string, limit = 50, offset = 0): Promise<BlogCommentEntity[]> {
    return this.BlogCommentRepository.findByPostId({postId, limit, offset});
  }
}
