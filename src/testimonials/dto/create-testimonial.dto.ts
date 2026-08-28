import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTestimonialDto {


  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
