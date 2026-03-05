import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { usersService } from 'src/service/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class usersController {
  constructor(private readonly testService: usersService) {}

  // ── USERS ─────────────────────────────────────────────────

  // GET /api/users
  @Get()
  async getAll() {
    try {
      return await this.testService.getAll();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching users', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /api/users/branches
  @Get('branches')
  async getBranches() {
    try {
      return await this.testService.getBranches();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching branches', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /api/users/branches/:branchId/counters
  @Get('branches/:branchId/counters')
  async getCountersByBranch(@Param('branchId') branchId: number) {
    try {
      return await this.testService.getCountersByBranch(branchId);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching counters', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/users
  @Post()
  async create(@Body() body: any) {
    try {
      return await this.testService.create(body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating user', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/users/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.testService.update(id, body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating user', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/users/:id
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.testService.remove(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting user', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/users/:id/unlock
  @Put(':id/unlock')
  async unlock(@Param('id') id: number) {
    try {
      return await this.testService.unlock(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error unlocking user', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ── ROLES ─────────────────────────────────────────────────

  // GET /api/users/roles
  @Get('roles')
  async getRoles() {
    try {
      return await this.testService.getRoles();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching roles', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/users/roles
  @Post('roles')
  async createRole(@Body() body: any) {
    try {
      return await this.testService.createRole(body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating role', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/users/roles/:id
  @Put('roles/:id')
  async updateRole(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.testService.updateRole(id, body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating role', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/users/roles/:id
  @Delete('roles/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return await this.testService.deleteRole(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting role', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // ── Add these routes to users.controller.ts ───────────────────

  // ── MENUS ─────────────────────────────────────────────────

  // GET /api/users/menus
  @Get('menus')
  async getMenus() {
    try {
      return await this.testService.getMenus();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching menus', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/users/menus
  @Post('menus')
  async createMenu(@Body() body: any) {
    try {
      return await this.testService.createMenu(body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating menu', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/users/menus/:id
  @Put('menus/:id')
  async updateMenu(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.testService.updateMenu(id, body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating menu', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/users/menus/:id
  @Delete('menus/:id')
  async deleteMenu(@Param('id') id: number) {
    try {
      return await this.testService.deleteMenu(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting menu', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ── ROLE MAP ──────────────────────────────────────────────

  // GET /api/users/role-map
  @Get('role-map')
  async getRoleMap() {
    try {
      return await this.testService.getRoleMap();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching role map', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/users/role-map
  @Put('role-map')
  async updateRoleMap(@Body() body: any) {
    try {
      return await this.testService.updateRoleMap(body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating role map', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}