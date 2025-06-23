import {UnauthorizedException} from '@nestjs/common';

export class TokenNotExistsException extends UnauthorizedException {
  constructor(tokenId: string) {
    super(`Токен с ID ${tokenId} не существует`);
  }
}
