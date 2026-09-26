import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth } from '../shared/guards/auth.decerator';
import { CatalogService } from './catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('admin/services')
@Auth('ADMIN')
export class ServiceAdminController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.catalogService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(BigInt(id));
  }
}
