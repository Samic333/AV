import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, RescheduleBookingDto, CancelBookingDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { format, parseISO, addMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: dto.tutorId },
      include: { user: true },
    });

    if (!tutor || tutor.status !== 'approved') {
      throw new NotFoundException('Tutor not found');
    }

    const student = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Convert scheduled time to UTC
    const scheduledAt = zonedTimeToUtc(dto.scheduledAt, student.timezone);

    // Check for conflicts
    const conflicts = await this.prisma.booking.findMany({
      where: {
        tutorId: dto.tutorId,
        status: { in: ['pending', 'confirmed'] },
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - dto.durationMinutes * 60000),
          lte: addMinutes(scheduledAt, dto.durationMinutes),
        },
      },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Calculate pricing
    const platformFeePercent = parseFloat(this.configService.get('PLATFORM_FEE_PERCENTAGE') || '15');
    const totalPrice = (Number(tutor.hourlyRate) * dto.durationMinutes) / 60;
    const platformFee = (totalPrice * platformFeePercent) / 100;
    const tutorPayout = totalPrice - platformFee;

    const booking = await this.prisma.booking.create({
      data: {
        studentId: userId,
        tutorId: dto.tutorId,
        bookingType: 'one_on_one',
        status: 'pending',
        lessonType: dto.lessonType,
        scheduledAt,
        durationMinutes: dto.durationMinutes,
        pricePerHour: tutor.hourlyRate,
        totalPrice,
        platformFee,
        tutorPayout,
        timezone: student.timezone,
        bookingRequest: dto.message
          ? {
              create: {
                requestedBy: userId,
                message: dto.message,
                status: 'pending',
              },
            }
          : undefined,
      },
      include: {
        student: true,
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    return booking;
  }

  async findAll(userId: string, role: string) {
    const where: any = {};

    if (role === 'student') {
      where.studentId = userId;
    } else if (role === 'tutor') {
      where.tutorId = userId;
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: {
          include: {
            user: true,
          },
        },
        bookingRequest: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (role !== 'admin' && booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async accept(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tutor: true,
        bookingRequest: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.tutor.userId !== userId) {
      throw new ForbiddenException('Only the tutor can accept this booking');
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not pending');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'confirmed',
        bookingRequest: {
          update: {
            status: 'accepted',
            respondedAt: new Date(),
          },
        },
      },
    });
  }

  async decline(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.tutor.userId !== userId) {
      throw new ForbiddenException('Only the tutor can decline this booking');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellationReason: 'Declined by tutor',
        cancelledBy: userId,
        cancelledAt: new Date(),
        bookingRequest: {
          update: {
            status: 'declined',
            respondedAt: new Date(),
          },
        },
      },
    });
  }

  async reschedule(id: string, userId: string, dto: RescheduleBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const scheduledAt = zonedTimeToUtc(dto.scheduledAt, booking.timezone);

    return this.prisma.booking.update({
      where: { id },
      data: {
        scheduledAt,
      },
    });
  }

  async cancel(id: string, userId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tutor: {
          select: { userId: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellationReason: dto.reason,
        cancelledBy: userId,
        cancelledAt: new Date(),
      },
    });
  }

  async complete(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.tutor.userId !== userId) {
      throw new ForbiddenException('Only the tutor can mark this as complete');
    }

    // Update tutor wallet
    const wallet = await this.prisma.tutorWallet.findUnique({
      where: { tutorId: booking.tutorId },
    });

    if (wallet) {
      await this.prisma.tutorWallet.update({
        where: { tutorId: booking.tutorId },
        data: {
          pendingBalance: {
            increment: booking.tutorPayout,
          },
          totalEarned: {
            increment: booking.tutorPayout,
          },
        },
      });
    } else {
      await this.prisma.tutorWallet.create({
        data: {
          tutorId: booking.tutorId,
          pendingBalance: booking.tutorPayout,
          totalEarned: booking.tutorPayout,
        },
      });
    }

    // Update tutor stats
    await this.prisma.tutorProfile.update({
      where: { id: booking.tutorId },
      data: {
        totalLessonsTaught: { increment: 1 },
      },
    });

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }
}
