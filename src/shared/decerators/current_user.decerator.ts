import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserPayload } from '../../auth/dto/auth.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) : AuthenticatedUserPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);