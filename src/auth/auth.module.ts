import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AuthController } from './auth.controller';

const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN) || 604800;

@Module({
  controllers: [AuthController],
  providers: [AuthService , AuthGuard],
  imports : [
    forwardRef(() => UsersModule), 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN_SECONDS },
    })
  ],
  exports: [AuthGuard, JwtModule]
})
export class AuthModule {}
