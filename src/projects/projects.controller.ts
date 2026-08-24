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
} from '@nestjs/common';
import { CreateBeforeAfterDto, CreateGalleryItemDto, CreateProjectDto } from './dto/create-project.dto';
import { UpdateBeforeAfterDto, UpdateGalleryItemDto, UpdateProjectDto } from './dto/update-project.dto';
import { ProjectFilterDto } from './dto/project.query.dto';
import { ProjectService } from './projects.service';


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

  // ---- Gallery -------------------------------------------------------

  @Post(':id/gallery')
  addGalleryImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() items: CreateGalleryItemDto[],
  ) {
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

  // ---- Before / After --------------------------------------------------

  @Post(':id/before-after')
  addBeforeAfter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBeforeAfterDto,
  ) {
    return this.projectService.addBeforeAfter(BigInt(id), dto);
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