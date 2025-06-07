import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeEntity } from './blog-like.entity';
import { CreateBlogLikeDto } from './dto/create-blog-like.dto';

@Injectable()
export class BlogLikeService {
  constructor(
    private readonly blogLikeRepository: BlogLikeRepository
  ) {}

  public async likePost(dto: CreateBlogLikeDto): Promise<BlogLikeEntity> {
    try {
      const entity = new BlogLikeEntity({
        userId: dto.userId,
        postId: dto.postId,
        createdAt: new Date()
      });
      await this.blogLikeRepository.save(entity);
      return entity;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Не удалось поставить лайк');
    }
  }

  public async unlikePost(userId: string, postId: string): Promise<void> {
    try {
      await this.blogLikeRepository.deleteByUserAndPost(userId, postId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Не удалось снять лайк');
    }
  }

  public async getLike(userId: string, postId: string): Promise<BlogLikeEntity> {
    return this.blogLikeRepository.findByUserAndPost(userId, postId);
  }

  public async getLikesByPost(postId: string): Promise<BlogLikeEntity[]> {
    return this.blogLikeRepository.findAllByPost(postId);
  }
}
