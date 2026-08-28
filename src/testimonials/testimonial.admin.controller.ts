import { Controller, Param, Patch } from '@nestjs/common';
import { Auth } from '../shared/guards/auth.decerator';
import { AdminTestimonialService } from './admin.service';

@Controller('admin/testimonials')
@Auth('ADMIN')
export class AdminTestimonialController {
  constructor(
    private readonly adminTestimonialService: AdminTestimonialService,
  ) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.adminTestimonialService.approveTestimonial(BigInt(id));
  }
}
