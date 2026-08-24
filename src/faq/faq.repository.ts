import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Faq } from '@prisma/client';

@Injectable()
export class FaqRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.FaqCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq> {
    const client = tx ?? this.prismaClient;

    return client.faq.create({
      data,
    });
  }

  async findAll(
    params: Prisma.FaqFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq[]> {
    const { skip, take, cursor, where, orderBy } = params;

    const client = tx ?? this.prismaClient;

    return client.faq.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    where: Prisma.FaqWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq | null> {
    const client = tx ?? this.prismaClient;

    return client.faq.findUnique({
      where,
    });
  }

  async findOneOrThrow(
    where: Prisma.FaqWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq> {
    const client = tx ?? this.prismaClient;

    const record = await client.faq.findUnique({
      where,
    });

    if (!record) {
      throw new NotFoundException('Faq not found');
    }

    return record;
  }

  async update(
    params: Prisma.FaqUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    return client.faq.update({
      where,
      data,
    });
  }

  async updateMany(
    params: Prisma.FaqUpdateManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    const result = await client.faq.updateMany({
      where,
      data,
    });

    return result.count;
  }

  async remove(
    where: Prisma.FaqWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq> {
    const client = tx ?? this.prismaClient;

    return client.faq.delete({
      where,
    });
  }

  async count(
    params: Prisma.FaqCountArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where } = params;

    const client = tx ?? this.prismaClient;

    return client.faq.count({
      where,
    });
  }

  async upsert(
    params: Prisma.FaqUpsertArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Faq> {
    const { where, create, update } = params;

    const client = tx ?? this.prismaClient;

    return client.faq.upsert({
      where,
      create,
      update,
    });
  }

  async aggregate(
    params: Prisma.FaqAggregateArgs,
    tx?: Prisma.TransactionClient,
  ) {
    const { where, _count, _sum, _avg, _min, _max } = params;

    const client = tx ?? this.prismaClient;

    return client.faq.aggregate({
      where,
      _count,
      _sum,
      _avg,
      _min,
      _max,
    });
  }

  async groupBy(
    params: Prisma.FaqGroupByArgs,
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

    return client.faq.groupBy({
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
