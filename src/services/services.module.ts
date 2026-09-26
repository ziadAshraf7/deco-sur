import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceAdminController } from './service.admin.controller';
import { CatalogService } from './catalog.service';
import { ServiceRepository } from './service.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ServiceController, ServiceAdminController],
  providers: [CatalogService, ServiceRepository],
  imports: [AuthModule, UsersModule],
  exports: [CatalogService],
})
export class ServicesModule {}
