import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  CreateBeforeAfterDto,
  CreateGalleryItemDto,
  CreateProjectDto,
} from './dto/create-project.dto';
import {
  UpdateBeforeAfterDto,
  UpdateGalleryItemDto,
  UpdateProjectDto,
} from './dto/update-project.dto';
import { ProjectService } from './projects.service';
import { IMAGE_FILE_SIZE_LIMIT, imageUploadOptions } from '../shared/files/multer.congif';
import { Auth } from '../shared/guards/auth.decerator';

const UPLOAD_PREFIX = '/uploads/projects';

type UploadedFilesMap = {
  heroImageUrl?: Express.Multer.File[];
  gallery?: Express.Multer.File[];
  beforeAftersImages?: Express.Multer.File[];
};

type GalleryUploadFilesMap = {
  files?: Express.Multer.File[];
};

type BeforeAfterUploadFilesMap = {
  before?: Express.Multer.File[];
  after?: Express.Multer.File[];
};

@Controller('/admin/projects')
@Auth('ADMIN')
export class ProjectAdminController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'heroImageUrl', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
        { name: 'beforeAftersImages', maxCount: 20 },
      ],
      imageUploadOptions,
    ),
  )
  create(
    @UploadedFiles() files: UploadedFilesMap,
    @Body() dto: CreateProjectDto,
  ) {
    const baseUrl = UPLOAD_PREFIX;

    if (!files.heroImageUrl?.length) {
      throw new BadRequestException('messages.heroImageRequired');
    }
    dto.heroImageUrl = `${baseUrl}/${files.heroImageUrl[0].filename}`;

    if (files.gallery?.length) {
      dto.gallery = files.gallery.map((file, i) => ({
        imageUrl: `${baseUrl}/${file.filename}`,
        caption: dto.gallery?.[i]?.caption,
      }));
    }

    if (files.beforeAftersImages?.length) {
      if (files.beforeAftersImages.length % 2 !== 0) {
        throw new BadRequestException(
          'messages.beforeAfterEvenFiles',
        );
      }

      const pairs: any[] = [];
      for (let i = 0; i < files.beforeAftersImages.length; i += 2) {
        const before = files.beforeAftersImages[i];
        const after = files.beforeAftersImages[i + 1];
        const meta = dto.beforeAftersImages?.[i / 2];

        pairs.push({
          beforeImageUrl: `${baseUrl}/${before.filename}`,
          afterImageUrl: `${baseUrl}/${after.filename}`,
          title: meta?.title,
          description: meta?.description,
        });
      }
      dto.beforeAftersImages = pairs;
    }
    return this.projectService.create(dto);
  }

  @Get('stats/by-category')
  getStatsByCategory() {
    return this.projectService.getStatsByCategory();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(BigInt(id), dto);
  }

  @Patch(':id/toggle-featured')
  toggleFeatured(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.toggleFeatured(BigInt(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(BigInt(id));
  }


  @Post(':id/gallery')
  @UseInterceptors(FilesInterceptor('files', 10, imageUploadOptions))
  addGalleryImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() uploaded: Express.Multer.File[],
    @Body() dto: CreateProjectDto['gallery'] extends never
      ? never
      : { gallery?: CreateGalleryItemDto[] },
  ) {
    let items: CreateGalleryItemDto[];

    if (uploaded?.length) {
      items = uploaded.map((file, i) => ({
        imageUrl: `${UPLOAD_PREFIX}/${file.filename}`,
        caption: dto.gallery?.[i]?.caption,
      }));
    } else {
      if (!dto.gallery?.length) {
        throw new BadRequestException(
          'messages.galleryInputRequired',
        );
      }
      items = dto.gallery.map((item) => {
        if (!item.imageUrl) {
          throw new BadRequestException(
            'messages.galleryImageUrlRequired',
          );
        }
        return item as CreateGalleryItemDto;
      });
    }

    return this.projectService.addGalleryImages(BigInt(id), items);
  }


  @Post(':id/gallery/upload')
  @UseInterceptors(FilesInterceptor('files', 10, imageUploadOptions))
  uploadGalleryImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: IMAGE_FILE_SIZE_LIMIT })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    if (!files?.length) {
      throw new BadRequestException('messages.imageFileRequired');
    }

    const items: CreateGalleryItemDto[] = files.map((file) => ({
      imageUrl: `${UPLOAD_PREFIX}/${file.filename}`,
    }));

    return this.projectService.addGalleryImages(BigInt(id), items);
  }

  @Patch('gallery/:galleryId')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  updateGalleryImage(
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UpdateGalleryItemDto,
  ) {
    if (file) {
      dto.imageUrl = `${UPLOAD_PREFIX}/${file.filename}`;
    }
    return this.projectService.updateGalleryImage(BigInt(galleryId), dto);
  }

  @Delete('gallery/:galleryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGalleryImage(@Param('galleryId', ParseIntPipe) galleryId: number) {
    return this.projectService.removeGalleryImage(BigInt(galleryId));
  }


  @Post(':id/before-after/upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'before', maxCount: 1 },
        { name: 'after', maxCount: 1 },
      ],
      imageUploadOptions,
    ),
  )
  addBeforeAfter(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: BeforeAfterUploadFilesMap,
    @Body() dto: CreateBeforeAfterDto,
  ) {
    const beforeFile = files?.before?.[0];
    const afterFile = files?.after?.[0];

    const beforeImageUrl = beforeFile
      ? `${UPLOAD_PREFIX}/${beforeFile.filename}`
      : dto.beforeImageUrl;
    const afterImageUrl = afterFile
      ? `${UPLOAD_PREFIX}/${afterFile.filename}`
      : dto.afterImageUrl;

    if (!beforeImageUrl || !afterImageUrl) {
      throw new BadRequestException(
        'messages.beforeAfterImagesRequired',
      );
    }

    return this.projectService.addBeforeAfter(BigInt(id), {
      ...dto,
      beforeImageUrl,
      afterImageUrl,
    });
  }

@Patch('before-after/:beforeAfterId')
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'before', maxCount: 1 },
      { name: 'after', maxCount: 1 },
    ],
    imageUploadOptions,
  ),
)
updateBeforeAfter(
  @Param('beforeAfterId', ParseIntPipe) beforeAfterId: number,
  @UploadedFiles() files: BeforeAfterUploadFilesMap,
  @Body() dto: UpdateBeforeAfterDto,
) {
  const beforeFile = files?.before?.[0];
  const afterFile = files?.after?.[0];

  if (beforeFile) {
    dto.beforeImageUrl = `${UPLOAD_PREFIX}/${beforeFile.filename}`;
  }

  if (afterFile) {
    dto.afterImageUrl = `${UPLOAD_PREFIX}/${afterFile.filename}`;
  }

  return this.projectService.updateBeforeAfter(
    BigInt(beforeAfterId),
    dto,
  );
}

@Delete('before-after/:beforeAfterId')
@HttpCode(HttpStatus.NO_CONTENT)
removeBeforeAfter(@Param('beforeAfterId', ParseIntPipe) beforeAfterId: number) {
  return this.projectService.removeBeforeAfter(BigInt(beforeAfterId));
}
}
