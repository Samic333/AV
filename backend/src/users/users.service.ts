import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tutorProfile: {
          include: {
            licenses: true,
            specialties: true,
            aircraftTypes: true,
            languages: true,
          },
        },
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        tutorProfile: true,
        studentProfile: true,
      },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        timezone: data.timezone,
        avatarUrl: data.avatarUrl,
        country: data.country,
        address: data.address,
        secondaryEmail: data.secondaryEmail,
      },
    });
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await this.prisma.userSettings.create({
        data: {
          userId,
          theme: 'light',
          textSize: 'normal',
          emailNotifications: true,
          inAppNotifications: true,
        },
      });
    }

    return settings;
  }

  async updateSettings(userId: string, data: any) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: {
        theme: data.theme,
        textSize: data.textSize,
        emailNotifications: data.emailNotifications,
        inAppNotifications: data.inAppNotifications,
      },
      create: {
        userId,
        theme: data.theme || 'light',
        textSize: data.textSize || 'normal',
        emailNotifications: data.emailNotifications !== false,
        inAppNotifications: data.inAppNotifications !== false,
      },
    });
  }
}

