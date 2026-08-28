import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBeforeAfterDto, CreateGalleryItemDto, CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, [
    'heroImageUrl',
    'gallery',
    'beforeAftersImages',
  ] as const),
) {}

export class UpdateBeforeAfterDto extends PartialType(CreateBeforeAfterDto) {}

export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {}