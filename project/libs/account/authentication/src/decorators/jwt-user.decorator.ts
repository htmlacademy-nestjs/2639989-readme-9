import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {TokenPayload} from "@project/core";

@Injectable()
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
