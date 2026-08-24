import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FaqRepository } from './faq.repository';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async create(dto: CreateFaqDto) {
    return this.faqRepository.create({
      question: dto.question,
      answer: dto.answer,
    });
  }

  async findAll(query: QueryFaqDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.FaqWhereInput = {
      ...(search && {
        OR: [
          { question: { contains: search } },
          { answer: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.faqRepository.findAll({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.faqRepository.count({ where }),
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

  async findAllRaw() {
    return this.faqRepository.findAll({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: bigint) {
    return this.faqRepository.findOneOrThrow({ id });
  }

  async update(id: bigint, dto: UpdateFaqDto) {
    return this.faqRepository.update({
      where: { id },
      data: {
        question: dto.question,
        answer: dto.answer,
      },
    });
  }

  async remove(id: bigint) {
    return this.faqRepository.remove({ id });
  }

  async count() {
    return this.faqRepository.count({});
  }
}
