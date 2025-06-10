import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {BlogLikeRepository} from './blog-like.repository';
import {CreateBlogLikeDto} from './dto/create-blog-like.dto';
import {BlogLikeExceptionMessage} from './blog-like.constant';
import {BlogLikeEntity} from './blog-like.entity';

@Injectable()
export class BlogLikeService {
  constructor(
    private readonly blogLikeRepository: BlogLikeRepository,
  ) {
  }

  public async likePost(userId: string, dto: CreateBlogLikeDto): Promise<void> {
    //TODO: Добавить проверку на статус поста

    const existingLike = await this.blogLikeRepository.findByUserAndPost(userId, dto.postId);
    if (existingLike) {
      throw new ForbiddenException(BlogLikeExceptionMessage.AlreadyExists);
    }

    try {
      const entity = new BlogLikeEntity({
        userId: userId,
        postId: dto.postId,
        createdAt: new Date()
      });
      await this.blogLikeRepository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException(BlogLikeExceptionMessage.CreateFailed);
    }
  }

  public async unlikePost(userId: string, postId: string): Promise<void> {
    const like = await this.blogLikeRepository.findByUserAndPost(userId, postId);

    if (!like) {
      throw new NotFoundException(BlogLikeExceptionMessage.LikeNotFound);
    }

    try {
      await this.blogLikeRepository.deleteById(like.id);
    } catch (e) {
      throw new InternalServerErrorException(BlogLikeExceptionMessage.DeleteFailed);
    }
  }

  public async getLikesByPost(postId: string): Promise<number> {
    const like = await this.blogLikeRepository.findAllByPost(postId);

    return like.length;
  }

  public async checkUserLike(userId: string, postId: string): Promise<boolean> {
    return !!(await this.blogLikeRepository.findByUserAndPost(userId, postId));
  }
}
