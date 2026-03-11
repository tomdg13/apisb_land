import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(private dataSource: DataSource) {}

  // ============================================================
  // START or GET conversation (buyer sends first message)
  // ============================================================
  async startOrGetConversation(
    listingId: number, buyerId: number, firstMessage?: string,
  ): Promise<any> {
    try {
      // Get listing to find seller
      const [listing] = await this.dataSource.query(
        `SELECT listing_id, user_id, title FROM listings WHERE listing_id = ?`,
        [listingId],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };
      if (listing.user_id === buyerId)
        return { responseCode: '02', message: 'Cannot message your own listing' };

      const sellerId = listing.user_id;

      // Find or create conversation
      let [conv] = await this.dataSource.query(
        `SELECT * FROM conversations WHERE listing_id = ? AND buyer_id = ?`,
        [listingId, buyerId],
      );

      if (!conv) {
        const result = await this.dataSource.query(
          `INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)`,
          [listingId, buyerId, sellerId],
        );
        [conv] = await this.dataSource.query(
          `SELECT * FROM conversations WHERE conversation_id = ?`,
          [result.insertId],
        );
      }

      // Send first message if provided
      if (firstMessage?.trim()) {
        await this._sendMessage(conv.conversation_id, buyerId, sellerId, firstMessage.trim());
      }

      return { responseCode: '00', data: conv };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  async sendMessage(
    conversationId: number, senderId: number, text: string,
  ): Promise<any> {
    try {
      const [conv] = await this.dataSource.query(
        `SELECT * FROM conversations WHERE conversation_id = ?`, [conversationId],
      );
      if (!conv) return { responseCode: '01', message: 'Conversation not found' };

      // Check sender is part of conversation
      if (conv.buyer_id !== senderId && conv.seller_id !== senderId)
        return { responseCode: '03', message: 'Permission denied' };

      const receiverId = conv.buyer_id === senderId ? conv.seller_id : conv.buyer_id;
      const msg = await this._sendMessage(conversationId, senderId, receiverId, text);
      return { responseCode: '00', data: msg };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  private async _sendMessage(
    conversationId: number, senderId: number, receiverId: number, text: string,
  ) {
    // Insert message
    const result = await this.dataSource.query(
      `INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)`,
      [conversationId, senderId, text],
    );

    // Update conversation last_message + unread count
    const isBuyer = await this._isBuyer(conversationId, senderId);
    await this.dataSource.query(
      `UPDATE conversations SET
         last_message = ?, last_message_at = NOW(),
         ${isBuyer ? 'seller_unread = seller_unread + 1' : 'buyer_unread = buyer_unread + 1'}
       WHERE conversation_id = ?`,
      [text.substring(0, 200), conversationId],
    );

    const [msg] = await this.dataSource.query(
      `SELECT * FROM messages WHERE message_id = ?`, [result.insertId],
    );
    return msg;
  }

  private async _isBuyer(conversationId: number, userId: number): Promise<boolean> {
    const [conv] = await this.dataSource.query(
      `SELECT buyer_id FROM conversations WHERE conversation_id = ?`, [conversationId],
    );
    return conv?.buyer_id === userId;
  }

  // ============================================================
  // GET MESSAGES in a conversation
  // ============================================================
  async getMessages(conversationId: number, userId: number): Promise<any> {
    try {
      const [conv] = await this.dataSource.query(
        `SELECT * FROM conversations WHERE conversation_id = ?`, [conversationId],
      );
      if (!conv) return { responseCode: '01', message: 'Conversation not found' };
      if (conv.buyer_id !== userId && conv.seller_id !== userId)
        return { responseCode: '03', message: 'Permission denied' };

      const messages = await this.dataSource.query(
        `SELECT m.*, u.full_name AS sender_name, u.avatar_url AS sender_avatar
         FROM messages m
         JOIN users u ON u.user_id = m.sender_id
         WHERE m.conversation_id = ?
         ORDER BY m.created_date ASC`,
        [conversationId],
      );

      // Mark as read
      const unreadField = conv.buyer_id === userId ? 'buyer_unread' : 'seller_unread';
      await this.dataSource.query(
        `UPDATE conversations SET ${unreadField} = 0 WHERE conversation_id = ?`,
        [conversationId],
      );
      await this.dataSource.query(
        `UPDATE messages SET is_read = 1
         WHERE conversation_id = ? AND sender_id != ?`,
        [conversationId, userId],
      );

      // Get other party info
      const otherId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
      const [other] = await this.dataSource.query(
        `SELECT user_id, full_name, avatar_url, phone_number FROM users WHERE user_id = ?`,
        [otherId],
      );

      // Get listing info
      const [listing] = await this.dataSource.query(
        `SELECT listing_id, title, status,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1 LIMIT 1) AS cover_image
         FROM listings l WHERE listing_id = ?`,
        [conv.listing_id],
      );

      return { responseCode: '00', data: { conversation: conv, messages, other, listing } };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // GET MY CONVERSATIONS (inbox)
  // ============================================================
  async getMyConversations(userId: number): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT
           c.*,
           l.title AS listing_title,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1 LIMIT 1) AS listing_image,
           buyer.full_name   AS buyer_name,
           buyer.avatar_url  AS buyer_avatar,
           seller.full_name  AS seller_name,
           seller.avatar_url AS seller_avatar
         FROM conversations c
         JOIN listings l     ON l.listing_id   = c.listing_id
         JOIN users buyer    ON buyer.user_id   = c.buyer_id
         JOIN users seller   ON seller.user_id  = c.seller_id
         WHERE c.buyer_id = ? OR c.seller_id = ?
         ORDER BY c.last_message_at DESC`,
        [userId, userId],
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // TOTAL UNREAD COUNT
  // ============================================================
  async getUnreadCount(userId: number): Promise<any> {
    try {
      const [row] = await this.dataSource.query(
        `SELECT
           SUM(CASE WHEN buyer_id  = ? THEN buyer_unread  ELSE 0 END) +
           SUM(CASE WHEN seller_id = ? THEN seller_unread ELSE 0 END) AS total_unread
         FROM conversations
         WHERE buyer_id = ? OR seller_id = ?`,
        [userId, userId, userId, userId],
      );
      return { responseCode: '00', total_unread: Number(row.total_unread ?? 0) };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}