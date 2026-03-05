import { Module } from '@nestjs/common';
import { ListingsService } from 'src/service/listings.service';
import { ListingsController } from 'src/controller/listings.controller';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}