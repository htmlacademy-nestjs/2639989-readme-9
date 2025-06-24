import { BadRequestException } from '@nestjs/common';
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {ALLOWED_MIME_TYPES, AVATAR_MAX_SIZE} from "./authentication.constant";

export const AvatarFileFilter: MulterOptions['fileFilter'] = (
  req, file, callback
) => {
  if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Недопустимый формат файла. Используйте JPG или PNG.'),
      false
    );
  }

  if (file.size > AVATAR_MAX_SIZE) {
    return callback(
      new BadRequestException('Размер аватара не должен превышать 500 KB.'),
      false
    );
  }

  callback(null, true);
};
