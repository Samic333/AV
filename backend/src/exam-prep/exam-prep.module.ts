import { Module } from '@nestjs/common';
import { ExamPrepController } from './exam-prep.controller';
import { ExamPrepService } from './exam-prep.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExamPrepController],
  providers: [ExamPrepService],
  exports: [ExamPrepService],
})
export class ExamPrepModule {}

