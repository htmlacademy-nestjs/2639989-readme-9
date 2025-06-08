import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from '@nestjs/common';
import {fillDto} from '@project/helpers';
import {CommentService} from './blog-comment.service';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from './dto/update-comment.dto';
import {CommentRdo} from './rdo/comment.rdo';

@Controller('comments')
export class BlogCommentController {
  constructor(
    private readonly commentService: CommentService
  ) {
  }

  @Post('/')
  public async create(
    @Body() dto: CreateCommentDto,
  ) {
    const newComment = await this.commentService.createComment(dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Get('/post/:postId/')
  public async findAllByPost(
    @Param('postId') postId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    const comments = await this.commentService.getCommentsByPost(postId, Number(limit) || 50, Number(offset) || 0);
    return comments.map((c) => fillDto(CommentRdo, c.toPOJO()));
  }

  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    const comment = await this.commentService.getCommentById(id);
    return fillDto(CommentRdo, comment.toPOJO());
  }

  @Patch('/:id/:userId')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Param('userId') userId: string
  ) {
    const updated = await this.commentService.updateComment(userId, id, dto);
    return fillDto(CommentRdo, updated.toPOJO());
  }

  @Delete('/:id/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id') id: string,
    @Param('userId') userId: string
  ) {
    await this.commentService.deleteComment(userId, id);
  }
}
