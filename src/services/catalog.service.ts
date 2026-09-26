import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, Service, ServiceType } from '@prisma/client';
import { ServiceRepository } from './service.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DEFAULT_SERVICES } from './default-services';
import { resolveAppLang, toAdminService, toPublicService } from './service-i18n';

type Presentation = 'public' | 'admin';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async onModuleInit() {
    for (const service of DEFAULT_SERVICES) {
      const existing = await this.serviceRepository.findOne({ type: service.type });

      if (!existing) {
        await this.serviceRepository.create({
          type: service.type,
          slug: service.slug,
          titleEn: service.en.title,
          titleFr: service.fr.title,
          excerptEn: service.en.excerpt,
          excerptFr: service.fr.excerpt,
          descriptionEn: service.en.description,
          descriptionFr: service.fr.description,
          sortOrder: service.sortOrder,
        });
        continue;
      }

      const data: Prisma.ServiceUpdateInput = {};
      if (!existing.titleFr) data.titleFr = service.fr.title;
      if (!existing.excerptFr) data.excerptFr = service.fr.excerpt;
      if (!existing.descriptionFr) data.descriptionFr = service.fr.description;

      if (Object.keys(data).length > 0) {
        await this.serviceRepository.update({
          where: { id: existing.id },
          data,
        });
      }
    }
  }

  slugFromType(type: ServiceType) {
    return type.toLowerCase().replace(/_/g, '-');
  }

  private present(service: Service, presentation: Presentation) {
    return presentation === 'admin'
      ? toAdminService(service)
      : toPublicService(service);
  }

  async create(dto: CreateServiceDto) {
    const slug = dto.slug ?? this.slugFromType(dto.type);

    const existingType = await this.serviceRepository.findOne({ type: dto.type });
    if (existingType) {
      throw new ConflictException('messages.serviceTypeExists');
    }

    const existingSlug = await this.serviceRepository.findOne({ slug });
    if (existingSlug) {
      throw new ConflictException('messages.serviceSlugExists');
    }

    const created = await this.serviceRepository.create({
      type: dto.type,
      slug,
      titleEn: dto.title.en,
      titleFr: dto.title.fr,
      excerptEn: dto.excerpt?.en,
      excerptFr: dto.excerpt?.fr,
      descriptionEn: dto.description.en,
      descriptionFr: dto.description.fr,
      imageUrl: dto.imageUrl,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });

    return toAdminService(created);
  }

  async findAll(
    query: QueryServiceDto,
    options?: { includeInactive?: boolean; presentation?: Presentation },
  ) {
    const presentation = options?.presentation ?? 'public';
    const {
      page = 1,
      limit = 20,
      search,
      type,
      isActive,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.ServiceWhereInput = {
      ...(type && { type }),
      ...(search && {
        OR: [
          { titleEn: { contains: search } },
          { titleFr: { contains: search } },
          { excerptEn: { contains: search } },
          { excerptFr: { contains: search } },
          { descriptionEn: { contains: search } },
          { descriptionFr: { contains: search } },
          { slug: { contains: search } },
        ],
      }),
    };

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    } else if (!options?.includeInactive) {
      where.isActive = true;
    }

    const titleSortField = resolveAppLang() === 'fr' ? 'titleFr' : 'titleEn';
    const orderBy =
      sortBy === 'title'
        ? { [titleSortField]: sortOrder }
        : { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.serviceRepository.findAll({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [orderBy, { titleEn: 'asc' }],
      }),
      this.serviceRepository.count({ where }),
    ]);

    return {
      data: data.map((service) => this.present(service, presentation)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllRaw(
    includeInactive = false,
    presentation: Presentation = 'public',
  ) {
    const data = await this.serviceRepository.findAll({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { titleEn: 'asc' }],
    });

    return data.map((service) => this.present(service, presentation));
  }

  async findOne(id: bigint, presentation: Presentation = 'admin') {
    const service = await this.serviceRepository.findOneOrThrow({ id });
    return this.present(service, presentation);
  }

  async findBySlugOrType(slugOrType: string) {
    const asType = slugOrType.toUpperCase().replace(/-/g, '_') as ServiceType;
    const isEnum = Object.values(ServiceType).includes(asType);

    const record = await this.serviceRepository.findFirst({
      OR: [{ slug: slugOrType }, ...(isEnum ? [{ type: asType }] : [])],
      isActive: true,
    });

    if (!record) {
      throw new NotFoundException('messages.serviceNotFound');
    }

    return toPublicService(record);
  }

  async update(id: bigint, dto: UpdateServiceDto) {
    await this.serviceRepository.findOneOrThrow({ id });

    if (dto.slug) {
      const existingSlug = await this.serviceRepository.findOne({ slug: dto.slug });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('messages.serviceSlugExists');
      }
    }

    const updated = await this.serviceRepository.update({
      where: { id },
      data: {
        slug: dto.slug,
        titleEn: dto.title?.en,
        titleFr: dto.title?.fr,
        excerptEn: dto.excerpt?.en,
        excerptFr: dto.excerpt?.fr,
        descriptionEn: dto.description?.en,
        descriptionFr: dto.description?.fr,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      },
    });

    return toAdminService(updated);
  }

  async remove(id: bigint) {
    await this.serviceRepository.findOneOrThrow({ id });
    return toAdminService(await this.serviceRepository.remove({ id }));
  }
}
