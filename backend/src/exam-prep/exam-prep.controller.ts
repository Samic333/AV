import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExamPrepService } from './exam-prep.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('exam-prep')
export class ExamPrepController {
  constructor(private readonly examPrepService: ExamPrepService) {}

  @Public()
  @Get('requests')
  async getRequests() {
    return this.examPrepService.getRequests();
  }

  @UseGuards(JwtAuthGuard)
  @Post('requests')
  async createRequest(
    @CurrentUser() user: any,
    @Body() body: {
      examType: string;
      description: string;
      budget?: number;
      preferredSchedule?: string;
    },
  ) {
    const payload = {
      subject: body.examType,
      description: body.description,
    };
    return this.examPrepService.createRequest(user.id, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('requests/:id/bids')
  async createBid(
    @Param('id') requestId: string,
    @CurrentUser() user: any,
    @Body() body: {
      price: number;
      message?: string;
      proposedSchedule?: string;
    },
  ) {
    const payload = {
      amount: body.price,
      message: body.message,
    };
    return this.examPrepService.createBid(user.id, requestId, payload);
  }
}

