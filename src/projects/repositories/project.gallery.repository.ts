import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ProjectGallery } from '@prisma/client';

@Injectable()
export class ProjectGalleryRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(
    data: Prisma.ProjectGalleryCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery> {
    const client = tx ?? this.prismaClient;
    return client.projectGallery.create({ data });
  }

  async createMany(
    data: Prisma.ProjectGalleryCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    const result = await client.projectGallery.createMany({ data });
    return result.count;
  }

  async findAll(
    params: Prisma.ProjectGalleryFindManyArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const client = tx ?? this.prismaClient;

    return client.projectGallery.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    where: Prisma.ProjectGalleryWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery | null> {
    const client = tx ?? this.prismaClient;
    return client.projectGallery.findUnique({ where });
  }

  async findOneOrThrow(
    where: Prisma.ProjectGalleryWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery> {
    const client = tx ?? this.prismaClient;
    const record = await client.projectGallery.findUnique({ where });

    if (!record) {
      throw new NotFoundException('messages.galleryImageNotFound');
    }

    return record;
  }

  async update(
    params: Prisma.ProjectGalleryUpdateArgs,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery> {
    const { where, data } = params;
    const client = tx ?? this.prismaClient;
    return client.projectGallery.update({ where, data });
  }

  async remove(
    where: Prisma.ProjectGalleryWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProjectGallery> {
    const client = tx ?? this.prismaClient;
    return client.projectGallery.delete({ where });
  }

  async removeMany(
    where: Prisma.ProjectGalleryWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    const result = await client.projectGallery.deleteMany({ where });
    return result.count;
  }

  async count(
    where: Prisma.ProjectGalleryWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prismaClient;
    return client.projectGallery.count({ where });
  }
}