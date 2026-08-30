// guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUserPayload } from '../../auth/dto/auth.dto';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService , 
    private userService : UsersService , 
    private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const roles = this.getClassAndHandlerMetaData(context , "roles") as UserRole[]
    
    if (!token) {
      throw new UnauthorizedException('messages.noToken');
    }

    try {
      const payload : AuthenticatedUserPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      await this.validateUserAccess(payload.userId , payload.role , roles)
      request['user'] = payload;
    } catch (err) {
      throw err
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private getClassAndHandlerMetaData(context : ExecutionContext , metaDataKey : string){
    return this.reflector.getAllAndOverride<string[]>(
    metaDataKey,
    [
      context.getHandler(),
      context.getClass(),
    ],
  );
  }

  private checkUserRole(userRole: UserRole, roles: UserRole[]): boolean {
    return roles.includes(userRole);
  }

private async validateUserAccess(
  userId: bigint,
  userRole: UserRole,
  roles: UserRole[],
) {
  const user = await this.userService.validateAndGetUser(userId);

  if (!this.checkUserRole(userRole, roles)) {
    throw new ForbiddenException('messages.forbidden');
  }

  return user;
}}