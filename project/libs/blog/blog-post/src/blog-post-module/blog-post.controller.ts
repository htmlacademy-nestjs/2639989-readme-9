import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator, ForbiddenException,
} from '@nestjs/common';
import { fillDto } from '@project/helpers';

import { BlogPostService } from './blog-post.service';
import { BlogPostRdo } from './rdo/blog-post.rdo';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
  ) {}

  @Get('/')
  public async index(
    @Query() query: BlogPostQuery
  ) {
    const postsWithPagination = await this.blogPostService.getPosts(query);
    return fillDto(BlogPostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map(
        (entity) => fillDto(BlogPostRdo, entity.toPOJO())
      ),
    });
  }

  @Get('/user/:userId')
  public async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: BlogPostQuery
  ) {
    const postsWithPagination = await this.blogPostService.getPosts(query, userId, false);
    return fillDto(BlogPostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map(
        (entity) => fillDto(BlogPostRdo, entity.toPOJO())
      ),
    });
  }

  @Get('/:id')
  public async show(
    @Param('id') id: string
  ) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  //@UseGuards(JwtAuthGuard)
  @Get('/drafts')
  public async getUserDrafts(
    @Param('id') id: string,
    //@CurrentUser() user: TokenPayload,
    @Query() query: BlogPostQuery
  ) {
    const postsWithPagination = await this.blogPostService.getPosts(query, id, true);
    return fillDto(BlogPostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map(
        (entity) => fillDto(BlogPostRdo, entity.toPOJO())
      ),
    });
  }

  //@UseGuards(JwtAuthGuard)
  @Post('/')
  public async create(
    @Param('id') id: string,
    //@CurrentUser() user: TokenPayload,
    @Body() dto: CreateBlogPostDto
  ) {
    const newPost = await this.blogPostService.createPost(id, dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  //@UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    //@CurrentUser() user: TokenPayload,
    @Body() dto: UpdateBlogPostDto
  ) {
    const updatedPost = await this.blogPostService.updatePost(id, userId, dto);
    return fillDto(BlogPostRdo, updatedPost.toPOJO());
  }

  //@UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id') id: string,
    @Param('userId') userId: string,
    //@CurrentUser() user: TokenPayload
  ) {
    await this.blogPostService.deletePost(id, userId);
  }
}
