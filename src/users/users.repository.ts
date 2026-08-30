import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prismaClient;

    return client.user.create({
      data,
    });
  }

  async findAll(
    params: Prisma.UserFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User[]> {
    const {
      skip,
      take,
      cursor,
      where,
      include,
      orderBy,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const client = tx ?? this.prismaClient;

    return client.user.findUnique({
      where,
      include,
    });
  }

  async findOneOrThrow(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prismaClient;

    const record = await client.user.findUnique({
      where,
      include,
    });

    if (!record) {
      throw new NotFoundException('messages.recordNotFound');
    }

    return record;
  }

  async update(
    params: Prisma.UserUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    return client.user.update({
      where,
      data,
    });
  }

  async updateMany(
    params: Prisma.UserUpdateManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    const result = await client.user.updateMany({
      where,
      data,
    });

    return result.count;
  }

  async remove(
    where: Prisma.UserWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prismaClient;

    return client.user.delete({
      where,
    });
  }

  async count(
    params: Prisma.UserCountArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where } = params;

    const client = tx ?? this.prismaClient;

    return client.user.count({
      where,
    });
  }

  async upsert(
    params: Prisma.UserUpsertArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const {
      where,
      create,
      update,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.user.upsert({
      where,
      create,
      update,
    });
  }

  async aggregate(
    params: Prisma.UserAggregateArgs,
    tx?: Prisma.TransactionClient,
  ) {
    const {
      where,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.user.aggregate({
      where,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    });
  }

  async groupBy(
    params: Prisma.UserGroupByArgs,
    tx?: Prisma.TransactionClient,
  ) {
    const {
      by,
      where,
      orderBy,
      having,
      take,
      skip,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.user.groupBy({
      by,
      where,
      orderBy,
      having,
      take,
      skip,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    });
  }
}