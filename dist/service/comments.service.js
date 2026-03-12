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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let CommentsService = class CommentsService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getComments(listingId, userId = null) {
        try {
            const topLevel = await this.dataSource.query(`SELECT
           c.comment_id, c.listing_id, c.parent_id,
           c.comment_text, c.likes_count, c.is_approved,
           c.created_date, c.updated_date,
           u.user_id, u.full_name, u.avatar_url,
           ${userId
                ? 'CASE WHEN cl.like_id IS NOT NULL THEN 1 ELSE 0 END'
                : '0'} AS is_liked
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         ${userId
                ? `LEFT JOIN comment_likes cl
              ON cl.comment_id = c.comment_id AND cl.user_id = ${userId}`
                : ''}
         WHERE c.listing_id = ? AND c.parent_id IS NULL AND c.is_approved = 1
         ORDER BY c.created_date DESC`, [listingId]);
            if (topLevel.length === 0)
                return { responseCode: '00', data: [] };
            const topIds = topLevel.map((c) => c.comment_id);
            const replies = await this.dataSource.query(`SELECT
           c.comment_id, c.listing_id, c.parent_id,
           c.comment_text, c.likes_count, c.is_approved,
           c.created_date, c.updated_date,
           u.user_id, u.full_name, u.avatar_url,
           ${userId
                ? 'CASE WHEN cl.like_id IS NOT NULL THEN 1 ELSE 0 END'
                : '0'} AS is_liked
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         ${userId
                ? `LEFT JOIN comment_likes cl
              ON cl.comment_id = c.comment_id AND cl.user_id = ${userId}`
                : ''}
         WHERE c.parent_id IN (${topIds.join(',')}) AND c.is_approved = 1
         ORDER BY c.created_date ASC`, []);
            const replyMap = {};
            for (const r of replies) {
                if (!replyMap[r.parent_id])
                    replyMap[r.parent_id] = [];
                replyMap[r.parent_id].push({ ...r, is_liked: r.is_liked == 1 || r.is_liked === '1' });
            }
            const data = topLevel.map((c) => ({
                ...c,
                is_liked: c.is_liked == 1 || c.is_liked === '1',
                replies: replyMap[c.comment_id] ?? [],
            }));
            return { responseCode: '00', data };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async addComment(listingId, userId, text, parentId) {
        try {
            const [listing] = await this.dataSource.query(`SELECT listing_id FROM listings WHERE listing_id = ? AND status = 'active'`, [listingId]);
            if (!listing)
                return { responseCode: '01', message: 'Listing not found or not active' };
            if (parentId) {
                const [parent] = await this.dataSource.query(`SELECT comment_id, parent_id FROM listing_comments WHERE comment_id = ?`, [parentId]);
                if (!parent)
                    return { responseCode: '02', message: 'Parent comment not found' };
                if (parent.parent_id !== null)
                    return { responseCode: '03', message: 'Cannot reply to a reply' };
            }
            const result = await this.dataSource.query(`INSERT INTO listing_comments (listing_id, user_id, parent_id, comment_text)
         VALUES (?, ?, ?, ?)`, [listingId, userId, parentId ?? null, text.trim()]);
            try {
                if (parentId) {
                    const [pc] = await this.dataSource.query(`SELECT c.user_id, u.full_name, l.title
             FROM listing_comments c
             JOIN users u ON u.user_id = ?
             JOIN listings l ON l.listing_id = ?
             WHERE c.comment_id = ?`, [userId, listingId, parentId]);
                    if (pc && pc.user_id !== userId) {
                        await this.dataSource.query(`INSERT INTO notifications (user_id, type, title, body, actor_id, ref_id)
               VALUES (?, 'reply', 'ຕອບກັບຄໍາເຫັນ', ?, ?, ?)`, [pc.user_id, pc.full_name + ' ໄດ້ຕອບກັບຄໍາເຫັນໃນ "' + pc.title + '"', userId, listingId]);
                    }
                }
                else {
                    const [lo] = await this.dataSource.query(`SELECT l.user_id, u.full_name AS commenter_name, l.title
             FROM listings l JOIN users u ON u.user_id = ?
             WHERE l.listing_id = ?`, [userId, listingId]);
                    if (lo && lo.user_id !== userId) {
                        await this.dataSource.query(`INSERT INTO notifications (user_id, type, title, body, actor_id, ref_id)
               VALUES (?, 'comment', 'ຄໍາເຫັນໃໝ່', ?, ?, ?)`, [lo.user_id, lo.commenter_name + ' ໄດ້ comment ໃນ "' + lo.title + '"', userId, listingId]);
                    }
                }
            }
            catch (_) { }
            const [newComment] = await this.dataSource.query(`SELECT c.*, u.full_name, u.avatar_url
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         WHERE c.comment_id = ?`, [result.insertId]);
            return {
                responseCode: '00',
                message: 'Comment added',
                data: { ...newComment, is_liked: false, replies: [] },
            };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteComment(commentId, userId, userRole) {
        try {
            const [comment] = await this.dataSource.query(`SELECT comment_id, user_id FROM listing_comments WHERE comment_id = ?`, [commentId]);
            if (!comment)
                return { responseCode: '01', message: 'Comment not found' };
            if (comment.user_id !== userId && !['Admin', 'Manager'].includes(userRole))
                return { responseCode: '03', message: 'Permission denied' };
            await this.dataSource.query(`DELETE FROM listing_comments WHERE comment_id = ?`, [commentId]);
            return { responseCode: '00', message: 'Comment deleted' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async toggleLike(commentId, userId) {
        try {
            const [existing] = await this.dataSource.query(`SELECT like_id FROM comment_likes WHERE comment_id = ? AND user_id = ?`, [commentId, userId]);
            if (existing) {
                await this.dataSource.query(`DELETE FROM comment_likes WHERE like_id = ?`, [existing.like_id]);
                await this.dataSource.query(`UPDATE listing_comments
           SET likes_count = GREATEST(0, likes_count - 1)
           WHERE comment_id = ?`, [commentId]);
                return { responseCode: '00', is_liked: false };
            }
            else {
                await this.dataSource.query(`INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`, [commentId, userId]);
                await this.dataSource.query(`UPDATE listing_comments SET likes_count = likes_count + 1 WHERE comment_id = ?`, [commentId]);
                return { responseCode: '00', is_liked: true };
            }
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async setApproved(commentId, approved) {
        try {
            await this.dataSource.query(`UPDATE listing_comments SET is_approved = ? WHERE comment_id = ?`, [approved ? 1 : 0, commentId]);
            return { responseCode: '00', message: approved ? 'Comment visible' : 'Comment hidden' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CommentsService);
//# sourceMappingURL=comments.service.js.map