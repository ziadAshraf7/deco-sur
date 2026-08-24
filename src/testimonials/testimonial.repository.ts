import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Testimonial } from '@prisma/client';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.TestimonialCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial> {
    const client = tx ?? this.prismaClient;

    return client.testimonial.create({
      data,
    });
  }

  async findAll(
    params: Prisma.TestimonialFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial[]> {
    const { skip, take, cursor, where, include, orderBy } = params;

    const client = tx ?? this.prismaClient;

    return client.testimonial.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findOne(
    where: Prisma.TestimonialWhereUniqueInput,
    include?: Prisma.TestimonialInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial | null> {
    const client = tx ?? this.prismaClient;

    return client.testimonial.findUnique({
      where,
      include,
    });
  }

  async findOneOrThrow(
    where: Prisma.TestimonialWhereUniqueInput,
    include?: Prisma.TestimonialInclude,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial> {
    const client = tx ?? this.prismaClient;

    const record = await client.testimonial.findUnique({
      where,
      include,
    });

    if (!record) {
      throw new NotFoundException('Testimonial not found');
    }

    return record;
  }

  async update(
    params: Prisma.TestimonialUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    return client.testimonial.update({
      where,
      data,
    });
  }

  async updateMany(
    params: Prisma.TestimonialUpdateManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where, data } = params;

    const client = tx ?? this.prismaClient;

    const result = await client.testimonial.updateMany({
      where,
      data,
    });

    return result.count;
  }

  async remove(
    where: Prisma.TestimonialWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial> {
    const client = tx ?? this.prismaClient;

    return client.testimonial.delete({
      where,
    });
  }

  async count(
    params: Prisma.TestimonialCountArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const { where } = params;

    const client = tx ?? this.prismaClient;

    return client.testimonial.count({
      where,
    });
  }

  async upsert(
    params: Prisma.TestimonialUpsertArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<Testimonial> {
    const { where, create, update } = params;

    const client = tx ?? this.prismaClient;

    return client.testimonial.upsert({
      where,
      create,
      update,
    });
  }

  async aggregate(
    params: Prisma.TestimonialAggregateArgs,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prismaClient;

    return client.testimonial.aggregate(params);
  }

  async groupBy(
    params: Prisma.TestimonialGroupByArgs,
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

    return client.testimonial.groupBy({
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
