import { BadRequestException } from '@nestjs/common';
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {ALLOWED_MIME_TYPES, PHOTO_MAX_SIZE} from "./blog-post.constant";

export const PhotoFilter: MulterOptions['fileFilter'] = (
  req, file, callback
) => {
  if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Недопустимый формат файла. Используйте JPG или PNG.'),
      false
    );
  }

  if (file.size > PHOTO_MAX_SIZE) {
    return callback(
      new BadRequestException('Размер аватара не должен превышать 1024 KB (1 MB).'),
      false
    );
  }

  callback(null, true);
};
