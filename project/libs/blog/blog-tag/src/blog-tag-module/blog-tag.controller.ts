import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {fillDto} from '@project/helpers';
import {BlogTagService} from './blog-tag.service';
import {CreateTagDto} from './dto/create-tag.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {TagRdo} from './rdo/tag.rdo';
import {TagExceptionMessage, TagResponseMessage, TAGS_LIMIT} from './blog-tag.constant';
import {JwtAuthGuard} from "@project/authentication";

@ApiTags('Tags')
@Controller('tags')
export class BlogTagController {
  constructor(
    private readonly blogTagService: BlogTagService
  ) {
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: TagResponseMessage.List,
    type: [TagRdo]
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: TagExceptionMessage.GetFailed
  })
  @Get('/')
  public async index(
    @Query('limit', ParseIntPipe) limit: number = TAGS_LIMIT.Max
  ) {
    const validatedLimit = Math.min(limit, TAGS_LIMIT.Max);
    const blogTagEntities = await this.blogTagService.getAllTags(validatedLimit);
    return blogTagEntities.map(tag => fillDto(TagRdo, tag.toPOJO()));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: TagResponseMessage.Details,
    type: TagRdo
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TagExceptionMessage.NotFound
  })
  @Get('/:id')
  public async show(@Param('id') id: string) {
    const tagEntity = await this.blogTagService.getTag(id);
    return fillDto(TagRdo, tagEntity.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: TagResponseMessage.Created,
    type: TagRdo
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: TagExceptionMessage.InvalidTagName
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TagExceptionMessage.Conflict
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: TagResponseMessage.LoggedError
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  public async create(@Body() dto: CreateTagDto) {
    const newTag = await this.blogTagService.createTag(dto);
    return fillDto(TagRdo, newTag.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: TagResponseMessage.Updated,
    type: TagRdo
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TagExceptionMessage.NotFound
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: TagExceptionMessage.InvalidTagName
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TagExceptionMessage.Conflict
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: TagResponseMessage.LoggedError
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto
  ) {
    const updatedTag = await this.blogTagService.updateTag(id, dto);
    return fillDto(TagRdo, updatedTag.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: TagResponseMessage.Deleted
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TagExceptionMessage.NotFound
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: TagExceptionMessage.UsedInPosts
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: TagResponseMessage.LoggedError
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.blogTagService.deleteTag(id);
  }
}
