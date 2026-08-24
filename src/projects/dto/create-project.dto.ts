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
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectCategory, ServiceType } from '@prisma/client';


export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProjectCategory)
  category!: ProjectCategory;

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
  @MaxLength(100)
  duration?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsString()
  @IsNotEmpty()
  heroImageUrl!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryItemDto)
  gallery?: CreateGalleryItemDto[];

  @IsOptional()
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