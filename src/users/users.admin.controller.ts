import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AdminUsersService } from './admin.service';

import { PaginationQueryDto } from '../shared/dto/pagiantion.dto';
import { Auth } from '../shared/guards/auth.decerator';


@Controller('admin/users')
@Auth('ADMIN')
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminUsersService: AdminUsersService,
  ) {}


  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
  ) {
    return this.usersService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.usersService.getUserStats();
  }

  @Get(':id')
  findUser(
    @Param('id') id: string,
  ) {
    return this.usersService.findByIdOrThrow(
      BigInt(id),
    );
  }


  @Patch(':id/activate')
  activateUser(
    @Param('id') id: string,
  ) {
    return this.adminUsersService.activateUser(
      BigInt(id),
    );
  }

  @Patch(':id/deactivate')
  deactivateUser(
    @Param('id') id: string,
  ) {
    return this.adminUsersService.deactivateUser(
      BigInt(id),
    );
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
  ) {
    return this.adminUsersService.deleteUser(
      BigInt(id),
    );
  }


}