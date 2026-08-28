import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';
import { Auth } from '../shared/guards/auth.decerator';
import { CurrentUser } from '../shared/decerators/current_user.decerator';
import { AuthenticatedUserPayload } from '../auth/dto/auth.dto';

@Controller('testimonials')
@Auth('CLIENT')
export class TestimonialController {
  constructor(
    private readonly testimonialService: TestimonialService,
  ) {}


  @Post()
  create(@Body() dto: CreateTestimonialDto , @CurrentUser() user : AuthenticatedUserPayload) {
    return this.testimonialService.create(dto,user);
  }


  @Get()
  findAll(@Query() query: QueryTestimonialDto , @CurrentUser() user : AuthenticatedUserPayload) {
    return this.testimonialService.findAll(query , user);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(
      BigInt(id),
    );
  }
}