import { Module } from '@nestjs/common';
import { ProfileController } from 'src/controller/profile.controller';
import { ProfileService } from 'src/service/profile.service';


@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],  
})
export class profileModule {}