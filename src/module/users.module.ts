import { Module } from '@nestjs/common';
import { usersController } from 'src/controller/users.controller';
import { usersService } from 'src/service/users.service';
import { RolesController } from 'src/controller/roles.controller';
import { RolesService } from 'src/service/roles.service';
import { SmsService } from 'src/service/sms.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],  // 👈 add this
  controllers: [usersController, RolesController],
  providers: [usersService, RolesService, SmsService],
  exports: [usersService],  // <-- add this
})
export class UsersModule { }