import { Module } from '@nestjs/common';
import { NotificationsController } from 'src/controller/notifications.controller';
import { NotificationsService } from 'src/service/notifications.service';



@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],  
})
export class NotificationsModule {}