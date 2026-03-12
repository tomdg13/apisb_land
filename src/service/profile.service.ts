import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(private dataSource: DataSource) {}

  // ============================================================
  // GET PROFILE (public — by userId)
  // ============================================================
  async getProfile(userId: number, viewerId: number | null = null): Promise<any> {
    try {
      const [user] = await this.dataSource.query(
        `SELECT
           u.user_id, u.full_name, u.phone_number, u.email,
           u.avatar_url, u.role, u.created_date,
           p.cover_url,
           p.bio, p.date_of_birth, p.gender,
           p.website_url, p.facebook_url, p.line_id, p.whatsapp,
           p.province_id, p.district_id, p.address_detail,
           p.is_agent, p.company_name, p.company_logo_url, p.license_number,
           p.total_listings, p.total_sold, p.total_reviews, p.avg_rating,
           p.is_verified, p.verified_at,
           p.notify_messages, p.notify_comments, p.notify_favorites,
           p.lang_pref,
           prov.province_name, dist.district_name
         FROM users u
         LEFT JOIN user_profiles p   ON p.user_id     = u.user_id
         LEFT JOIN provinces prov    ON prov.province_id = p.province_id
         LEFT JOIN districts dist    ON dist.district_id = p.district_id
         WHERE u.user_id = ? AND u.is_active = 1`,
        [userId],
      );
      if (!user) return { responseCode: '01', message: 'User not found' };

      // Count active listings
      const [stats] = await this.dataSource.query(
        `SELECT
           COUNT(*) AS total_listings,
           SUM(status = 'sold' OR status = 'rented') AS total_sold
         FROM listings WHERE user_id = ? AND status != 'draft'`,
        [userId],
      );

      // Recent listings (6)
      const listings = await this.dataSource.query(
        `SELECT
           l.listing_id, l.title, l.price, l.currency,
           l.listing_type, l.status, l.created_date,
           c.name AS category,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1
            LIMIT 1) AS cover_image
         FROM listings l
         JOIN categories c ON c.category_id = l.category_id
         WHERE l.user_id = ? AND l.status = 'active'
         ORDER BY l.created_date DESC LIMIT 6`,
        [userId],
      );

      // Reviews
      const reviews = await this.dataSource.query(
        `SELECT
           r.review_id, r.rating, r.review_text, r.created_date,
           r.listing_id,
           u.full_name AS reviewer_name, u.avatar_url AS reviewer_avatar,
           l.title AS listing_title
         FROM user_reviews r
         JOIN users u ON u.user_id = r.reviewer_id
         LEFT JOIN listings l ON l.listing_id = r.listing_id
         WHERE r.seller_id = ?
         ORDER BY r.created_date DESC LIMIT 10`,
        [userId],
      );

      return {
        responseCode: '00',
        data: {
          ...user,
          total_listings: Number(stats.total_listings ?? 0),
          total_sold:     Number(stats.total_sold ?? 0),
          listings,
          reviews,
        },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // GET MY PROFILE
  // ============================================================
  async getMyProfile(userId: number): Promise<any> {
    return this.getProfile(userId, userId);
  }

  // ============================================================
  // UPDATE PROFILE
  // ============================================================
  async updateProfile(userId: number, dto: any): Promise<any> {
    try {
      const userFields: string[] = [];
      const userParams: any[] = [];
      const setUserField = (col: string, val: any) => {
        if (val !== undefined) { userFields.push(`${col} = ?`); userParams.push(val); }
      };
      setUserField('full_name',    dto.full_name);
      setUserField('email',        dto.email);
      setUserField('phone_number', dto.phone_number);

      if (userFields.length > 0) {
        userParams.push(userId);
        await this.dataSource.query(
          `UPDATE users SET ${userFields.join(', ')} WHERE user_id = ?`, userParams,
        );
      }

      const profFields: string[] = [];
      const profParams: any[] = [];
      const setProfField = (col: string, val: any) => {
        if (val !== undefined) { profFields.push(`${col} = ?`); profParams.push(val); }
      };
      setProfField('bio',              dto.bio);
      setProfField('date_of_birth',    dto.date_of_birth);
      setProfField('gender',           dto.gender);
      setProfField('website_url',      dto.website_url);
      setProfField('facebook_url',     dto.facebook_url);
      setProfField('line_id',          dto.line_id);
      setProfField('whatsapp',         dto.whatsapp);
      setProfField('province_id',      dto.province_id);
      setProfField('district_id',      dto.district_id);
      setProfField('address_detail',   dto.address_detail);
      setProfField('is_agent',         dto.is_agent);
      setProfField('company_name',     dto.company_name);
      setProfField('company_logo_url', dto.company_logo_url);
      setProfField('license_number',   dto.license_number);
      setProfField('notify_messages',  dto.notify_messages);
      setProfField('notify_comments',  dto.notify_comments);
      setProfField('notify_favorites', dto.notify_favorites);
      setProfField('lang_pref',        dto.lang_pref);

      if (profFields.length > 0) {
        profParams.push(userId);
        await this.dataSource.query(
          `INSERT INTO user_profiles (user_id) VALUES (?)
           ON DUPLICATE KEY UPDATE ${profFields.join(', ')}`,
          [userId, ...profParams],
        );
      }

      return { responseCode: '00', message: 'Profile updated successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // UPDATE AVATAR
  // ============================================================
  async updateAvatar(userId: number, avatarUrl: string): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE users SET avatar_url = ? WHERE user_id = ?`, [avatarUrl, userId],
      );
      return { responseCode: '00', message: 'Avatar updated', avatar_url: avatarUrl };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // UPDATE COVER
  // ============================================================
  async updateCoverUrl(userId: number, coverUrl: string): Promise<any> {
    try {
      await this.dataSource.query(
        `INSERT INTO user_profiles (user_id, cover_url) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE cover_url = ?`,
        [userId, coverUrl, coverUrl],
      );
      return { responseCode: '00', message: 'Cover updated', data: { cover_url: coverUrl } };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================
  async changePassword(
    userId: number, currentPassword: string, newPassword: string,
  ): Promise<any> {
    try {
      const bcrypt = require('bcrypt');
      const [user] = await this.dataSource.query(
        `SELECT password_hash FROM users WHERE user_id = ?`, [userId],
      );
      if (!user) return { responseCode: '01', message: 'User not found' };

      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) return { responseCode: '02', message: 'ລະຫັດຜ່ານປັດຈຸບັນບໍ່ຖືກຕ້ອງ' };

      const hash = await bcrypt.hash(newPassword, 10);
      await this.dataSource.query(
        `UPDATE users SET password_hash = ? WHERE user_id = ?`, [hash, userId],
      );
      return { responseCode: '00', message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ============================================================
  // ADD REVIEW
  // ============================================================
  async addReview(
    sellerId: number, reviewerId: number,
    rating: number, text: string, listingId?: number,
  ): Promise<any> {
    try {
      if (sellerId === reviewerId)
        return { responseCode: '02', message: 'Cannot review yourself' };
      if (rating < 1 || rating > 5)
        return { responseCode: '03', message: 'Rating must be 1-5' };

      await this.dataSource.query(
        `INSERT INTO user_reviews (seller_id, reviewer_id, listing_id, rating, review_text)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE rating = VALUES(rating), review_text = VALUES(review_text)`,
        [sellerId, reviewerId, listingId ?? null, rating, text ?? null],
      );

      await this.dataSource.query(
        `UPDATE user_profiles
         SET
           total_reviews = (SELECT COUNT(*) FROM user_reviews WHERE seller_id = ?),
           avg_rating    = (SELECT AVG(rating)  FROM user_reviews WHERE seller_id = ?)
         WHERE user_id = ?`,
        [sellerId, sellerId, sellerId],
      );

      return { responseCode: '00', message: 'Review submitted' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}