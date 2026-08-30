import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { User, UserStatus } from '@prisma/client';
import { UserRepository } from './users.repository';


@Injectable()
export class AdminUsersService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}


  async activateUser(userId: bigint): Promise<User> {
    const user = await this.userRepository.findOneOrThrow({
      id: userId,
    });

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('messages.userAlreadyActive');
    }

    return this.userRepository.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.ACTIVE,
      },
    });
  }

 
  async deactivateUser(userId: bigint): Promise<User> {
    const user = await this.userRepository.findOneOrThrow({
      id: userId,
    });

    if (user.status === UserStatus.SUSPENDED) {
      throw new BadRequestException('messages.userAlreadyInactive');
    }

    return this.userRepository.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.SUSPENDED,
      },
    });
  }


  async deleteUser(userId: bigint): Promise<User> {
    await this.userRepository.findOneOrThrow({
      id: userId,
    });

    return this.userRepository.remove({
      id: userId,
    });
  }


}