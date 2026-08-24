import { Exclude, Expose, Transform } from 'class-transformer';
import { Testimonial } from '@prisma/client';

// BigInt doesn't serialize to JSON natively — expose ids as strings.
@Exclude()
export class TestimonialResponseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: bigint;

  @Expose()
  @Transform(({ value }) => value?.toString())
  userId: bigint;

  @Expose()
  content: string;

  @Expose()
  rating: number | null;

  @Expose()
  isFeatured: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<Testimonial>) {
    Object.assign(this, partial);
  }
}
