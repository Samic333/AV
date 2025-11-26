import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchTutorsDto, UpdateTutorProfileDto, AddSpecialtyDto, AddAircraftTypeDto, AddLanguageDto, SetAvailabilityDto } from './dto';

@Injectable()
export class TutorsService {
  constructor(private prisma: PrismaService) {}

  async search(dto: SearchTutorsDto) {
    const { page = 1, limit = 20, specialty, aircraftType, language, minPrice, maxPrice, minRating, search } = dto;
    const skip = (page - 1) * limit;

    const where: any = {
      tutorProfile: {
        status: 'approved',
      },
    };

    if (specialty) {
      where.tutorProfile = {
        ...where.tutorProfile,
        specialties: {
          some: {
            specialty,
          },
        },
      };
    }

    if (aircraftType) {
      where.tutorProfile = {
        ...where.tutorProfile,
        aircraftTypes: {
          some: {
            aircraftType,
          },
        },
      };
    }

    if (language) {
      where.tutorProfile = {
        ...where.tutorProfile,
        languages: {
          some: {
            languageCode: language,
          },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.tutorProfile = {
        ...where.tutorProfile,
        hourlyRate: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      };
    }

    if (minRating) {
      where.tutorProfile = {
        ...where.tutorProfile,
        averageRating: {
          gte: minRating,
        },
      };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { tutorProfile: { bio: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [tutors, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          tutorProfile: {
            include: {
              specialties: true,
              aircraftTypes: true,
              languages: true,
              reviews: {
                take: 5,
                orderBy: { createdAt: 'desc' },
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
        orderBy: {
          tutorProfile: {
            averageRating: 'desc',
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      tutors: tutors.filter((t) => t.tutorProfile),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            timezone: true,
          },
        },
        licenses: true,
        specialties: true,
        aircraftTypes: true,
        languages: true,
        availability: {
          where: { isActive: true },
        },
        reviews: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tutor || tutor.status !== 'approved') {
      throw new NotFoundException('Tutor not found');
    }

    return tutor;
  }

  async getTutorProfile(userId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        licenses: true,
        specialties: true,
        aircraftTypes: true,
        languages: true,
        availability: true,
        reviews: {
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
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    return tutor;
  }

  async updateProfile(userId: string, dto: UpdateTutorProfileDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    return this.prisma.tutorProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async addSpecialty(userId: string, dto: AddSpecialtyDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    return this.prisma.tutorSpecialty.create({
      data: {
        tutorId: tutor.id,
        specialty: dto.specialty,
        experienceYears: dto.experienceYears,
      },
    });
  }

  async addAircraftType(userId: string, dto: AddAircraftTypeDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    return this.prisma.tutorAircraftType.create({
      data: {
        tutorId: tutor.id,
        aircraftType: dto.aircraftType,
        hoursLogged: dto.hoursLogged,
      },
    });
  }

  async addLanguage(userId: string, dto: AddLanguageDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    return this.prisma.tutorLanguage.create({
      data: {
        tutorId: tutor.id,
        languageCode: dto.languageCode,
        proficiencyLevel: dto.proficiencyLevel,
      },
    });
  }

  async setAvailability(userId: string, dto: SetAvailabilityDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Delete existing availability
    await this.prisma.tutorAvailability.deleteMany({
      where: { tutorId: tutor.id },
    });

    // Create new availability
    const availability = await Promise.all(
      dto.availability.map((avail) =>
        this.prisma.tutorAvailability.create({
          data: {
            tutorId: tutor.id,
            dayOfWeek: avail.dayOfWeek,
            startTime: avail.startTime,
            endTime: avail.endTime,
            timezone: avail.timezone,
            isActive: avail.isActive,
          },
        })
      )
    );

    return availability;
  }

  async getAvailability(tutorId: string) {
    return this.prisma.tutorAvailability.findMany({
      where: {
        tutorId,
        isActive: true,
      },
    });
  }

  async getReviews(tutorId: string) {
    return this.prisma.tutorReview.findMany({
      where: { tutorId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
