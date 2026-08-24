import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ProjectBeforeAfter } from '@prisma/client';

@Injectable()
export class ProjectBeforeAfterRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.ProjectBeforeAfterCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter> {
    const client = tx ?? this.prismaClient;
    return client.projectBeforeAfter.create({ data });
  }

  async createMany(
    data: Prisma.ProjectBeforeAfterCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    const result = await client.projectBeforeAfter.createMany({ data });
    return result.count;
  }

  async findAll(
    params: Prisma.ProjectBeforeAfterFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const client = tx ?? this.prismaClient;

    return client.projectBeforeAfter.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    where: Prisma.ProjectBeforeAfterWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter | null> {
    const client = tx ?? this.prismaClient;
    return client.projectBeforeAfter.findUnique({ where });
  }

  async findOneOrThrow(
    where: Prisma.ProjectBeforeAfterWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter> {
    const client = tx ?? this.prismaClient;
    const record = await client.projectBeforeAfter.findUnique({ where });

    if (!record) {
      throw new NotFoundException('Before/after entry not found');
    }

    return record;
  }

  async update(
    params: Prisma.ProjectBeforeAfterUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter> {
    const { where, data } = params;
    const client = tx ?? this.prismaClient;
    return client.projectBeforeAfter.update({ where, data });
  }

  async remove(
    where: Prisma.ProjectBeforeAfterWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectBeforeAfter> {
    const client = tx ?? this.prismaClient;
    return client.projectBeforeAfter.delete({ where });
  }

  async removeMany(
    where: Prisma.ProjectBeforeAfterWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    const result = await client.projectBeforeAfter.deleteMany({ where });
    return result.count;
  }

  async count(
    where: Prisma.ProjectBeforeAfterWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    return client.projectBeforeAfter.count({ where });
  }
}