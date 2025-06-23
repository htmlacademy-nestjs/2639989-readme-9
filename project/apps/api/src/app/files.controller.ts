import {Controller, Get, Param, Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors} from '@nestjs/common';
import {Express, Request} from 'express';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import 'multer';

import {HttpService} from '@nestjs/axios';
import {AxiosExceptionFilter} from './filters/axios-exception.filter';
import {ApplicationServiceURL} from './app.config';
import {CheckAuthGuard} from './guards/check-auth.guard';

@ApiTags('Files Gateway')
@Controller('files')
@UseFilters(AxiosExceptionFilter)
export class FilesController {
  constructor(
    private readonly httpService: HttpService
  ) {
  }

  @Post('/upload')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({summary: 'Upload file'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    const formData = new FormData();
    formData.append('file', new Blob([file.buffer]), file.originalname);

    const {data} = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Files}/upload`,
      formData,
      {
        headers: {
          'Authorization': req.headers['authorization'],
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  }

  @Get(':fileId')
  @ApiOperation({summary: 'Get file details'})
  @ApiParam({name: 'fileId', description: 'File ID'})
  @ApiResponse({
    status: 200,
    description: 'File details',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  async getFile(
    @Param('fileId') fileId: string
  ) {
    const {data} = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Files}/${fileId}`
    );
    return data;
  }

  @Get(':fileId/download')
  @ApiOperation({summary: 'Download file'})
  @ApiParam({name: 'fileId', description: 'File ID'})
  @ApiResponse({
    status: 200,
    description: 'File content',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  async downloadFile(
    @Param('fileId') fileId: string
  ) {
    const {data} = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Files}/${fileId}/download`,
      {responseType: 'stream'}
    );
    return data;
  }
}
