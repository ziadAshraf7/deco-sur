import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { AdminUsersService } from './admin.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService , UserRepository , AdminUsersService],
  exports : [UsersService]
})
export class UsersModule {}
