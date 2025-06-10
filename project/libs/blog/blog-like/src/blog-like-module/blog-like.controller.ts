import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {BlogLikeService} from './blog-like.service';
import {CreateBlogLikeDto} from './dto/create-blog-like.dto';
import {BlogLikeExceptionMessage, BlogLikeResponseMessage} from './blog-like.constant';

@ApiTags('likes')
@Controller('likes')
export class BlogLikeController {
  constructor(
    private readonly blogLikeService: BlogLikeService
  ) {
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogLikeResponseMessage.Created
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogLikeExceptionMessage.PostNotFound
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: BlogLikeExceptionMessage.AlreadyExists
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogLikeResponseMessage.LoggedError
  })
  //@UseGuards(JwtAuthGuard)
  @Post('/')
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreateBlogLikeDto
  ) {
    await this.blogLikeService.likePost(userId, dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Количество лайков',
    type: Number
  })
  @Get('/post/:postId/count')
  public async countByPost(
    @Param('postId') postId: string
  ) {
    return this.blogLikeService.getLikesByPost(postId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус лайка пользователя',
    type: Boolean
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogLikeResponseMessage.LoggedError
  })
  //@UseGuards(JwtAuthGuard)
  @Get('/post/:postId/status')
  public async getLikeStatus(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    return this.blogLikeService.checkUserLike(userId, postId);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogLikeResponseMessage.Deleted
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogLikeExceptionMessage.LikeNotFound
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogLikeResponseMessage.LoggedError
  })
  //@UseGuards(JwtAuthGuard)
  @Delete('/post/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('userId') userId: string,
    @Param('postId') postId: string
  ) {
    await this.blogLikeService.unlikePost(userId, postId);
  }
}
