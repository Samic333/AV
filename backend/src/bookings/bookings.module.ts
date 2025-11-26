import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TutorBookingsController } from './tutor-bookings.controller';

@Module({
  controllers: [BookingsController, TutorBookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}

