import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { AdminTestimonialController } from './testimonial.admin.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from './testimonial.repository';
import { AdminTestimonialService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TestimonialController, AdminTestimonialController],
  providers: [
    TestimonialService,
    TestimonialRepository,
    AdminTestimonialService,
  ],
  imports: [AuthModule , UsersModule],
  exports: [TestimonialService, TestimonialRepository],
})
export class TestimonialModule {}
