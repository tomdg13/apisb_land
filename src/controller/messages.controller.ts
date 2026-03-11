import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessagesService } from 'src/service/messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // POST /api/messages/start
  // { listing_id, message }  — start or get conversation + optional first message
  @Post('start')
  async start(@Body() body: { listing_id: number; message?: string }, @Request() req: any) {
    return this.messagesService.startOrGetConversation(
      body.listing_id, req.user.userId, body.message,
    );
  }

  // POST /api/messages/:conversationId/send
  // { message }
  @Post(':conversationId/send')
  async send(
    @Param('conversationId') conversationId: number,
    @Body() body: { message: string },
    @Request() req: any,
  ) {
    return this.messagesService.sendMessage(conversationId, req.user.userId, body.message);
  }

  // GET /api/messages/:conversationId
  @Get(':conversationId')
  async getMessages(@Param('conversationId') id: number, @Request() req: any) {
    return this.messagesService.getMessages(id, req.user.userId);
  }

  // GET /api/messages  — my inbox
  @Get()
  async getConversations(@Request() req: any) {
    return this.messagesService.getMyConversations(req.user.userId);
  }

  // GET /api/messages/unread/count
  @Get('unread/count')
  async unreadCount(@Request() req: any) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }
}