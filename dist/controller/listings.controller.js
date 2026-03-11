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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const listings_service_1 = require("../service/listings.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const decorators_1 = require("../auth/decorators");
const listings_dto_1 = require("../dto/listings.dto");
const imageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/listings',
    filename: (_req, file, cb) => {
        cb(null, `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`);
    },
});
const imageFilter = (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new common_1.BadRequestException('Only JPG, PNG, WEBP images allowed'), false);
    }
    cb(null, true);
};
let ListingsController = class ListingsController {
    constructor(listingsService, config) {
        this.listingsService = listingsService;
        this.config = config;
    }
    get appUrl() {
        return this.config.get('APP_URL', 'http://localhost:3000');
    }
    async getAll(query, req) {
        const userId = req.user?.userId ?? null;
        return this.listingsService.getAll(query, userId);
    }
    async getCategories() {
        return this.listingsService.getCategories();
    }
    async getProvinces() {
        return this.listingsService.getProvinces();
    }
    async getDistricts(id) {
        return this.listingsService.getDistricts(id);
    }
    async getVillages(id) {
        return this.listingsService.getVillages(id);
    }
    async getPackages() {
        return this.listingsService.getPackages();
    }
    async createInquiry(dto, req) {
        const userId = req.user?.userId;
        return this.listingsService.createInquiry(dto, userId);
    }
    async getOne(id) {
        return this.listingsService.getOne(id);
    }
    async getMyListings(req, query) {
        return this.listingsService.getMyListings(req.user.userId, query);
    }
    async getMyFavorites(req) {
        return this.listingsService.getMyFavorites(req.user.userId);
    }
    async create(dto, req) {
        try {
            return await this.listingsService.create(dto, req.user.userId);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, dto, req) {
        try {
            return await this.listingsService.update(id, dto, req.user.userId, req.user.role);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id, req) {
        try {
            return await this.listingsService.remove(id, req.user.userId, req.user.role);
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async approve(id) {
        return this.listingsService.approve(id);
    }
    async reject(id, body) {
        return this.listingsService.reject(id, body.reason);
    }
    async uploadImages(id, files, req) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        return this.listingsService.addImages(id, files, req.user.userId, req.user.role, this.appUrl);
    }
    async deleteImage(imageId, req) {
        return this.listingsService.deleteImage(imageId, req.user.userId, req.user.role);
    }
    async setCover(imageId, req) {
        return this.listingsService.setCover(imageId, req.user.userId, req.user.role);
    }
    async saveLandDetail(id, dto, req) {
        return this.listingsService.saveLandDetail(id, dto, req.user.userId, req.user.role);
    }
    async toggleFavorite(id, req) {
        return this.listingsService.toggleFavorite(id, req.user.userId);
    }
    async getInquiries(id, req) {
        return this.listingsService.getInquiries(id, req.user.userId, req.user.role);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.OptionalAuth)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listings_dto_1.ListingQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('provinces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Get)('provinces/:id/districts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('districts/:id/villages'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getVillages", null);
__decorate([
    (0, common_1.Get)('packages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Post)('inquiries'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listings_dto_1.CreateInquiryDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "createInquiry", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)('my/list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, listings_dto_1.ListingQueryDto]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getMyListings", null);
__decorate([
    (0, common_1.Get)('my/favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getMyFavorites", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listings_dto_1.CreateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, listings_dto_1.UpdateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: imageStorage,
        fileFilter: imageFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Delete)('images/:imageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Patch)('images/:imageId/cover'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "setCover", null);
__decorate([
    (0, common_1.Post)(':id/land-detail'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, listings_dto_1.LandDetailDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "saveLandDetail", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Get)(':id/inquiries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getInquiries", null);
exports.ListingsController = ListingsController = __decorate([
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService,
        config_1.ConfigService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map