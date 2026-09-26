import { IsOptional, IsEnum, IsBoolean, IsInt, Min, IsString, IsNumberString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectCategory, ServiceType } from '@prisma/client';

export class ProjectFilterDto {
  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}



export class BeforeAfterFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 12;
 
  // Scope to one project's before/after entries.
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value !== undefined && value !== '' ? BigInt(value) : undefined))
  projectId?: bigint;
 

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  standalone?: boolean;
}
 