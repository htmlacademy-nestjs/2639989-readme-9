import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query,} from '@nestjs/common';
import {fillDto} from '@project/helpers';

import {BlogPostService} from './blog-post.service';
import {CreateBlogPostDto} from './dto/create-blog-post.dto';
import {UpdateBlogPostDto} from './dto/update-blog-post.dto';
import {BlogPostRdo} from './rdo/blog-post.rdo';
import {PostStatus, PostType} from '@prisma/client';

@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {
  }

  @Get('/')
  public async index(
    @Query('userId') userId?: string,
    @Query('type') type?: PostType,
    @Query('status') status?: PostStatus,
    @Query('isRepost') isRepost?: boolean
  ) {
    const filter = this.blogPostService.buildFilter(userId, type, status, isRepost);
    const posts = await this.blogPostService.getPosts(filter);
    return posts.map((post) => fillDto(BlogPostRdo, post.toPOJO()));
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @Post('/')
  public async create(@Body() dto: CreateBlogPostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    const updated = await this.blogPostService.updatePost(id, dto);
    return fillDto(BlogPostRdo, updated.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogPostService.deletePost(id);
  }
}
