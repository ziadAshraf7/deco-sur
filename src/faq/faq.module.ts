import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { FaqRepository } from './faq.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [FaqController],
  providers: [FaqService, FaqRepository],
  exports: [FaqService, FaqRepository],
  imports : [AuthModule , UsersModule]
})
export class FaqModule {}
