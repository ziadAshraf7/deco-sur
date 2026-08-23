// auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthenticatedUserPayload, LoginDto, RegisterDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) : Promise<AuthenticatedUserPayload> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash , createdAt , updatedAt , id, ...result } = user;
      return {userId : id , ...result};
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(dto: LoginDto) {
      const userPayload = await this.validateUser(dto.email , dto.password)
      const accessToken = this.generateToken(userPayload)
      return {
        access_token : accessToken
      }
  }

   private generateToken(payload : AuthenticatedUserPayload) {
    return this.jwtService.sign(payload);
   }

  async signup(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(
      dto.password,
      10
    );

    try {
      const user = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password : passwordHash ,
      });

      const { passwordHash: _, createdAt, updatedAt, id, ...result } = user;

      const userPayload: AuthenticatedUserPayload = {
        userId: id,
        ...result,
      };

      return userPayload
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

}