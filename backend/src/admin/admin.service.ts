import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalTutors, totalStudents, totalBookings, pendingTutors, pendingClasses] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'tutor', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'student', deletedAt: null } }),
      this.prisma.booking.count(),
      this.prisma.tutorProfile.count({ where: { status: 'pending' } }),
      this.prisma.groupClass.count({ where: { status: 'pending_approval' } }),
    ]);

    return {
      totalUsers,
      totalTutors,
      totalStudents,
      totalBookings,
      pendingTutors,
      pendingClasses,
    };
  }

  async getPendingTutors() {
    return this.prisma.tutorProfile.findMany({
      where: { status: 'pending' },
      include: {
        user: true,
        licenses: true,
        specialties: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveTutor(tutorId: string, adminId: string) {
    return this.prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        status: 'approved',
        approvalDate: new Date(),
      },
    });
  }

  async rejectTutor(tutorId: string, reason: string) {
    return this.prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    });
  }

  async getPendingClasses() {
    return this.prisma.groupClass.findMany({
      where: { status: 'pending_approval' },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveClass(classId: string, adminId: string) {
    return this.prisma.groupClass.update({
      where: { id: classId },
      data: {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });
  }

  async rejectClass(classId: string) {
    return this.prisma.groupClass.update({
      where: { id: classId },
      data: {
        status: 'rejected',
      },
    });
  }

  async getAllBookings() {
    return this.prisma.booking.findMany({
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayoutRequests() {
    return this.prisma.payoutRequest.findMany({
      where: { status: 'pending' },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processPayout(payoutId: string, adminId: string) {
    return this.prisma.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: 'processing',
        processedBy: adminId,
        processedAt: new Date(),
      },
    });
  }
}
