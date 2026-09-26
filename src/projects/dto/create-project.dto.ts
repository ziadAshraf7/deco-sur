import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  ValidateNested,
  ArrayUnique,
  MinLength,
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

function toBigIntOrUndefined(value: unknown) {
  if (value === undefined || value === null || value === '') return undefined;
  return BigInt(value as string);
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string; 

  @IsOptional()
  @IsString()
  caption?: string;
}

export class AddGalleryItemDto {
  @IsString()
  @IsNotEmpty()
  imageUrl!: string; 

  @IsOptional()
  @IsString()
  caption?: string;
}

export class CreateBeforeAfterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  beforeImageUrl?: string; 

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  afterImageUrl?: string; 

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Optional: omit entirely to create a standalone before/after
  // with no project attached. Provide a project id to attach it.
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => toBigIntOrUndefined(value))
  projectId?: bigint;
}

export class AddBeforeAfterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  beforeImageUrl!: string; 

  @IsOptional()
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

  // Optional: omit entirely to create a standalone before/after
  // with no project attached. Provide a project id to attach it.
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => toBigIntOrUndefined(value))
  projectId?: bigint;
}