import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ServiceType } from '@prisma/client';
import {
  ServiceDescriptionLocaleDto,
  ServiceExcerptLocaleDto,
  ServiceTitleLocaleDto,
} from './service-locale.dto';

export class CreateServiceDto {
  @IsEnum(ServiceType)
  type!: ServiceType;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug?: string;

  @ValidateNested()
  @Type(() => ServiceTitleLocaleDto)
  title!: ServiceTitleLocaleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceExcerptLocaleDto)
  excerpt?: ServiceExcerptLocaleDto;

  @ValidateNested()
  @Type(() => ServiceDescriptionLocaleDto)
  description!: ServiceDescriptionLocaleDto;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
