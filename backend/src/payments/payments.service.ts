import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiatePayment(bookingId: string, paymentMethod: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: true,
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        type: 'payment',
        amount: booking.totalPrice,
        currency: 'USD',
        paymentMethod: paymentMethod as any,
        status: 'pending',
      },
    });

    // TODO: Integrate with payment gateways
    // For now, return transaction ID
    return {
      transactionId: transaction.id,
      amount: booking.totalPrice,
      currency: 'USD',
      paymentMethod,
      // In production, this would contain payment gateway URLs/links
      paymentUrl: `https://payment-gateway.com/pay/${transaction.id}`,
    };
  }

  async getPaymentHistory(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'payment',
      },
      include: {
        booking: {
          include: {
            tutor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWallet(tutorId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    const wallet = await this.prisma.tutorWallet.findUnique({
      where: { tutorId },
    });

    if (!wallet) {
      return {
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
      };
    }

    return wallet;
  }

  async requestPayout(tutorId: string, amount: number, paymentMethod: string, accountDetails: any) {
    const wallet = await this.prisma.tutorWallet.findUnique({
      where: { tutorId },
    });

    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    return this.prisma.payoutRequest.create({
      data: {
        tutorId,
        amount,
        paymentMethod,
        accountDetails,
        status: 'pending',
      },
    });
  }
}
