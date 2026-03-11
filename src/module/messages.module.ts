import { Module } from '@nestjs/common';
import { MessagesController } from 'src/controller/messages.controller';
import { MessagesService } from 'src/service/messages.service';


@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],  // <-- add this
})
export class messagesModule {}