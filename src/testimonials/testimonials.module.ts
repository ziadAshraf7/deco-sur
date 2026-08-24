import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from './testimonial.repository';

@Module({
  controllers: [TestimonialController],
  providers: [TestimonialService, TestimonialRepository],
  exports: [TestimonialService, TestimonialRepository],
})
export class TestimonialModule {}
