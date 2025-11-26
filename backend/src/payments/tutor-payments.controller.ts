import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tutor/earnings')
@UseGuards(JwtAuthGuard)
@Roles('tutor')
export class TutorPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('wallet')
  async getWallet(@CurrentUser() user: any) {
    const tutor = await this.paymentsService['prisma'].tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutor) {
      throw new Error('Tutor profile not found');
    }

    return this.paymentsService.getWallet(tutor.id);
  }

  @Post('request-payout')
  async requestPayout(
    @CurrentUser() user: any,
    @Body() body: { amount: number; paymentMethod: string; accountDetails: any },
  ) {
    const tutor = await this.paymentsService['prisma'].tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutor) {
      throw new Error('Tutor profile not found');
    }

    return this.paymentsService.requestPayout(tutor.id, body.amount, body.paymentMethod, body.accountDetails);
  }
}

