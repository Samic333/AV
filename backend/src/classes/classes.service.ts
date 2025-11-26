import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.groupClass.findMany({
      where: { status: 'approved' },
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
        maxStudents: data.maxStudents,
        pricePerStudent: data.pricePerStudent,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
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
}
