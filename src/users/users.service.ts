import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { AuthenticatedUserPayload } from '../auth/dto/auth.dto';
import { PaginationQueryDto } from '../shared/dto/pagiantion.dto';

const SALT_ROUNDS = 10;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      return await this.userRepository.create({
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: UserRole.CLIENT,
      });
    } catch (error) {
      if (this.isUniqueEmailViolation(error)) {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async findAll(query: PaginationQueryDto) {
    const where: Prisma.UserWhereInput = {};

    const [data, total] = await Promise.all([
      this.userRepository.findAll({
        skip: query.skip ?? 0,
        take: 20,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.userRepository.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      data,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findByIdOrThrow(id: bigint): Promise<User> {
    return this.userRepository.findOneOrThrow({ id });
  }

  async findById(id: bigint): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneOrThrow({ email });
  }

  async update(dto: UpdateUserDto , user : AuthenticatedUserPayload): Promise<User> {
    const userId = user.userId
    await this.userRepository.findOneOrThrow({ id : userId });

    const data: Prisma.UserUpdateInput = {
      name: dto.name,
      email: dto.email
    };

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    try {
      return await this.userRepository.update({ where: { id : userId }, data });
    } catch (error) {
      if (this.isUniqueEmailViolation(error)) {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: bigint): Promise<User> {
    await this.userRepository.findOneOrThrow({ id });
    return this.userRepository.remove({ id });
  }

  async validateAndGetUser(userId : bigint) {
   const user = await this.findByIdOrThrow(userId); 
    if(user.status !== UserStatus.ACTIVE ) throw new UnauthorizedException("user is suspended")
    return user;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  private isUniqueEmailViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      Array.isArray((error.meta as { target?: string[] })?.target) &&
      (error.meta as { target: string[] }).target.includes('email')
    );
  }
}