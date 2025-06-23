import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { ApplicationServiceURL } from './app.config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import {CreateBlogCommentDto} from "@project/blog-comment";
@ApiTags('Comments Gateway')
@Controller('comments')
@UseFilters(AxiosExceptionFilter)
export class CommentsController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiBody({ type: CreateBlogCommentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment created successfully',
    type: Object
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid comment data'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found'
  })
  async createComment(
    @Req() req: Request,
    @Body() dto: CreateBlogCommentDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Comments}/`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/post/:postId')
  @ApiOperation({ summary: 'Get comments for post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Comments limit (default: 50, max: 100)'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments list',
    type: [Object]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found'
  })
  async getCommentsByPost(
    @Param('postId') postId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    const params = {
      limit: limit ? Math.min(Number(limit), 100) : 50,
      page: page ? Number(page) : 0
    };

    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comments}/post/${postId}`,
      { params }
    );
    return data;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment details',
    type: Object
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found'
  })
  async getCommentById(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comments}/${id}`
    );
    return data;
  }

  @Delete('/:id')
  @UseGuards(CheckAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment deleted'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not your comment'
  })
  async deleteComment(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Comments}/${id}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
  }
}
