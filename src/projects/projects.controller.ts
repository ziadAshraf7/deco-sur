import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
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
import { ProjectFilterDto } from './dto/project.query.dto';
import { ProjectService } from './projects.service';
import { IMAGE_FILE_SIZE_LIMIT, imageUploadOptions } from '../shared/files/multer.congif';

const UPLOAD_PREFIX = '/uploads/projects';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Get()
  findAll(@Query() filter: ProjectFilterDto) {
    return this.projectService.findAll(filter);
  }

  @Get('featured')
  getFeatured(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.projectService.getFeatured(limit);
  }

  @Get('stats/by-category')
  getStatsByCategory() {
    return this.projectService.getStatsByCategory();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(BigInt(id));
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

  // ---- Image upload ---------------------------------------------------
  // Generic single-image upload. Use this to get a heroImageUrl before
  // calling POST /projects, or whenever you just need "a URL for an image".

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: IMAGE_FILE_SIZE_LIMIT }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return { url: `${UPLOAD_PREFIX}/${file.filename}` };
  }

  // ---- Gallery -------------------------------------------------------

  @Post(':id/gallery')
  addGalleryImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() items: CreateGalleryItemDto[],
  ) {
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
      throw new BadRequestException('At least one image file is required');
    }

    const items: CreateGalleryItemDto[] = files.map((file) => ({
      imageUrl: `${UPLOAD_PREFIX}/${file.filename}`,
    }));

    return this.projectService.addGalleryImages(BigInt(id), items);
  }

  @Patch('gallery/:galleryId')
  updateGalleryImage(
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @Body() dto: UpdateGalleryItemDto,
  ) {
    return this.projectService.updateGalleryImage(BigInt(galleryId), dto);
  }

  @Delete('gallery/:galleryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGalleryImage(@Param('galleryId', ParseIntPipe) galleryId: number) {
    return this.projectService.removeGalleryImage(BigInt(galleryId));
  }


  @Post(':id/before-after')
  addBeforeAfter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBeforeAfterDto,
  ) {
    return this.projectService.addBeforeAfter(BigInt(id), dto);
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
  uploadBeforeAfter(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: { before?: Express.Multer.File[]; after?: Express.Multer.File[] },
    @Body() dto: Partial<Pick<CreateBeforeAfterDto, 'title' | 'description'>>,
  ) {
    const beforeFile = files?.before?.[0];
    const afterFile = files?.after?.[0];

    if (!beforeFile || !afterFile) {
      throw new BadRequestException('Both "before" and "after" images are required');
    }

    return this.projectService.addBeforeAfter(BigInt(id), {
      ...dto,
      beforeImageUrl: `${UPLOAD_PREFIX}/${beforeFile.filename}`,
      afterImageUrl: `${UPLOAD_PREFIX}/${afterFile.filename}`,
    });
  }

  @Patch('before-after/:itemId')
  updateBeforeAfter(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateBeforeAfterDto,
  ) {
    return this.projectService.updateBeforeAfter(BigInt(itemId), dto);
  }

  @Delete('before-after/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBeforeAfter(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.projectService.removeBeforeAfter(BigInt(itemId));
  }
}