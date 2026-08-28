import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
  ArrayUnique,
  MinLength,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectCategory, ServiceType } from '@prisma/client';

function parseIfString(value: unknown) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProjectCategory)
  category!: ProjectCategory;

  @Transform(({ value }) => parseIfString(value))
  @IsArray()
  @ArrayUnique()
  @IsEnum(ServiceType, { each: true })
  serviceTypes!: ServiceType[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => parseIfString(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryItemDto)
  gallery?: CreateGalleryItemDto[];

  @IsOptional()
  @Transform(({ value }) => parseIfString(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBeforeAfterDto)
  beforeAftersImages?: CreateBeforeAfterDto[];
}

export class CreateGalleryItemDto {

  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

export class CreateBeforeAfterDto {

  @IsString()
  @IsNotEmpty()
  beforeImageUrl!: string;

  @IsString()
  @IsNotEmpty()
  afterImageUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}