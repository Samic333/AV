import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { SearchTutorsDto } from './dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Public()
  @Get()
  async search(@Query() dto: SearchTutorsDto) {
    return this.tutorsService.search(dto);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tutorsService.findById(id);
  }

  @Public()
  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    return this.tutorsService.getReviews(id);
  }

  @Public()
  @Get(':id/availability')
  async getAvailability(@Param('id') id: string) {
    return this.tutorsService.getAvailability(id);
  }

  @Public()
  @Get('featured/list')
  async getFeatured() {
    return this.tutorsService.getFeatured();
  }
}
