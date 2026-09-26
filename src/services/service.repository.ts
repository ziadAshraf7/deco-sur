import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prismaClient.service.create({ data });
  }

  async findAll(params: Prisma.ServiceFindManyArgs): Promise<Service[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaClient.service.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.ServiceWhereUniqueInput): Promise<Service | null> {
    return this.prismaClient.service.findUnique({ where });
  }

  async findFirst(where: Prisma.ServiceWhereInput): Promise<Service | null> {
    return this.prismaClient.service.findFirst({ where });
  }

  async findOneOrThrow(where: Prisma.ServiceWhereUniqueInput): Promise<Service> {
    const record = await this.prismaClient.service.findUnique({ where });

    if (!record) {
      throw new NotFoundException('messages.serviceNotFound');
    }

    return record;
  }

  async update(params: Prisma.ServiceUpdateArgs): Promise<Service> {
    const { where, data } = params;
    return this.prismaClient.service.update({ where, data });
  }

  async remove(where: Prisma.ServiceWhereUniqueInput): Promise<Service> {
    return this.prismaClient.service.delete({ where });
  }

  async count(params: Prisma.ServiceCountArgs): Promise<number> {
    return this.prismaClient.service.count(params);
  }
}
