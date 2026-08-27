import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../shared/dto/pagiantion.dto';
import { AuthenticatedUserPayload } from '../auth/dto/auth.dto';
import { CurrentUser } from '../shared/decerators/current_user.decerator';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }


  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }


  @Get('stats')
  getStats() {
    return this.usersService.getUserStats();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findByIdOrThrow(BigInt(id));
  }


  @Patch('me')
  update(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUserPayload,
  ) {
    return this.usersService.update(dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(BigInt(id));
  }
}