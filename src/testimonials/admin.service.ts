import { Injectable } from '@nestjs/common';
import { Testimonial } from '@prisma/client';
import { TestimonialRepository } from './testimonial.repository';

@Injectable()
export class AdminTestimonialService {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async approveTestimonial(testimonialId: bigint): Promise<Testimonial> {
    await this.testimonialRepository.findOneOrThrow({ id: testimonialId });

    return this.testimonialRepository.update({
      where: { id: testimonialId },
      data: { isApproved: true },
    });
  }
}
