import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUserPayload } from '../auth/dto/auth.dto';
import { CurrentUser } from '../shared/decerators/current_user.decerator';
import { Auth } from '../shared/guards/auth.decerator';

@Controller('users')
@Auth('CLIENT')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Get('')
  findMe(
    @CurrentUser() user: AuthenticatedUserPayload,
  ) {
    return this.usersService.findByIdOrThrow(
      BigInt(user.userId),
    );
  }

  @Patch('')
  updateMe(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUserPayload,
  ) {
    return this.usersService.update(dto, user);
  }

  @Delete('')
  deleteMe(
    @CurrentUser() user : AuthenticatedUserPayload
  ){
    return this.usersService.remove(user.userId)
  }

}