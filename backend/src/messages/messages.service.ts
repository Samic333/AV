import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.getConversation(conversationId, userId);

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  private detectContactInfo(content: string): { hasContactInfo: boolean; reason?: string } {
    // Email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    // Phone pattern (various formats)
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,}/;
    // Telegram/WhatsApp mentions
    const telegramPattern = /(telegram|t\.me|@\w+)/i;
    const whatsappPattern = /(whatsapp|wa\.me|\+?\d{10,})/i;
    
    if (emailPattern.test(content)) {
      return { hasContactInfo: true, reason: 'Email address detected' };
    }
    if (phonePattern.test(content)) {
      return { hasContactInfo: true, reason: 'Phone number detected' };
    }
    if (telegramPattern.test(content)) {
      return { hasContactInfo: true, reason: 'Telegram handle detected' };
    }
    if (whatsappPattern.test(content)) {
      return { hasContactInfo: true, reason: 'WhatsApp number detected' };
    }
    
    return { hasContactInfo: false };
  }

  async sendMessage(userId: string, recipientId: string, content: string, attachmentUrl?: string, attachmentType?: string) {
    // Check for contact info
    const contactCheck = this.detectContactInfo(content);
    if (contactCheck.hasContactInfo) {
      // Still create the message but flag it
      const conversation = await this.findOrCreateConversation(userId, recipientId);
      
      const message = await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          content,
          attachmentUrl,
          attachmentType,
          isFlagged: true,
          flaggedReason: contactCheck.reason || 'Contact information detected',
        } as any,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });

      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      // Return error to user
      throw new ForbiddenException(
        'Sharing direct contact details is against the website usage rules. Please use the platform messaging system.'
      );
    }

    // Find or create conversation
    const conversation = await this.findOrCreateConversation(userId, recipientId);

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content,
        attachmentUrl,
        attachmentType,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation last message time
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  private async findOrCreateConversation(userId: string, recipientId: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: recipientId },
          { participant1Id: recipientId, participant2Id: userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: recipientId,
        },
      });
    }

    return conversation;
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

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
