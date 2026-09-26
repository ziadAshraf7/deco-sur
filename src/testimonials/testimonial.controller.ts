import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
export class TestimonialController {
  constructor(
    private readonly testimonialService: TestimonialService,
  ) {}


  @Post()
  @Auth('CLIENT')
  create(@Body() dto: CreateTestimonialDto , @CurrentUser() user : AuthenticatedUserPayload) {
    return this.testimonialService.create(dto,user);
  }


  @Get()
  @Auth('CLIENT')
  findAll(@Query() query: QueryTestimonialDto , @CurrentUser() user : AuthenticatedUserPayload) {
    return this.testimonialService.findAll(query , user);
  }


  @Get('featured')
    findFeatured(
      @Query('limit', new ParseIntPipe({ optional: true }))
      limit?: number,
    ) {
      return this.testimonialService.findFeatured(limit);
    }

  @Get(':id')
  @Auth('CLIENT')
  findOne(@Param('id') id: string , @CurrentUser() user : AuthenticatedUserPayload) {
    return this.testimonialService.findOne(
      BigInt(id),
      user
    );
  }
}