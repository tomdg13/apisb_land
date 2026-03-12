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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let NotificationsService = class NotificationsService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getNotifications(userId, limit = 30) {
        try {
            const rows = await this.dataSource.query(`SELECT n.notif_id, n.type, n.title, n.body, n.is_read,
                n.ref_id, n.created_at,
                a.full_name AS actor_name, a.avatar_url AS actor_avatar
         FROM notifications n
         LEFT JOIN users a ON a.user_id = n.actor_id
         WHERE n.user_id = ?
         ORDER BY n.created_at DESC
         LIMIT ?`, [userId, limit]);
            return { responseCode: '00', data: rows };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getUnreadCount(userId) {
        try {
            const [row] = await this.dataSource.query(`SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`, [userId]);
            return { responseCode: '00', count: Number(row.count) };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async markRead(notifId, userId) {
        try {
            await this.dataSource.query(`UPDATE notifications SET is_read = 1
         WHERE notif_id = ? AND user_id = ?`, [notifId, userId]);
            return { responseCode: '00', message: 'Marked as read' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async markAllRead(userId) {
        try {
            await this.dataSource.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
            return { responseCode: '00', message: 'All marked as read' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map