import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { Auth } from '../shared/guards/auth.decerator';
import { AdminTestimonialService } from './admin.service';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';
import { TestimonialService } from './testimonial.service';

@Controller('admin/testimonials')
@Auth('ADMIN')
export class AdminTestimonialController {
  constructor(
    private readonly adminTestimonialService: AdminTestimonialService,
    private readonly testimonialService: TestimonialService
  ) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.adminTestimonialService.approveTestimonial(BigInt(id));
  }

  @Get('featured')
  findFeatured(
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit?: number,
  ) {
    return this.testimonialService.findFeatured(limit);
  }

  @Get('average-rating')
  getAverageRating() {
    return this.testimonialService.getAverageRating();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.testimonialService.findByUser(
      BigInt(userId),
    );
  }

  @Get()
  findAll(
    @Query() query: QueryTestimonialDto,
  ) {
    return this.testimonialService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.testimonialService.findOne(
      BigInt(id),
    );
  }

  @Patch(':id/feature')
  setFeatured(
    @Param('id') id: string,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.testimonialService.setFeatured(
      BigInt(id),
      isFeatured,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.testimonialService.remove(
      BigInt(id),
    );
  }
}
