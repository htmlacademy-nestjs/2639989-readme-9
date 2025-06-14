import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {BlogCommentRepository} from './blog-comment.repository';
import {BlogCommentEntity} from './blog-comment.entity';
import {CreateBlogCommentDto} from './dto/create-blog-comment.dto';
import {BlogCommentExceptionMessage, CommentLength} from './blog-comment.constant';

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository,
  ) {
  }

  public async createComment(userId: string, dto: CreateBlogCommentDto): Promise<BlogCommentEntity> {
    try {
      const entity = new BlogCommentEntity({
        userId,
        postId: dto.postId,
        text: dto.text,
      });

      await this.blogCommentRepository.save(entity);
      return entity;
    } catch (error) {
      throw new InternalServerErrorException(
        BlogCommentExceptionMessage.CreateFailed,
        {cause: error}
      );
    }
  }

  public async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.getCommentById(commentId);

    if (comment.userId !== userId) {
      throw new ForbiddenException(BlogCommentExceptionMessage.Forbidden);
    }

    try {
      await this.blogCommentRepository.deleteById(commentId);
    } catch (error) {
      throw new InternalServerErrorException(
        BlogCommentExceptionMessage.DeleteFailed,
        {cause: error}
      );
    }
  }

  public async getCommentById(commentId: string): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundException(BlogCommentExceptionMessage.CommentNotFound);
    }

    return comment;
  }

  public async getCommentsByPost(
    postId: string,
    limit: number = CommentLength.DEFAULT_LIMIT,
    offset = 0
  ): Promise<BlogCommentEntity[]> {
    const validatedLimit = Math.min(
      Math.max(limit, 1),
      CommentLength.MAX_LIMIT
    );

    try {
      return await this.blogCommentRepository.findByPostId({
        postId,
        limit: validatedLimit,
        offset
      });
    } catch (error) {
      throw new InternalServerErrorException(
        BlogCommentExceptionMessage.GetFailed,
        {cause: error}
      );
    }
  }
}
