import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, type: string, title: string, message: string, linkUrl?: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: type as any,
        title,
        message,
        linkUrl,
      },
    });
  }
}

