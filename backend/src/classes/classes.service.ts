import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { category?: string; search?: string; featured?: boolean }) {
    const where: any = { status: 'approved' };
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.featured) {
      where.isFeatured = true;
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { topic: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.groupClass.findMany({
      where,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        enrollments: {
          where: { cancelledAt: null },
          select: { id: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getFeatured() {
    return this.prisma.groupClass.findMany({
      where: { 
        status: 'approved',
        isFeatured: true,
      },
      take: 6,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        enrollments: {
          where: { cancelledAt: null },
          select: { id: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findById(id: string) {
    const classItem = await this.prisma.groupClass.findUnique({
      where: { id },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            booking: {
              include: {
                student: {
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
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    return classItem;
  }

  async create(tutorId: string, data: any) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor || tutor.status !== 'approved') {
      throw new NotFoundException('Tutor not found or not approved');
    }

    return this.prisma.groupClass.create({
      data: {
        tutorId,
        title: data.title,
        description: data.description,
        topic: data.topic,
        category: data.category,
        maxStudents: data.maxStudents,
        pricePerStudent: data.pricePerStudent,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        pictureUrl: data.pictureUrl,
        videoUrl: data.videoUrl,
        language: data.language,
        aircraftType: data.aircraftType,
        airlineFocus: data.airlineFocus,
        isFeatured: data.isFeatured || false,
        status: 'pending_approval',
      },
    });
  }

  async enroll(classId: string, studentId: string) {
    const classItem = await this.prisma.groupClass.findUnique({
      where: { id: classId },
    });

    if (!classItem || classItem.status !== 'approved') {
      throw new NotFoundException('Class not found or not approved');
    }

    if (classItem.currentStudents >= classItem.maxStudents) {
      throw new BadRequestException('Class is full');
    }

    // Check if already enrolled
    const existing = await this.prisma.groupClassEnrollment.findFirst({
      where: {
        classId,
        studentId,
        cancelledAt: null,
      },
    });

    if (existing) {
      throw new BadRequestException('Already enrolled');
    }

    // Create enrollment
    const enrollment = await this.prisma.groupClassEnrollment.create({
      data: {
        classId,
        studentId,
        paymentStatus: 'pending',
      },
    });

    // Update class student count
    await this.prisma.groupClass.update({
      where: { id: classId },
      data: {
        currentStudents: { increment: 1 },
      },
    });

    return enrollment;
  }

  async update(classId: string, tutorId: string, data: any) {
    const classItem = await this.prisma.groupClass.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    if (classItem.tutorId !== tutorId) {
      throw new ForbiddenException('Not authorized to update this class');
    }

    if (classItem.status === 'completed' || classItem.status === 'cancelled') {
      throw new BadRequestException('Cannot update completed or cancelled class');
    }

    return this.prisma.groupClass.update({
      where: { id: classId },
      data: {
        title: data.title,
        description: data.description,
        topic: data.topic,
        category: data.category,
        maxStudents: data.maxStudents,
        pricePerStudent: data.pricePerStudent,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        pictureUrl: data.pictureUrl,
        videoUrl: data.videoUrl,
        language: data.language,
        aircraftType: data.aircraftType,
        airlineFocus: data.airlineFocus,
        isFeatured: data.isFeatured || false,
      },
    });
  }

  async cancel(classId: string, tutorId: string) {
    const classItem = await this.prisma.groupClass.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    if (classItem.tutorId !== tutorId) {
      throw new ForbiddenException('Not authorized to cancel this class');
    }

    if (classItem.status === 'completed' || classItem.status === 'cancelled') {
      throw new BadRequestException('Class is already completed or cancelled');
    }

    return this.prisma.groupClass.update({
      where: { id: classId },
      data: {
        status: 'cancelled',
      },
    });
  }
}
