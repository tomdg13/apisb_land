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
exports.usersController = exports.Public = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../service/users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
let usersController = class usersController {
    constructor(testService) {
        this.testService = testService;
    }
    async getAll() {
        try {
            return await this.testService.getAll();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBranches() {
        try {
            return await this.testService.getBranches();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCountersByBranch(branchId) {
        try {
            return await this.testService.getCountersByBranch(branchId);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(body) {
        try {
            return await this.testService.create(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, body) {
        try {
            return await this.testService.update(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            return await this.testService.remove(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unlock(id) {
        try {
            return await this.testService.unlock(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoles() {
        try {
            return await this.testService.getRoles();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createRole(body) {
        try {
            return await this.testService.createRole(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(id, body) {
        try {
            return await this.testService.updateRole(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteRole(id) {
        try {
            return await this.testService.deleteRole(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMenus() {
        try {
            return await this.testService.getMenus();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createMenu(body) {
        try {
            return await this.testService.createMenu(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateMenu(id, body) {
        try {
            return await this.testService.updateMenu(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMenu(id) {
        try {
            return await this.testService.deleteMenu(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoleMap() {
        try {
            return await this.testService.getRoleMap();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRoleMap(body) {
        try {
            return await this.testService.updateRoleMap(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategories() {
        try {
            return await this.testService.getCategories();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCategory(body) {
        try {
            return await this.testService.createCategory(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(id, body) {
        try {
            return await this.testService.updateCategory(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCategory(id) {
        try {
            return await this.testService.deleteCategory(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProvinces() {
        try {
            return await this.testService.getProvinces();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createProvince(body) {
        try {
            return await this.testService.createProvince(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProvince(id, body) {
        try {
            return await this.testService.updateProvince(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProvince(id) {
        try {
            return await this.testService.deleteProvince(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDistricts(provinceId) {
        try {
            return await this.testService.getDistricts(provinceId);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createDistrict(body) {
        try {
            return await this.testService.createDistrict(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDistrict(id, body) {
        try {
            return await this.testService.updateDistrict(id, body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteDistrict(id) {
        try {
            return await this.testService.deleteDistrict(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDashboard() {
        try {
            return await this.testService.getDashboardStats();
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async requestOtp(body) {
        try {
            return await this.testService.requestOtp(body.phone_number, body.type || 'register');
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyOtp(body) {
        try {
            return await this.testService.verifyOtp(body.phone_number, body.otp_code, body.type || 'register');
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async registerWithOtp(body) {
        try {
            return await this.testService.registerWithOtp(body);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async selfResetPassword(body) {
        try {
            return await this.testService.selfResetPassword(body.phone_number, body.new_password);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async adminResetPassword(id, body, req) {
        try {
            return await this.testService.adminResetPassword(id, body.new_password, req.user?.userId);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('provinces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Post)('provinces'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "createProvince", null);
__decorate([
    (0, common_1.Put)('provinces/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateProvince", null);
__decorate([
    (0, common_1.Delete)('provinces/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "deleteProvince", null);
__decorate([
    (0, common_1.Get)('districts'),
    __param(0, (0, common_1.Query)('province_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Post)('districts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "createDistrict", null);
__decorate([
    (0, common_1.Put)('districts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "updateDistrict", null);
__decorate([
    (0, common_1.Delete)('districts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "deleteDistrict", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], usersController.prototype, "getDashboard", null);
__decorate([
    (0, exports.Public)(),
    (0, common_1.Post)('otp/request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "requestOtp", null);
__decorate([
    (0, exports.Public)(),
    (0, common_1.Post)('otp/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "verifyOtp", null);
__decorate([
    (0, exports.Public)(),
    (0, common_1.Post)('register-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "registerWithOtp", null);
__decorate([
    (0, exports.Public)(),
    (0, common_1.Post)('self-reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "selfResetPassword", null);
__decorate([
    (0, common_1.Put)('reset-password/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "adminResetPassword", null);
exports.usersController = usersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.usersService])
], usersController);
//# sourceMappingURL=users.controller.js.map