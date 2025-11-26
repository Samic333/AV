import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  async initiatePayment(@CurrentUser() user: any, @Body() body: { bookingId: string; paymentMethod: string }) {
    return this.paymentsService.initiatePayment(body.bookingId, body.paymentMethod);
  }

  @Get('history')
  async getPaymentHistory(@CurrentUser() user: any) {
    return this.paymentsService.getPaymentHistory(user.id);
  }

  @Post('webhook/flutterwave')
  async flutterwaveWebhook(@Body() body: any) {
    // TODO: Implement Flutterwave webhook handler
    return { received: true };
  }

  @Post('webhook/paypal')
  async paypalWebhook(@Body() body: any) {
    // TODO: Implement PayPal webhook handler
    return { received: true };
  }

  @Post('webhook/mpesa')
  async mpesaWebhook(@Body() body: any) {
    // TODO: Implement M-Pesa webhook handler
    return { received: true };
  }
}
