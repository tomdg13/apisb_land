import { Module } from '@nestjs/common';
import { CommentsController } from 'src/controller/comments.controller';
import { CommentsService } from 'src/service/comments.service';


@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],  
})
export class commentsModule {}