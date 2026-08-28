import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, ProjectCategory } from '@prisma/client';
import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
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
const UPLOAD_PREFIX = '/uploads/projects';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly galleryRepository: ProjectGalleryRepository,
    private readonly beforeAfterRepository: ProjectBeforeAfterRepository,
  ) {}


async create(dto: CreateProjectDto) {
  const {
    gallery,
    beforeAftersImages: beforeAfters,
    serviceTypes,
    ...rest
  } = dto;

  const data: Prisma.ProjectCreateInput = {
    ...rest,

    slug: dto.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-'),

    heroImageUrl: dto.heroImageUrl!,

    serviceTypes: serviceTypes as unknown as Prisma.InputJsonValue,

    ...(gallery?.length && {
      gallery: {
        create: gallery.map((item) => ({
          imageUrl: item.imageUrl!,
          caption: item.caption,
        })),
      },
    }),

    ...(beforeAfters?.length && {
      beforeAfters: {
        create: beforeAfters.map((item) => ({
          beforeImageUrl: item.beforeImageUrl!,
          afterImageUrl: item.afterImageUrl!,
          title: item.title,
          description: item.description,
        })),
      },
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

    const { serviceTypes , ...rest } = dto;

    const data: Prisma.ProjectUpdateInput = {
      ...rest,
      ...(serviceTypes && {
        serviceTypes: serviceTypes as unknown as Prisma.InputJsonValue,
      })
    };

    await this.projectRepository.update({ where: { id }, data });
    return this.projectRepository.findOneOrThrow(
      { id },
      PROJECT_DETAIL_INCLUDE,
    );
  }

  async remove(id: bigint) {
    const project = await this.projectRepository.findOneOrThrow({ id });
    const [gallery, beforeAfters] = await Promise.all([
      this.galleryRepository.findAll({ where: { projectId: id } }),
      this.beforeAfterRepository.findAll({ where: { projectId: id } }),
    ]);

    const removedProject = await this.projectRepository.remove({ id });

    await Promise.all([
      this.removeFile(project.heroImageUrl),
      ...gallery.map((item) => this.removeFile(item.imageUrl)),
      ...beforeAfters.flatMap((item) => [
        this.removeFile(item.beforeImageUrl),
        this.removeFile(item.afterImageUrl),
      ]),
    ]);

    return removedProject;
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


async addGalleryImages(
  projectId: bigint,
  items: CreateGalleryItemDto[],
) {
  if (!items.length) {
    throw new BadRequestException('At least one gallery item is required');
  }

  await this.projectRepository.findOneOrThrow({ id: projectId });

  await this.galleryRepository.createMany(
    items.map((item) => ({
      projectId,
      imageUrl: item.imageUrl!,
      caption: item.caption,
    })),
  );

  return this.galleryRepository.findAll({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  });
}

  async updateGalleryImage(galleryId: bigint, dto: UpdateGalleryItemDto) {
    const gallery = await this.galleryRepository.findOneOrThrow({ id: galleryId });
    const updated = await this.galleryRepository.update({
      where: { id: galleryId },
      data: dto,
    });

    if (dto.imageUrl && dto.imageUrl !== gallery.imageUrl) {
      await this.removeFile(gallery.imageUrl);
    }

    return updated;
  }

  async removeGalleryImage(galleryId: bigint) {
    const gallery = await this.galleryRepository.findOneOrThrow({ id: galleryId });
    const removedGallery = await this.galleryRepository.remove({ id: galleryId });
    await this.removeFile(gallery.imageUrl);
    return removedGallery;
  }


  async addBeforeAfter(projectId: bigint, dto: CreateBeforeAfterDto) {
    await this.projectRepository.findOneOrThrow({ id: projectId });
    const {afterImageUrl , beforeImageUrl , ...rest } = dto
    return this.beforeAfterRepository.create({
      ...rest,
      afterImageUrl : afterImageUrl!  , 
      beforeImageUrl : beforeImageUrl! , 
      project : {connect : {id : projectId}}
    });
  }

  async updateBeforeAfter(id: bigint, dto: UpdateBeforeAfterDto) {
    const beforeAfter = await this.beforeAfterRepository.findOneOrThrow({ id });
    const updated = await this.beforeAfterRepository.update({ where: { id }, data: dto });

    if (
      dto.beforeImageUrl &&
      dto.beforeImageUrl !== beforeAfter.beforeImageUrl
    ) {
      await this.removeFile(beforeAfter.beforeImageUrl);
    }

    if (
      dto.afterImageUrl &&
      dto.afterImageUrl !== beforeAfter.afterImageUrl
    ) {
      await this.removeFile(beforeAfter.afterImageUrl);
    }

    return updated;
  }

  async removeBeforeAfter(id: bigint) {
    const beforeAfter = await this.beforeAfterRepository.findOneOrThrow({ id });
    const removedBeforeAfter = await this.beforeAfterRepository.remove({ id });
    await Promise.all([
      this.removeFile(beforeAfter.beforeImageUrl),
      this.removeFile(beforeAfter.afterImageUrl),
    ]);
    return removedBeforeAfter;
  }

  async removeFile(fileUrl?: string) {
    if (!fileUrl?.startsWith(`${UPLOAD_PREFIX}/`)) {
      return;
    }

    const filePath = resolve(process.cwd(), 'uploads', 'projects', basename(fileUrl));

    try {
      await unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }


  
}