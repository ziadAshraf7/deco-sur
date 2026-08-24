import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { CreateFaqDto } from './dto/create-faq.dto';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryFaqDto) {
    return this.faqService.findAll(query);
  }

  @Get('all')
  findAllRaw() {
    return this.faqService.findAllRaw();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(BigInt(id));
  }
}
