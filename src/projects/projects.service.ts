import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, ProjectCategory } from '@prisma/client';
import { CreateBeforeAfterDto, CreateGalleryItemDto, CreateProjectDto } from './dto/create-project.dto';
import { UpdateBeforeAfterDto, UpdateGalleryItemDto, UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project.query.dto';
import { ProjectRepository } from './projects.repository';
import { ProjectBeforeAfterRepository } from './repositories/project.beforeAfter.repository';
import { ProjectGalleryRepository } from './repositories/project.gallery.repository';


const PROJECT_DETAIL_INCLUDE = {
  gallery: { orderBy: { createdAt: 'asc' as const } },
  beforeAfters: { orderBy: { createdAt: 'asc' as const } },
};

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly galleryRepository: ProjectGalleryRepository,
    private readonly beforeAfterRepository: ProjectBeforeAfterRepository,
  ) {}


  async create(dto: CreateProjectDto) {
    const { gallery, beforeAftersImages: beforeAfters, serviceTypes, ...rest } = dto;

    const data: Prisma.ProjectCreateInput = {
      ...rest,
      serviceTypes: serviceTypes as unknown as Prisma.InputJsonValue,
      ...(gallery?.length && {
        gallery: { create: gallery.map((item) => ({ ...item })) },
      }),
      ...(beforeAfters?.length && {
        beforeAfters: { create: beforeAfters.map((item) => ({ ...item })) },
      }),
    };

    const created = await this.projectRepository.create(data);
    return this.projectRepository.findOneOrThrow(
      { id: created.id },
      PROJECT_DETAIL_INCLUDE,
    );
  }

  async findAll(filter: ProjectFilterDto) {
    const { category, serviceType, isFeatured, search, page, limit } = filter;

    const where: Prisma.ProjectWhereInput = {
      ...(category && { category }),
      ...(typeof isFeatured === 'boolean' && { isFeatured }),
      ...(serviceType && {
        serviceTypes: { array_contains: serviceType } as Prisma.JsonFilter,
      }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search} },
          { location: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.projectRepository.findAll({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: PROJECT_DETAIL_INCLUDE,
      }),
      this.projectRepository.count({ where }),
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
    return this.projectRepository.findOneOrThrow(
      { id },
      PROJECT_DETAIL_INCLUDE,
    );
  }

  async update(id: bigint, dto: UpdateProjectDto) {
    await this.projectRepository.findOneOrThrow({ id });

    const { serviceTypes , beforeAftersImages , gallery, ...rest } = dto;

    const restData: Prisma.ProjectUpdateInput = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    );

    const data: Prisma.ProjectUpdateInput = {
      ...restData,
      ...(serviceTypes && {
        serviceTypes: serviceTypes as unknown as Prisma.InputJsonValue,
      }),
      ...(gallery ?? {gallery : {create : gallery}}) , 
      ...(beforeAftersImages ?? {beforeAfters : {create : beforeAftersImages}}) 
    };

    await this.projectRepository.update({ where: { id }, data });
    return this.projectRepository.findOneOrThrow(
      { id },
      PROJECT_DETAIL_INCLUDE,
    );
  }

  async remove(id: bigint) {
    await this.projectRepository.findOneOrThrow({ id });
    return this.projectRepository.remove({ id });
  }

  async toggleFeatured(id: bigint) {
    const project = await this.projectRepository.findOneOrThrow({ id });
    return this.projectRepository.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });
  }

  async getFeatured(limit = 4) {
    return this.projectRepository.findAll({
      where: { isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: PROJECT_DETAIL_INCLUDE,
    });
  }

  async getStatsByCategory() {
    const categories = Object.values(ProjectCategory);

    const counts = await Promise.all(
      categories.map((category) =>
        this.projectRepository.count({ where: { category } }),
      ),
    );

    return categories.map((category, i) => ({
      category,
      count: counts[i],
    }));
  }


  async addGalleryImages(projectId: bigint, items: CreateGalleryItemDto[]) {
    if (!items.length) {
      throw new BadRequestException('At least one gallery item is required');
    }

    await this.projectRepository.findOneOrThrow({ id: projectId });

    await this.galleryRepository.createMany(
      items.map((item) => ({ ...item, projectId })),
    );

    return this.galleryRepository.findAll({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateGalleryImage(galleryId: bigint, dto: UpdateGalleryItemDto) {
    await this.galleryRepository.findOneOrThrow({ id: galleryId });
    return this.galleryRepository.update({
      where: { id: galleryId },
      data: dto,
    });
  }

  async removeGalleryImage(galleryId: bigint) {
    await this.galleryRepository.findOneOrThrow({ id: galleryId });
    return this.galleryRepository.remove({ id: galleryId });
  }


  async addBeforeAfter(projectId: bigint, dto: CreateBeforeAfterDto) {
    await this.projectRepository.findOneOrThrow({ id: projectId });
    return this.beforeAfterRepository.create({
      ...dto,
      project: { connect: { id: projectId } },
    });
  }

  async updateBeforeAfter(id: bigint, dto: UpdateBeforeAfterDto) {
    await this.beforeAfterRepository.findOneOrThrow({ id });
    return this.beforeAfterRepository.update({ where: { id }, data: dto });
  }

  async removeBeforeAfter(id: bigint) {
    await this.beforeAfterRepository.findOneOrThrow({ id });
    return this.beforeAfterRepository.remove({ id });
  }
}