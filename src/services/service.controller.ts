import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { QueryServiceDto } from './dto/query-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(@Query() query: QueryServiceDto) {
    return this.catalogService.findAll(query);
  }

  @Get('all')
  findAllRaw() {
    return this.catalogService.findAllRaw();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.catalogService.findBySlugOrType(slug);
  }
}
