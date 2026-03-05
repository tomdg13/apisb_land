import { Module } from '@nestjs/common';
import { usersController } from 'src/controller/users.controller';
import { usersService } from 'src/service/users.service';
import { RolesController } from 'src/controller/roles.controller';
import { RolesService } from 'src/service/roles.service';

@Module({
  controllers: [usersController, RolesController],
  providers: [usersService, RolesService],
  exports: [usersService],  // <-- add this
})
export class UsersModule {}