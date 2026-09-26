import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ServiceTitleLocaleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  en!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  fr!: string;
}

export class ServiceExcerptLocaleDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fr?: string;
}

export class ServiceDescriptionLocaleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  en!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  fr!: string;
}

export class PartialServiceTitleLocaleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  en?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fr?: string;
}

export class PartialServiceDescriptionLocaleDto {
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  fr?: string;
}
