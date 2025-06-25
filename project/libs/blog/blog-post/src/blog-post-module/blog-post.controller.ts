import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query, UploadedFile,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import {fillDto} from '@project/helpers';

import {BlogPostService} from './blog-post.service';
import {BlogPostRdo} from './rdo/blog-post.rdo';
import {BlogPostQuery} from './blog-post.query';
import {BlogPostWithPaginationRdo} from './rdo/blog-post-with-pagination.rdo';
import {CreateBlogPostDto} from './dto/create-blog-post.dto';
import {UpdateBlogPostDto} from './dto/update-blog-post.dto';
import {JwtAuthGuard} from "@project/authentication";
import {TokenPayload, UserDecorator} from "@project/core";
import {FileUploaderService} from "@project/file-uploader";
import {FileInterceptor} from "@nestjs/platform-express";
import {PhotoFilter} from "./photo.filter";
import {AvailablePostType, PHOTO_MAX_SIZE, PostValidateMessage} from "./blog-post.constant";
import {Express} from "express";

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly fileUploaderService: FileUploaderService,
  ) {
  }

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

  @Get('/user/:userId/:startDate')
  public async getUserPostsByDate(
    @Param('userId') userId: string,
    @Param('startDate') startDate: Date
  ) {
    const posts =
      await this.blogPostService.getPostsByPeriod(startDate, userId);
    return {
      posts: posts.map(
        (entity) => fillDto(BlogPostRdo, entity.toPOJO())
      ),
    };
  }

  @Get('/:id')
  public async show(
    @Param('id') id: string
  ) {
    const post = await this.blogPostService.getPost(id);
    return fillDto(BlogPostRdo, post.toPOJO());
  }

  @UseGuards(JwtAuthGuard)
  @Get('/drafts')
  public async getUserDrafts(
    @UserDecorator() user: TokenPayload,
    @Query() query: BlogPostQuery
  ) {
    const postsWithPagination = await this.blogPostService.getPosts(query, user.sub, true);
    return fillDto(BlogPostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map(
        (entity) => fillDto(BlogPostRdo, entity.toPOJO())
      ),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('photo', {
    fileFilter: PhotoFilter,
    limits: { fileSize: PHOTO_MAX_SIZE },
  }))
  public async create(
    @UserDecorator() user: TokenPayload,
    @Body() dto: CreateBlogPostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let photoId: string;

    if(dto.type === AvailablePostType.PHOTO){
      if (!file) throw new BadRequestException(PostValidateMessage.PhotoNecessary);
      const photo = await this.fileUploaderService.saveFile(file);
      photoId = photo.id;
    }

    const newPost = await this.blogPostService.createPost(user.sub, dto, photoId);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('photo', {
    fileFilter: PhotoFilter,
    limits: { fileSize: PHOTO_MAX_SIZE },
  }))
  public async update(
    @Param('id') id: string,
    @UserDecorator() user: TokenPayload,
    @Body() dto: UpdateBlogPostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let photoId: string;

    if(file){
      const photo = await this.fileUploaderService.saveFile(file);
      photoId = photo.id;
    }

    const updatedPost = await this.blogPostService.updatePost(id, user.sub, dto, photoId);
    return fillDto(BlogPostRdo, updatedPost.toPOJO());
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id') id: string,
    @UserDecorator() user: TokenPayload,
  ) {
    await this.blogPostService.deletePost(id, user.sub);
  }
}
