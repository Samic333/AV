import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TutorClassesController } from './tutor-classes.controller';

@Module({
  controllers: [ClassesController, TutorClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}

