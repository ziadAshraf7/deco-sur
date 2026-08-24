import { Module } from '@nestjs/common';
import { ProjectRepository } from './projects.repository';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { ProjectGalleryRepository } from './repositories/project.gallery.repository';
import { ProjectBeforeAfterRepository } from './repositories/project.beforeAfter.repository';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService , ProjectGalleryRepository , ProjectBeforeAfterRepository , ProjectRepository],
})
export class ProjectsModule {}
