"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../service/users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let usersController = class usersController {
    constructor(testService) {
        this.testService = testService;
    }
    async getAll() {
        try {
            return await this.testService.getAll();
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching users', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBranches() {
        try {
            return await this.testService.getBranches();
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching branches', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCountersByBranch(branchId) {
        try {
            return await this.testService.getCountersByBranch(branchId);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching counters', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(body) {
        try {
            return await this.testService.create(body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating user', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, body) {
        try {
            return await this.testService.update(id, body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating user', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            return await this.testService.remove(id);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting user', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unlock(id) {
        try {
            return await this.testService.unlock(id);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error unlocking user', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoles() {
        try {
            return await this.testService.getRoles();
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching roles', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createRole(body) {
        try {
            return await this.testService.createRole(body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating role', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(id, body) {
        try {
            return await this.testService.updateRole(id, body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating role', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteRole(id) {
        try {
            return await this.testService.deleteRole(id);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting role', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMenus() {
        try {
            return await this.testService.getMenus();
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching menus', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createMenu(body) {
        try {
            return await this.testService.createMenu(body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error creating menu', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateMenu(id, body) {
        try {
            return await this.testService.updateMenu(id, body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating menu', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMenu(id) {
        try {
            return await this.testService.deleteMenu(id);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error deleting menu', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoleMap() {
        try {
            return await this.testService.getRoleMap();
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error fetching role map', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRoleMap(body) {
        try {
            return await this.testService.updateRoleMap(body);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: 'Error updating role map', message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.usersController = usersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Get)('branches/:branchId/counters'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getCountersByBranch", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/unlock'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "unlock", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('menus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Post)('menus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Put)('menus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateMenu", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "deleteMenu", null);
__decorate([
    (0, common_1.Get)('role-map'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getRoleMap", null);
__decorate([
    (0, common_1.Put)('role-map'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateRoleMap", null);
exports.usersController = usersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.usersService])
], usersController);
//# sourceMappingURL=users.controller.js.map