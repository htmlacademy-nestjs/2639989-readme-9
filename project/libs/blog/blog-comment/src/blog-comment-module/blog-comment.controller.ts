import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {fillDto} from '@project/helpers';
import {BlogCommentService} from './blog-comment.service';
import {CreateBlogCommentDto} from './dto/create-blog-comment.dto';
import {BlogCommentRdo} from './rdo/blog-comment.rdo';
import {
  BlogCommentExceptionMessage,
  BlogCommentResponseMessage,
  BlogCommentValidateMessage,
  CommentLength
} from './blog-comment.constant';
import {JwtAuthGuard, User} from "@project/authentication";
import { TokenPayload } from '@project/core';

@ApiTags('comments')
@Controller('comments')
export class BlogCommentController {
  constructor(
    private readonly commentService: BlogCommentService
  ) {
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: BlogCommentResponseMessage.CommentCreated,
    type: BlogCommentRdo,
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
  @UseGuards(JwtAuthGuard)
  @Post('/')
  public async create(
    @User() user: TokenPayload,
    @Body() dto: CreateBlogCommentDto,
  ) {
    const newComment = await this.commentService.createComment(user.sub, dto);
    return fillDto(BlogCommentRdo, newComment.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.CommentsFound,
    type: [BlogCommentRdo],
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

    return comments.map(c => fillDto(BlogCommentRdo, c.toPOJO()));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: BlogCommentResponseMessage.CommentFound,
    type: BlogCommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: BlogCommentExceptionMessage.CommentNotFound,
  })
  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    const comment = await this.commentService.getCommentById(id);
    return fillDto(BlogCommentRdo, comment.toPOJO());
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
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @User() user: TokenPayload,
    @Param('id') id: string
  ) {
    await this.commentService.deleteComment(user.sub, id);
  }
}
