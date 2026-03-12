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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const decorators_1 = require("../auth/decorators");
const profile_service_1 = require("../service/profile.service");
const avatarStorage = (0, multer_1.diskStorage)({
    destination: './uploads/avatars',
    filename: (_req, file, cb) => cb(null, `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`),
});
const coverStorage = (0, multer_1.diskStorage)({
    destination: './uploads/covers',
    filename: (_req, file, cb) => cb(null, `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`),
});
let ProfileController = class ProfileController {
    constructor(profileService, config) {
        this.profileService = profileService;
        this.config = config;
    }
    get appUrl() {
        return this.config.get('APP_URL', 'http://localhost:3000');
    }
    async getMyProfile(req) {
        return this.profileService.getMyProfile(req.user.userId);
    }
    async getProfile(userId, req) {
        return this.profileService.getProfile(userId, req.user?.userId ?? null);
    }
    async updateProfile(body, req) {
        return this.profileService.updateProfile(req.user.userId, body);
    }
    async uploadAvatar(file, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const url = `${this.appUrl}/uploads/avatars/${file.filename}`;
        return this.profileService.updateAvatar(req.user.userId, url);
    }
    async uploadCover(file, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const url = `${this.appUrl}/uploads/covers/${file.filename}`;
        return this.profileService.updateCoverUrl(req.user.userId, url);
    }
    async changePassword(body, req) {
        if (!body.new_password || body.new_password.length < 6)
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        return this.profileService.changePassword(req.user.userId, body.current_password, body.new_password);
    }
    async addReview(sellerId, body, req) {
        return this.profileService.addReview(sellerId, req.user.userId, body.rating, body.review_text ?? '', body.listing_id);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.OptionalAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('me/avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: avatarStorage,
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/))
                return cb(new common_1.BadRequestException('Images only'), false);
            cb(null, true);
        },
        limits: { fileSize: 3 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Post)('me/cover'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cover', {
        storage: coverStorage,
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/))
                return cb(new common_1.BadRequestException('Images only'), false);
            cb(null, true);
        },
        limits: { fileSize: 8 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadCover", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)(':userId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "addReview", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService,
        config_1.ConfigService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map