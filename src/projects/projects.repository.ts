import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.ProjectCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Project> {
    const client = tx ?? this.prismaClient;

    return client.project.create({
      data,
    });
  }

  async findAll(
    params: Prisma.ProjectFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Project[]> {
    const {
      skip,
      take,
      cursor,
      where,
      include,
      orderBy,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findOne(
    where: Prisma.ProjectWhereUniqueInput,
    include?: Prisma.ProjectInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<Project | null> {
    const client = tx ?? this.prismaClient;

    return client.project.findUnique({
      where,
      include,
    });
  }

  async findOneOrThrow(
    where: Prisma.ProjectWhereUniqueInput,
    include?: Prisma.ProjectInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<Project> {
    const client = tx ?? this.prismaClient;

    const record = await client.project.findUnique({
      where,
      include,
    });

    if (!record) {
      throw new NotFoundException('messages.projectNotFound');
    }

    return record;
  }

  async update(
    params: Prisma.ProjectUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Project> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    return client.project.update({
      where,
      data,
    });
  }

  async updateMany(
    params: Prisma.ProjectUpdateManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    const result = await client.project.updateMany({
      where,
      data,
    });

    return result.count;
  }

  async remove(
    where: Prisma.ProjectWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Project> {
    const client = tx ?? this.prismaClient;

    return client.project.delete({
      where,
    });
  }

  async count(
    params: Prisma.ProjectCountArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where } = params;

    const client = tx ?? this.prismaClient;

    return client.project.count({
      where,
    });
  }

  async upsert(
    params: Prisma.ProjectUpsertArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Project> {
    const {
      where,
      create,
      update,
    } = params;

    const client = tx ?? this.prismaClient;

    return client.project.upsert({
      where,
      create,
      update,
    });
  }

  async aggregate(
    params: Prisma.ProjectAggregateArgs,
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

    return client.project.aggregate({
      where,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    });
  }

  async groupBy(
    params: Prisma.ProjectGroupByArgs,
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

    return client.project.groupBy({
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