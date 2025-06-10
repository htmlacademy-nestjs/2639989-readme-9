import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {fillDto} from '@project/helpers';
import {CommentService} from './blog-comment.service';
import {CreateCommentDto} from './dto/create-comment.dto';
import {CommentRdo} from './rdo/comment.rdo';
import {
  BlogCommentExceptionMessage,
  BlogCommentResponseMessage,
  BlogCommentValidateMessage,
  CommentLength
} from './blog-comment.constant';

@ApiTags('comments')
@Controller('comments')
export class BlogCommentController {
  constructor(
    private readonly commentService: CommentService
  ) {
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogCommentResponseMessage.CommentCreated,
    type: CommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentExceptionMessage.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: BlogCommentValidateMessage.TextLengthNotValid,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: BlogCommentResponseMessage.LoggedError,
  })
  //@UseGuards(JwtAuthGuard)
  @Post('/')
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const newComment = await this.commentService.createComment(userId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.CommentsFound,
    type: [CommentRdo],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentExceptionMessage.PostNotFound,
  })
  @Get('/post/:postId')
  public async findAllByPost(
    @Param('postId') postId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    const actualLimit = Math.min(Number(limit) || CommentLength.DEFAULT_LIMIT, CommentLength.MAX_LIMIT);
    const actualPage = Number(page) || 0;

    const comments = await this.commentService.getCommentsByPost(
      postId,
      actualLimit,
      actualPage * actualLimit
    );

    return comments.map(c => fillDto(CommentRdo, c.toPOJO()));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.CommentFound,
    type: CommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentExceptionMessage.CommentNotFound,
  })
  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    const comment = await this.commentService.getCommentById(id);
    return fillDto(CommentRdo, comment.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: BlogCommentResponseMessage.CommentDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentExceptionMessage.CommentNotFound,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: BlogCommentExceptionMessage.Forbidden,
  })
  //@UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.commentService.deleteComment(userId, id);
  }
}
