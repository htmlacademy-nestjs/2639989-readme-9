import { Types } from 'mongoose';
import {
  ArgumentMetadata, BadRequestException, Injectable,
  PipeTransform
} from '@nestjs/common';

const BAD_MONGO_ID_ERROR = 'Неправильный ID';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error('Этот пайп может быть использован только с параметрами!')
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(BAD_MONGO_ID_ERROR);
    }

    return value;
  }
}
