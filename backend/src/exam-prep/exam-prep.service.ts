import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamPrepService {
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string, data: {
    subject: string;
    description: string;
  }) {
    return this.prisma.examPrepRequest.create({
      data: {
        studentId: userId,
        subject: data.subject,
        description: data.description,
        status: 'open',
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        bids: {
          include: {
            tutor: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getRequests() {
    return this.prisma.examPrepRequest.findMany({
      where: { status: 'open' },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        bids: {
          include: {
            tutor: {
              include: {
                user: {
                  select: {
                    id: true,
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

  async createBid(tutorId: string, requestId: string, data: {
    amount: number;
    message?: string;
  }) {
    const request = await this.prisma.examPrepRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'open') {
      throw new ForbiddenException('Request is no longer open for bids');
    }

    return this.prisma.examPrepBid.create({
      data: {
        requestId,
        tutorId,
        amount: data.amount,
        message: data.message,
        status: 'pending',
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}

