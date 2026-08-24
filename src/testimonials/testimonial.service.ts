import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TestimonialRepository } from './testimonial.repository';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(
    private readonly testimonialRepository: TestimonialRepository,
  ) {}

  async create(dto: CreateTestimonialDto) {
    return this.testimonialRepository.create({
      content: dto.content,
      rating: dto.rating,
      isFeatured: dto.isFeatured ?? false,
      user: {
        connect: { id: BigInt(dto.userId) },
      },
    });
  }

  async findAll(query: QueryTestimonialDto) {
    const {
      page = 1,
      limit = 10,
      userId,
      isFeatured,
      minRating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.TestimonialWhereInput = {
      ...(userId && { userId: BigInt(userId) }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(minRating && { rating: { gte: minRating } }),
      ...(search && {
        content: { contains: search },
      }),
    };

    const [data, total] = await Promise.all([
      this.testimonialRepository.findAll({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.testimonialRepository.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: bigint) {
    return this.testimonialRepository.findOneOrThrow({ id });
  }

  async findByUser(userId: bigint) {
    return this.testimonialRepository.findAll({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured(limit = 10) {
    return this.testimonialRepository.findAll({
      where: { isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: bigint, dto: UpdateTestimonialDto, requesterId?: bigint) {
    if (requesterId) {
      await this.assertOwnership(id, requesterId, 'edit');
    }

    return this.testimonialRepository.update({
      where: { id },
      data: {
        content: dto.content,
        rating: dto.rating,
        isFeatured: dto.isFeatured,
      },
    });
  }

  async setFeatured(id: bigint, isFeatured: boolean) {
    return this.testimonialRepository.update({
      where: { id },
      data: { isFeatured },
    });
  }

  async remove(id: bigint, requesterId?: bigint) {
    if (requesterId) {
      await this.assertOwnership(id, requesterId, 'delete');
    }

    return this.testimonialRepository.remove({ id });
  }

async getAverageRating(userId?: bigint) {
  const args = {
    where: userId ? { userId } : undefined,
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  } satisfies Prisma.TestimonialAggregateArgs;

  const result = await this.testimonialRepository.aggregate(args);

  return {
    average: result._avg?.rating ?? 0,
    count: (result._count as Prisma.TestimonialCountAggregateInputType).rating ?? 0,
  };
}

  async countByUser(userId: bigint) {
    return this.testimonialRepository.count({ where: { userId } });
  }

  private async assertOwnership(
    id: bigint,
    requesterId: bigint,
    action: 'edit' | 'delete',
  ) {
    const existing = await this.testimonialRepository.findOneOrThrow({ id });

    if (existing.userId !== requesterId) {
      throw new ForbiddenException(`You cannot ${action} this testimonial`);
    }
  }
}
