import { Module } from '@nestjs/common';
import { ProjectRepository } from './projects.repository';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { ProjectGalleryRepository } from './repositories/project.gallery.repository';
import { ProjectBeforeAfterRepository } from './repositories/project.beforeAfter.repository';
import { ProjectAdminController } from './projects.admin.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ProjectController , ProjectAdminController],
  providers: [ProjectService , ProjectGalleryRepository , ProjectBeforeAfterRepository , ProjectRepository],
  imports : [AuthModule , UsersModule]
})
export class ProjectsModule {}
