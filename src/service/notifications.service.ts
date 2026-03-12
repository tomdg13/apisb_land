import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // ── Get notifications for user ───────────────────────────────
  async getNotifications(userId: number, limit = 30): Promise<any> {
    try {
      const rows = await this.dataSource.query(
        `SELECT n.notif_id, n.type, n.title, n.body, n.is_read,
                n.ref_id, n.created_at,
                a.full_name AS actor_name, a.avatar_url AS actor_avatar
         FROM notifications n
         LEFT JOIN users a ON a.user_id = n.actor_id
         WHERE n.user_id = ?
         ORDER BY n.created_at DESC
         LIMIT ?`,
        [userId, limit],
      );
      return { responseCode: '00', data: rows };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ── Unread count ─────────────────────────────────────────────
  async getUnreadCount(userId: number): Promise<any> {
    try {
      const [row] = await this.dataSource.query(
        `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`,
        [userId],
      );
      return { responseCode: '00', count: Number(row.count) };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ── Mark one as read ─────────────────────────────────────────
  async markRead(notifId: number, userId: number): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE notifications SET is_read = 1
         WHERE notif_id = ? AND user_id = ?`,
        [notifId, userId],
      );
      return { responseCode: '00', message: 'Marked as read' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ── Mark all as read ─────────────────────────────────────────
  async markAllRead(userId: number): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
        [userId],
      );
      return { responseCode: '00', message: 'All marked as read' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}