import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, RescheduleBookingDto, CancelBookingDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAll(user.id, user.role);
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    if (user.role !== 'student') {
      throw new Error('Only students can create bookings');
    }
    return this.bookingsService.create(user.id, dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.id, user.role);
  }

  @Put(':id/reschedule')
  async reschedule(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: RescheduleBookingDto) {
    return this.bookingsService.reschedule(id, user.id, dto);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: CancelBookingDto) {
    return this.bookingsService.cancel(id, user.id, dto);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.complete(id, user.id);
  }
}
