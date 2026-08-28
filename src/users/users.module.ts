import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { AdminUsersService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersController } from './users.admin.controller';

@Module({
  controllers: [UsersController , AdminUsersController],
  providers: [UsersService , UserRepository , AdminUsersService],
  imports : [forwardRef(() => AuthModule)] ,
  exports : [UsersService]
})
export class UsersModule {}
