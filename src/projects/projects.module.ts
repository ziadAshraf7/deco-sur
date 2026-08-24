import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from './projects.repository';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService , ProjectRepository],
})
export class ProjectsModule {}
