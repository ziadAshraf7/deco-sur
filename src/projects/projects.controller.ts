import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProjectFilterDto } from './dto/project.query.dto';
import { ProjectService } from './projects.service';
import { Auth } from '../shared/guards/auth.decerator';

@Controller('projects')
@Auth('CLIENT' , "ADMIN")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(@Query() filter: ProjectFilterDto) {
    return this.projectService.findAll(filter);
  }

  @Get('featured')
  getFeatured(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.projectService.getFeatured(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(BigInt(id));
  }
}