import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../decerators/role.decerator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from './auth.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard),
  );
}