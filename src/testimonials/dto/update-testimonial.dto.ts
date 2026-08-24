import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonial.dto';

// userId is intentionally excluded — ownership shouldn't change via update.
export class UpdateTestimonialDto extends PartialType(
  OmitType(CreateTestimonialDto, ['userId'] as const),
) {}
