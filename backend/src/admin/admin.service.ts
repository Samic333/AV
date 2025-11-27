import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalTutors, totalStudents, totalBookings, pendingTutors, pendingClasses, transactions, expenses] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'tutor', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'student', deletedAt: null } }),
      this.prisma.booking.count(),
      this.prisma.tutorProfile.count({ where: { status: 'pending' } }),
      this.prisma.groupClass.count({ where: { status: 'pending_approval' } }),
      this.prisma.transaction.findMany({ where: { type: 'payment', status: 'completed' } }),
      (this.prisma as any).expense.findMany(),
    ]);

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.platformFee || 0), 0);
    const totalTransactionVolume = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const profit = totalRevenue - totalExpenses;

    // Get user distribution by country
    const usersByCountry = await (this.prisma.user.groupBy as any)({
      by: ['country'],
      where: { 
        deletedAt: null,
        country: { not: null },
      },
      _count: { country: true },
    });

    return {
      totalUsers,
      totalTutors,
      totalStudents,
      totalBookings,
      pendingTutors,
      pendingClasses,
      totalRevenue,
      totalTransactionVolume,
      totalExpenses,
      profit,
      usersByCountry: usersByCountry.map((u) => ({ country: u.country, count: u._count.country })),
    };
  }

  async getAllUsers(filters: any) {
    const where: any = { deletedAt: null };
    
    if (filters.role && filters.role !== 'all') {
      where.role = filters.role;
    }
    
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'suspended') {
        where.deletedAt = { not: null };
      } else {
        where.deletedAt = null;
      }
    }
    
    if (filters.country) {
      where.country = { contains: filters.country, mode: 'insensitive' };
    }
    
    return this.prisma.user.findMany({
      where,
      include: {
        tutorProfile: true,
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        deletedAt: null,
      },
      include: {
        tutorProfile: true,
        studentProfile: true,
      },
      take: 50,
    });
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tutorProfile: {
          include: {
            classes: true,
            bookings: { take: 10 },
            reviews: { take: 5 },
          },
        },
        studentProfile: true,
        bookingsAsStudent: { take: 10 },
        transactions: { take: 10 },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async bulkAction(userIds: string[], action: string) {
    if (action === 'suspend') {
      await this.prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { deletedAt: new Date() },
      });
    } else if (action === 'activate') {
      await this.prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { deletedAt: null },
      });
    }
    return { message: `Bulk ${action} completed` };
  }

  async suspendUser(userId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'tutor') {
      await this.prisma.tutorProfile.updateMany({
        where: { userId },
        data: { status: 'suspended' },
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }

  async sendAnnouncement(target: 'all' | 'students' | 'instructors' | string, title: string, message: string) {
    let userIds: string[] = [];

    if (target === 'all') {
      const users = await this.prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else if (target === 'students') {
      const users = await this.prisma.user.findMany({
        where: { role: 'student', deletedAt: null },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else if (target === 'instructors') {
      const users = await this.prisma.user.findMany({
        where: { role: 'tutor', deletedAt: null },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else {
      userIds = [target];
    }

    const notifications = await Promise.all(
      userIds.map((userId) =>
        this.prisma.notification.create({
          data: {
            userId,
            type: 'message',
            title,
            message,
          },
        })
      )
    );

    return { sent: notifications.length };
  }

  async getExpenses(view: string = 'monthly', period?: string, year?: string) {
    const startDate = new Date();
    const endDate = new Date();
    
    if (view === 'yearly' && year) {
      startDate.setFullYear(parseInt(year), 0, 1);
      endDate.setFullYear(parseInt(year), 11, 31);
    } else if (view === 'monthly' && period) {
      const [y, m] = period.split('-').map(Number);
      startDate.setFullYear(y, m - 1, 1);
      endDate.setFullYear(y, m - 1, new Date(y, m, 0).getDate());
    } else {
      startDate.setDate(1);
    }

    return (this.prisma as any).expense.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getExpensesOld() {
    return (this.prisma as any).expense.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async getFinancialSummary(view: string = 'monthly', period?: string, year?: string) {
    const startDate = new Date();
    const endDate = new Date();
    
    if (view === 'yearly' && year) {
      startDate.setFullYear(parseInt(year), 0, 1);
      endDate.setFullYear(parseInt(year), 11, 31);
    } else if (view === 'monthly' && period) {
      const [y, m] = period.split('-').map(Number);
      startDate.setFullYear(y, m - 1, 1);
      endDate.setFullYear(y, m - 1, new Date(y, m, 0).getDate());
    } else {
      startDate.setDate(1);
    }

    const [transactions, expenses] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          type: 'payment',
          status: 'completed',
        },
      }),
      (this.prisma as any).expense.findMany({
        where: {
          date: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.platformFee || 0), 0);
    const totalTransactionVolume = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const profit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalTransactionVolume,
      totalExpenses,
      profit,
    };
  }

  async createExpense(data: { description: string; amount: number; category?: string; date: Date; createdBy?: string }) {
    return (this.prisma as any).expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category ?? undefined,
        date: data.date,
        createdById: data.createdBy ?? null,
      },
    });
  }

  async getFlaggedMessages() {
    return this.prisma.message.findMany({
      where: { isFlagged: true } as any,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        conversation: {
          include: {
            participant1: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            participant2: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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

  async getAllTransactions(view: string = 'monthly', period?: string, year?: string) {
    const startDate = new Date();
    const endDate = new Date();
    
    if (view === 'yearly' && year) {
      startDate.setFullYear(parseInt(year), 0, 1);
      endDate.setFullYear(parseInt(year), 11, 31);
    } else if (view === 'monthly' && period) {
      const [y, m] = period.split('-').map(Number);
      startDate.setFullYear(y, m - 1, 1);
      endDate.setFullYear(y, m - 1, new Date(y, m, 0).getDate());
    } else {
      startDate.setDate(1);
    }

    return this.prisma.transaction.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
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
      take: 100,
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
