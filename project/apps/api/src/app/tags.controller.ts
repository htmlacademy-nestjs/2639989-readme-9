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
import {CreateTagDto, UpdateTagDto} from "@project/blog-tag";

@ApiTags('Tags Gateway')
@Controller('tags')
@UseFilters(AxiosExceptionFilter)
export class TagsController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit number of tags (max 50)'
  })
  @ApiResponse({
    status: 200,
    description: 'Tags list retrieved',
    type: [Object]
  })
  async getAllTags(
    @Query('limit') limit?: number
  ) {
    const params = limit ? { limit } : {};
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Tags}/`,
      { params }
    );
    return data;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get tag details' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: 200, description: 'Tag found' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async getTag(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Tags}/${id}`
    );
    return data;
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 400, description: 'Invalid tag data' })
  @ApiResponse({ status: 409, description: 'Tag already exists' })
  async createTag(
    @Req() req: Request,
    @Body() dto: CreateTagDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Tags}/`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Patch('/:id')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tag' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 400, description: 'Invalid tag data' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 409, description: 'Tag conflict' })
  async updateTag(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTagDto
  ) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Tags}/${id}`,
      dto,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
    return data;
  }

  @Delete('/:id')
  @UseGuards(CheckAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tag' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: 204, description: 'Tag deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 409, description: 'Tag used in posts' })
  async deleteTag(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Tags}/${id}`,
      {
        headers: { 'Authorization': req.headers['authorization'] }
      }
    );
  }
}
