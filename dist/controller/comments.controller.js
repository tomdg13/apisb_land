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
exports.CommentLikeController = exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const decorators_1 = require("../auth/decorators");
const comments_service_1 = require("../service/comments.service");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async getComments(listingId, req) {
        const userId = req.user?.userId ?? null;
        return this.commentsService.getComments(listingId, userId);
    }
    async addComment(listingId, body, req) {
        return this.commentsService.addComment(listingId, req.user.userId, body.comment_text, body.parent_id);
    }
    async deleteComment(commentId, req) {
        return this.commentsService.deleteComment(commentId, req.user.userId, req.user.role);
    }
    async toggleLike(commentId, req) {
        return this.commentsService.toggleLike(commentId, req.user.userId);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.OptionalAuth)(),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)(':commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)(':commentId/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "toggleLike", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('listings/:listingId/comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
let CommentLikeController = class CommentLikeController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async toggleLike(commentId, req) {
        return this.commentsService.toggleLike(commentId, req.user.userId);
    }
    async approve(commentId, body) {
        return this.commentsService.setApproved(commentId, body.approved);
    }
};
exports.CommentLikeController = CommentLikeController;
__decorate([
    (0, common_1.Post)(':commentId/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Patch)(':commentId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "approve", null);
exports.CommentLikeController = CommentLikeController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentLikeController);
//# sourceMappingURL=comments.controller.js.map