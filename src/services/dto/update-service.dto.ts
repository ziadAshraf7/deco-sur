import {
  IsBoolean,
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
import {
  PartialServiceDescriptionLocaleDto,
  PartialServiceTitleLocaleDto,
  ServiceExcerptLocaleDto,
} from './service-locale.dto';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialServiceTitleLocaleDto)
  title?: PartialServiceTitleLocaleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceExcerptLocaleDto)
  excerpt?: ServiceExcerptLocaleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialServiceDescriptionLocaleDto)
  description?: PartialServiceDescriptionLocaleDto;

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
