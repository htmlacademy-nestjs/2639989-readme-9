import { BadRequestException } from '@nestjs/common';
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {ALLOWED_MIME_TYPES, FILE_MAX_SIZE} from "./file-uploader.constant";

export const FileFilter: MulterOptions['fileFilter'] = (
  req, file, callback
) => {
  if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Недопустимый формат файла. Используйте JPG или PNG.'),
      false
    );
  }

  if (file.size > FILE_MAX_SIZE) {
    return callback(
      new BadRequestException('Размер аватара не должен превышать 1024 KB (1 MB).'),
      false
    );
  }

  callback(null, true);
};
