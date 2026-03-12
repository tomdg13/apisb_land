import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(private dataSource: DataSource) {}

  // ============================================================
  // GET COMMENTS for a listing (nested: top-level + replies)
  // ============================================================
  async getComments(listingId: number, userId: number | null = null): Promise<any> {
    try {
      // Top-level comments
      const topLevel = await this.dataSource.query(
        `SELECT
           c.comment_id, c.listing_id, c.parent_id,
           c.comment_text, c.likes_count, c.is_approved,
           c.created_date, c.updated_date,
           u.user_id, u.full_name, u.avatar_url,
           ${userId
             ? 'CASE WHEN cl.like_id IS NOT NULL THEN 1 ELSE 0 END'
             : '0'
           } AS is_liked
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         ${userId
           ? `LEFT JOIN comment_likes cl
              ON cl.comment_id = c.comment_id AND cl.user_id = ${userId}`
           : ''
         }
         WHERE c.listing_id = ? AND c.parent_id IS NULL AND c.is_approved = 1
         ORDER BY c.created_date DESC`,
        [listingId],
      );

      // Replies for all top-level comments
      if (topLevel.length === 0) return { responseCode: '00', data: [] };

      const topIds = topLevel.map((c: any) => c.comment_id);
      const replies = await this.dataSource.query(
        `SELECT
           c.comment_id, c.listing_id, c.parent_id,
           c.comment_text, c.likes_count, c.is_approved,
           c.created_date, c.updated_date,
           u.user_id, u.full_name, u.avatar_url,
           ${userId
             ? 'CASE WHEN cl.like_id IS NOT NULL THEN 1 ELSE 0 END'
             : '0'
           } AS is_liked
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         ${userId
           ? `LEFT JOIN comment_likes cl
              ON cl.comment_id = c.comment_id AND cl.user_id = ${userId}`
           : ''
         }
         WHERE c.parent_id IN (${topIds.join(',')}) AND c.is_approved = 1
         ORDER BY c.created_date ASC`,
        [],
      );

      // Nest replies under parent
      const replyMap: Record<number, any[]> = {};
      for (const r of replies) {
        if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
        replyMap[r.parent_id].push({ ...r, is_liked: r.is_liked == 1 || r.is_liked === '1' });
      }

      const data = topLevel.map((c: any) => ({
        ...c,
        is_liked: c.is_liked == 1 || c.is_liked === '1',
        replies: replyMap[c.comment_id] ?? [],
      }));

      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // ADD COMMENT (top-level or reply)
  // ============================================================
  async addComment(
    listingId: number,
    userId: number,
    text: string,
    parentId?: number,
  ): Promise<any> {
    try {
      // Validate listing exists
      const [listing] = await this.dataSource.query(
        `SELECT listing_id FROM listings WHERE listing_id = ? AND status = 'active'`,
        [listingId],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found or not active' };

      // Validate parent exists (if reply)
      if (parentId) {
        const [parent] = await this.dataSource.query(
          `SELECT comment_id, parent_id FROM listing_comments WHERE comment_id = ?`,
          [parentId],
        );
        if (!parent) return { responseCode: '02', message: 'Parent comment not found' };
        // Prevent reply-to-reply (max 2 levels)
        if (parent.parent_id !== null)
          return { responseCode: '03', message: 'Cannot reply to a reply' };
      }

      const result = await this.dataSource.query(
        `INSERT INTO listing_comments (listing_id, user_id, parent_id, comment_text)
         VALUES (?, ?, ?, ?)`,
        [listingId, userId, parentId ?? null, text.trim()],
      );

      const [newComment] = await this.dataSource.query(
        `SELECT c.*, u.full_name, u.avatar_url
         FROM listing_comments c
         JOIN users u ON u.user_id = c.user_id
         WHERE c.comment_id = ?`,
        [result.insertId],
      );

      return {
        responseCode: '00',
        message: 'Comment added',
        data: { ...newComment, is_liked: false, replies: [] },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // DELETE COMMENT (owner or Admin/Manager)
  // ============================================================
  async deleteComment(commentId: number, userId: number, userRole: string): Promise<any> {
    try {
      const [comment] = await this.dataSource.query(
        `SELECT comment_id, user_id FROM listing_comments WHERE comment_id = ?`,
        [commentId],
      );
      if (!comment) return { responseCode: '01', message: 'Comment not found' };
      if (comment.user_id !== userId && !['Admin', 'Manager'].includes(userRole))
        return { responseCode: '03', message: 'Permission denied' };

      // Deleting parent also deletes replies (ON DELETE CASCADE)
      await this.dataSource.query(
        `DELETE FROM listing_comments WHERE comment_id = ?`, [commentId],
      );
      return { responseCode: '00', message: 'Comment deleted' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // TOGGLE LIKE
  // ============================================================
  async toggleLike(commentId: number, userId: number): Promise<any> {
    try {
      const [existing] = await this.dataSource.query(
        `SELECT like_id FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId],
      );

      if (existing) {
        await this.dataSource.query(
          `DELETE FROM comment_likes WHERE like_id = ?`, [existing.like_id],
        );
        await this.dataSource.query(
          `UPDATE listing_comments
           SET likes_count = GREATEST(0, likes_count - 1)
           WHERE comment_id = ?`,
          [commentId],
        );
        return { responseCode: '00', is_liked: false };
      } else {
        await this.dataSource.query(
          `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`,
          [commentId, userId],
        );
        await this.dataSource.query(
          `UPDATE listing_comments SET likes_count = likes_count + 1 WHERE comment_id = ?`,
          [commentId],
        );
        return { responseCode: '00', is_liked: true };
      }
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // ADMIN — hide/show comment
  // ============================================================
  async setApproved(commentId: number, approved: boolean): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE listing_comments SET is_approved = ? WHERE comment_id = ?`,
        [approved ? 1 : 0, commentId],
      );
      return { responseCode: '00', message: approved ? 'Comment visible' : 'Comment hidden' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}