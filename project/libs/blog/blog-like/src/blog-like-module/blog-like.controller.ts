import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post,} from '@nestjs/common';
import {fillDto} from '@project/helpers';
import {BlogLikeService} from './blog-like.service';
import {CreateBlogLikeDto} from './dto/create-blog-like.dto';
import {BlogLikeRdo} from './rdo/blog-like.rdo';

@Controller('likes')
export class BlogLikeController {
  constructor(
    private readonly blogLikeService: BlogLikeService
  ) {
  }

  @Post('/')
  public async create(
    @Body() dto: CreateBlogLikeDto
  ) {
    const newLike = await this.blogLikeService.likePost(dto);
    return fillDto(BlogLikeRdo, newLike.toPOJO());
  }

  @Get('/post/:postId')
  public async findAllByPost(
    @Param('postId') postId: string
  ) {
    const likes = await this.blogLikeService.getLikesByPost(postId);
    return likes.map(item => fillDto(BlogLikeRdo, item.toPOJO()));
  }

  @Get('/:userId/:postId')
  public async findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    const like = await this.blogLikeService.getLike(userId, postId);
    return fillDto(BlogLikeRdo, like.toPOJO());
  }

  @Delete('/:userId/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    await this.blogLikeService.unlikePost(userId, postId);
  }
}
