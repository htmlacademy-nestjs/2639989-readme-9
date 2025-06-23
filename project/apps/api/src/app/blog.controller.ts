import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
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
import {BlogPostQuery, CreateBlogPostDto, UpdateBlogPostDto} from "@project/blog-post";

@ApiTags('Blog Gateway')
@Controller('blog/posts')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get published posts with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'sort', enum: ['date', 'likes', 'comments'], required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiResponse({ status: 200, description: 'Posts retrieved' })
  async getPublishedPosts(@Query() query: BlogPostQuery) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/`,
      { params: query }
    );
    return data;
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get user\'s published posts' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ type: BlogPostQuery })
  @ApiResponse({ status: 200, description: 'User posts retrieved' })
  async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: BlogPostQuery
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/user/${userId}`,
      { params: query }
    );
    return data;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get post details' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPost(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Get('/drafts/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s drafts' })
  @ApiQuery({ type: BlogPostQuery })
  @ApiResponse({ status: 200, description: 'Drafts retrieved' })
  async getUserDrafts(
    @Req() req: Request,
    @Query() query: BlogPostQuery
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/drafts`,
      {
        params: query,
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreateBlogPostDto })
  @ApiResponse({ status: 201, description: 'Post created' })
  async createPost(
    @Req() req: Request,
    @Body() dto: CreateBlogPostDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: UpdateBlogPostDto })
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto
  ) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Blog}/${id}`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deletePost(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Blog}/${id}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
  }

  // Дополнительные эндпоинты по ТЗ
  @UseGuards(CheckAuthGuard)
  @Post('/:id/repost')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost publication' })
  @ApiParam({ name: 'id', description: 'Original Post ID' })
  @ApiResponse({ status: 201, description: 'Repost created' })
  async repost(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${id}/repost`,
      null,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('/:id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/unlike post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Like toggled' })
  async toggleLike(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/${id}/like`,
      null,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }
}
