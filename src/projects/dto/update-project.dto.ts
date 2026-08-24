import { PartialType } from '@nestjs/mapped-types';
import { CreateBeforeAfterDto, CreateGalleryItemDto, CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}


export class UpdateBeforeAfterDto extends PartialType(CreateBeforeAfterDto) {}

export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {}