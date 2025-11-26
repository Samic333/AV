import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { TutorController } from './tutor.controller';

@Module({
  controllers: [TutorsController, TutorController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}

