import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryTestimonialDto) {
    return this.testimonialService.findAll(query);
  }

  // Route order matters: static segments before ':id' so they aren't
  // swallowed by the dynamic param route below.
  @Get('featured')
  findFeatured(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.testimonialService.findFeatured(limit);
  }

  @Get('average-rating')
  getAverageRating(@Query('userId') userId?: string) {
    return this.testimonialService.getAverageRating(
      userId ? BigInt(userId) : undefined,
    );
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.testimonialService.findByUser(BigInt(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    // Swap in the authenticated user's id (e.g. req.user.id) as the third
    // arg once auth is wired up, so users can only edit their own record.
    return this.testimonialService.update(BigInt(id), dto);
  }

  @Patch(':id/feature')
  setFeatured(
    @Param('id') id: string,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.testimonialService.setFeatured(BigInt(id), isFeatured);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(BigInt(id));
  }
}
