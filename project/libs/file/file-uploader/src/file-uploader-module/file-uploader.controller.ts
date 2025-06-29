import 'multer';
import {Express} from 'express';
import {Controller, Get, Param, Post, UploadedFile, UseGuards} from '@nestjs/common';

import {FileUploaderService} from './file-uploader.service';
import {fillDto} from '@project/helpers';
import {UploadedFileRdo} from "./rdo/uploaded-file.rdo";
import {MongoIdValidationPipe} from "@project/pipes";
import {JwtAuthGuard} from "@project/authentication";

@Controller('files')
export class FileUploaderController {
  constructor(
    private readonly fileUploaderService: FileUploaderService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.fileUploaderService.saveFile(file);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.fileUploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, existFile);
  }
}
