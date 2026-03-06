import {
  Controller, Post, Get, Put, Delete,
  Query, Body, Param, Req,
  HttpException, HttpStatus, UseGuards, SetMetadata,
} from '@nestjs/common';
import { usersService } from 'src/service/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const Public = () => SetMetadata('isPublic', true);

@Controller('users')
@UseGuards(JwtAuthGuard)
export class usersController {
  constructor(private readonly testService: usersService) {}

  // ── USERS ─────────────────────────────────────────────────

  @Get()
  async getAll() {
    try { return await this.testService.getAll(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Get('branches')
  async getBranches() {
    try { return await this.testService.getBranches(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Get('branches/:branchId/counters')
  async getCountersByBranch(@Param('branchId') branchId: number) {
    try { return await this.testService.getCountersByBranch(branchId); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post()
  async create(@Body() body: any) {
    try { return await this.testService.create(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.update(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try { return await this.testService.remove(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put(':id/unlock')
  async unlock(@Param('id') id: number) {
    try { return await this.testService.unlock(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── ROLES ─────────────────────────────────────────────────

  @Get('roles')
  async getRoles() {
    try { return await this.testService.getRoles(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post('roles')
  async createRole(@Body() body: any) {
    try { return await this.testService.createRole(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('roles/:id')
  async updateRole(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.updateRole(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: number) {
    try { return await this.testService.deleteRole(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── MENUS ─────────────────────────────────────────────────

  @Get('menus')
  async getMenus() {
    try { return await this.testService.getMenus(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post('menus')
  async createMenu(@Body() body: any) {
    try { return await this.testService.createMenu(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('menus/:id')
  async updateMenu(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.updateMenu(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete('menus/:id')
  async deleteMenu(@Param('id') id: number) {
    try { return await this.testService.deleteMenu(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── ROLE MAP ──────────────────────────────────────────────

  @Get('role-map')
  async getRoleMap() {
    try { return await this.testService.getRoleMap(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('role-map')
  async updateRoleMap(@Body() body: any) {
    try { return await this.testService.updateRoleMap(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── CATEGORIES ────────────────────────────────────────────

  @Get('categories')
  async getCategories() {
    try { return await this.testService.getCategories(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post('categories')
  async createCategory(@Body() body: any) {
    try { return await this.testService.createCategory(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.updateCategory(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: number) {
    try { return await this.testService.deleteCategory(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── PROVINCES ─────────────────────────────────────────────

  @Get('provinces')
  async getProvinces() {
    try { return await this.testService.getProvinces(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post('provinces')
  async createProvince(@Body() body: any) {
    try { return await this.testService.createProvince(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('provinces/:id')
  async updateProvince(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.updateProvince(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete('provinces/:id')
  async deleteProvince(@Param('id') id: number) {
    try { return await this.testService.deleteProvince(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── DISTRICTS ─────────────────────────────────────────────

  @Get('districts')
  async getDistricts(@Query('province_id') provinceId?: number) {
    try { return await this.testService.getDistricts(provinceId); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Post('districts')
  async createDistrict(@Body() body: any) {
    try { return await this.testService.createDistrict(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Put('districts/:id')
  async updateDistrict(@Param('id') id: number, @Body() body: any) {
    try { return await this.testService.updateDistrict(id, body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Delete('districts/:id')
  async deleteDistrict(@Param('id') id: number) {
    try { return await this.testService.deleteDistrict(id); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── DASHBOARD ─────────────────────────────────────────────

  @Get('dashboard')
  async getDashboard() {
    try { return await this.testService.getDashboardStats(); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── OTP — PUBLIC (no JWT needed) ──────────────────────────

  @Public()
  @Post('otp/request')
  async requestOtp(@Body() body: any) {
    try { return await this.testService.requestOtp(
      body.phone_number, body.type || 'register'); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Public()
  @Post('otp/verify')
  async verifyOtp(@Body() body: any) {
    try { return await this.testService.verifyOtp(
      body.phone_number, body.otp_code, body.type || 'register'); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Public()
  @Post('register-otp')
  async registerWithOtp(@Body() body: any) {
    try { return await this.testService.registerWithOtp(body); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Public()
  @Post('self-reset-password')
  async selfResetPassword(@Body() body: any) {
    try { return await this.testService.selfResetPassword(
      body.phone_number, body.new_password); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  // ── RESET PASSWORD — Admin (requires JWT) ─────────────────

  @Put('reset-password/:id')
  async adminResetPassword(
    @Param('id') id: number,
    @Body() body: any,
    @Req() req: any,
  ) {
    try { return await this.testService.adminResetPassword(
      id, body.new_password, req.user?.userId); }
    catch (e) { throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR); }
  }
}