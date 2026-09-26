import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../shared/guards/auth.decerator';
import { CatalogService } from './catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { imageUploadOptions } from '../shared/files/multer.congif';
 
const UPLOAD_PREFIX = '/uploads/services';
 
@Controller('admin/services')
@Auth('ADMIN')
export class ServiceAdminController {
  constructor(private readonly catalogService: CatalogService) {}
 
  @Post()
  @UseInterceptors(FileInterceptor('imageUrl', imageUploadOptions))
  create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CreateServiceDto,
  ) {
    if (file) {
      dto.imageUrl = `${UPLOAD_PREFIX}/${file.filename}`;
    }
    return this.catalogService.create(dto);
  }
 
  @Get()
  findAll(@Query() query: QueryServiceDto) {
    return this.catalogService.findAll(query, { includeInactive: true, presentation: 'admin' });
  }
 
  @Get('all')
  findAllRaw() {
    return this.catalogService.findAllRaw(true, 'admin');
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(BigInt(id));
  }
 
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl', imageUploadOptions))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UpdateServiceDto,
  ) {
    if (file) {
      dto.imageUrl = `${UPLOAD_PREFIX}/${file.filename}`;
    }
    return this.catalogService.update(BigInt(id), dto);
  }
 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(BigInt(id));
  }
}