import { Exclude, Expose, Transform } from 'class-transformer';
import { Faq } from '@prisma/client';

@Exclude()
export class FaqResponseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id!: bigint;

  @Expose()
  question!: string;

  @Expose()
  answer!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<Faq>) {
    Object.assign(this, partial);
  }
}
