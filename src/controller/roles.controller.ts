import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { RolesService } from 'src/service/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // GET /api/roles - list all roles
  @Get()
  async getAll() {
    try {
      return await this.rolesService.getAll();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/roles - create role
  @Post()
  async create(@Body() body: any) {
    try {
      return await this.rolesService.create(body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/roles/:id - update role
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.rolesService.update(id, body);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/roles/:id - delete role
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.rolesService.remove(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /api/menus - list all menus
  @Get('/menus/all')
  async getAllMenus() {
    try {
      return await this.rolesService.getAllMenus();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /api/roles/:id/menus - get role-menu mapping
  @Get(':id/menus')
  async getMenuMapping(@Param('id') id: number) {
    try {
      return await this.rolesService.getMenuMapping(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/roles/:id/menus - save role-menu mapping
  @Post(':id/menus')
  async saveMenuMapping(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.rolesService.saveMenuMapping(id, body.mappings);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}