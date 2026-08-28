import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { AdminTestimonialController } from './testimonial.admin.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from './testimonial.repository';
import { AdminTestimonialService } from './admin.service';

@Module({
  controllers: [TestimonialController, AdminTestimonialController],
  providers: [
    TestimonialService,
    TestimonialRepository,
    AdminTestimonialService,
  ],
  exports: [TestimonialService, TestimonialRepository],
})
export class TestimonialModule {}
