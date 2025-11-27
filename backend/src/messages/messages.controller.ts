import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  async getConversations(@CurrentUser() user: any) {
    return this.messagesService.getConversations(user.id);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.getConversation(id, user.id);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.getMessages(id, user.id);
  }

  @Post('send')
  async sendMessageToUser(
    @CurrentUser() user: any,
    @Body() body: { recipientId: string; content: string; attachmentUrl?: string; attachmentType?: string },
  ) {
    return this.messagesService.sendMessage(user.id, body.recipientId, body.content, body.attachmentUrl, body.attachmentType);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @CurrentUser() user: any,
    @Body() body: { content: string; attachmentUrl?: string; attachmentType?: string },
  ) {
    const conversation = await this.messagesService.getConversation(conversationId, user.id);
    const recipientId = conversation.participant1Id === user.id ? conversation.participant2Id : conversation.participant1Id;
    
    return this.messagesService.sendMessage(user.id, recipientId, body.content, body.attachmentUrl, body.attachmentType);
  }

  @Post('conversations/:id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    await this.messagesService.markAsRead(id, user.id);
    return { success: true };
  }
}
