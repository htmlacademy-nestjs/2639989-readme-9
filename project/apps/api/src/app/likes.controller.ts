import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { HttpService } from '@nestjs/axios';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { ApplicationServiceURL } from './app.config';
import { CheckAuthGuard } from './guards/check-auth.guard';
import {CreateBlogLikeDto} from "@project/blog-like";

@ApiTags('Likes Gateway')
@Controller('likes')
@UseFilters(AxiosExceptionFilter)
export class LikesController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a post' })
  @ApiBody({ type: CreateBlogLikeDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Like created' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Like already exists' })
  async createLike(
    @Req() req: Request,
    @Body() dto: CreateBlogLikeDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Likes}/`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Get('/post/:postId/count')
  @ApiOperation({ summary: 'Get like count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like count retrieved',
    type: Number
  })
  async getLikeCount(
    @Param('postId') postId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Likes}/post/${postId}/count`
    );
    return data;
  }

  @Get('/post/:postId/status')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user liked a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Like status retrieved',
    type: Boolean
  })
  async getLikeStatus(
    @Req() req: Request,
    @Param('postId') postId: string
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Likes}/post/${postId}/status`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Delete('/post/:postId')
  @UseGuards(CheckAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove like from a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Like removed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Like not found' })
  async removeLike(
    @Req() req: Request,
    @Param('postId') postId: string
  ) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Likes}/post/${postId}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
  }
}
