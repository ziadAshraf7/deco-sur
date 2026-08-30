import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthenticatedUserPayload, LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthenticatedUserPayload> {
    const user = await this.usersService.findByEmailOrThrow(email);

    if (!user) {
      throw new UnauthorizedException('messages.invalidCredentials');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('messages.invalidCredentials');
    }

    const { passwordHash, createdAt, updatedAt, id, ...result } = user;
    return { userId: id, ...result };
  }

  async login(dto: LoginDto) {
    const userPayload = await this.validateUser(dto.email, dto.password);
    return this.generateTokens(userPayload);
  }

  async signup(dto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });

      const { passwordHash: _, createdAt, updatedAt, id, ...result } = user;

      const userPayload: AuthenticatedUserPayload = {
        userId: id,
        ...result,
      };

      return userPayload;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('messages.emailExists');
      }

      throw error;
    }
  }


  async refreshTokens(dto: RefreshTokenDto) {
    let decoded: AuthenticatedUserPayload & { userId: number };

    try {
      decoded = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('messages.invalidRefreshToken');
    }

    const user = await this.usersService.findByEmailOrThrow(decoded.email);
    if (!user) {
      throw new UnauthorizedException('messages.invalidRefreshToken');
    }

    const { passwordHash, createdAt, updatedAt, id, ...result } = user;
    const userPayload: AuthenticatedUserPayload = { userId: id, ...result };

    return this.generateTokens(userPayload);
  }

  private generateTokens(payload: AuthenticatedUserPayload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private generateAccessToken(payload: AuthenticatedUserPayload) {
    return this.jwtService.sign(
      { ...payload, userId: Number(payload.userId) },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN as unknown as any) ?? '15m',
      },
    );
  }

  private generateRefreshToken(payload: AuthenticatedUserPayload) {
    return this.jwtService.sign(
      { ...payload, userId: Number(payload.userId) },
      {
        secret: process.env.JWT_REFRESH_SECRET,
      expiresIn:
        (process.env.JWT_REFRESH_EXPIRES_IN as unknown as any) ?? '7d',      
      },
    );
  }
}