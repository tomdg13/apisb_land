import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from '../service/notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  // GET /notifications
  @Get()
  getAll(@Request() req) {
    return this.svc.getNotifications(req.user.userId);
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  unreadCount(@Request() req) {
    return this.svc.getUnreadCount(req.user.userId);
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.svc.markRead(Number(id), req.user.userId);
  }

  // PATCH /notifications/read-all
  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.svc.markAllRead(req.user.userId);
  }
}