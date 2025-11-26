import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tutor/bookings')
@UseGuards(JwtAuthGuard)
@Roles('tutor')
export class TutorBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAll(user.id, 'tutor');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id, 'tutor');
  }

  @Put(':id/accept')
  async accept(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.accept(id, user.id);
  }

  @Put(':id/decline')
  async decline(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.decline(id, user.id);
  }
}

