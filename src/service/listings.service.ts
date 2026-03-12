import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateListingDto, UpdateListingDto,
  LandDetailDto, CreateInquiryDto, ListingQueryDto,
} from 'src/dto/listings.dto';

@Injectable()
export class ListingsService {
  constructor(private dataSource: DataSource) {}

  // ==========================================
  // GET ALL LISTINGS (public, paginated, filtered)
  // ==========================================
  async getAll(query: ListingQueryDto, userId: number | null = null): Promise<any> {
    try {
      const {
        page = 1, limit = 12,
        category_id, province_id, district_id,
        listing_type, status = 'active',
        min_price, max_price, is_featured,
        search, sort_by = 'created_date', sort_order = 'DESC',
      } = query;

      const offset = (Number(page) - 1) * Number(limit);

      // Build WHERE clauses
      const conditions: string[] = ['l.status = ?'];
      const params: any[] = [status];

      if (category_id) { conditions.push('l.category_id = ?'); params.push(category_id); }
      if (province_id) { conditions.push('l.province_id = ?'); params.push(province_id); }
      if (district_id) { conditions.push('l.district_id = ?'); params.push(district_id); }
      if (listing_type) { conditions.push('l.listing_type = ?'); params.push(listing_type); }
      if (is_featured !== undefined) { conditions.push('l.is_featured = ?'); params.push(is_featured); }
      if (min_price !== undefined) { conditions.push('l.price >= ?'); params.push(min_price); }
      if (max_price !== undefined) { conditions.push('l.price <= ?'); params.push(max_price); }
      if (search) {
        conditions.push('(l.title LIKE ? OR l.description LIKE ? OR l.address_detail LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const where = conditions.join(' AND ');

      // Allowed sort columns (prevent SQL injection)
      const sortCol = ['price', 'created_date', 'views_count', 'is_featured']
        .includes(sort_by) ? sort_by : 'created_date';
      const sortDir = sort_order === 'ASC' ? 'ASC' : 'DESC';

      // Count total
      const [countRow] = await this.dataSource.query(
        `SELECT COUNT(*) AS total FROM listings l WHERE ${where}`,
        params,
      );
      const total = Number(countRow.total);

      // Fetch paginated data
      const data = await this.dataSource.query(
        `SELECT
           l.listing_id, l.title, l.title_en,
           l.price, l.currency, l.area, l.area_unit,
           l.listing_type, l.status, l.is_featured,
           l.views_count, l.negotiable,
           l.contact_phone, l.contact_name,
           l.province_id, l.district_id,
           l.created_date, l.expires_at,
           c.name        AS category,
           c.name_en     AS category_en,
           c.icon        AS category_icon,
           p.province_name AS province,
           d.district_name AS district,
           u.user_id     AS seller_id,
           u.full_name   AS seller_name,
           u.avatar_url  AS seller_avatar,
           u.phone_number AS seller_phone,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1
            LIMIT 1) AS cover_image,
           ${userId ? 'CASE WHEN f.favorite_id IS NOT NULL THEN 1 ELSE 0 END' : '0'} AS is_favorite
         FROM listings l
         JOIN users      u ON u.user_id      = l.user_id
         JOIN categories c ON c.category_id  = l.category_id
         LEFT JOIN provinces p ON p.province_id = l.province_id
         LEFT JOIN districts d ON d.district_id = l.district_id
         ${userId ? 'LEFT JOIN favorites f ON f.listing_id = l.listing_id AND f.user_id = ' + userId : ''}
         WHERE ${where}
         ORDER BY l.${sortCol} ${sortDir}
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset],
      );

      return {
        responseCode: '00',
        data,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // GET SINGLE LISTING (+ increment views)
  // ==========================================
  async getOne(id: number): Promise<any> {
    try {
      // Increment view count
      await this.dataSource.query(
        `UPDATE listings SET views_count = views_count + 1 WHERE listing_id = ?`,
        [id],
      );

      const [listing] = await this.dataSource.query(
        `SELECT
           l.*,
           c.name        AS category,
           c.name_en     AS category_en,
           c.icon        AS category_icon,
           p.province_name AS province,
           d.district_name AS district,
           v.village_name  AS village,
           u.user_id     AS seller_id,
           u.full_name   AS seller_name,
           u.avatar_url  AS seller_avatar,
           u.phone_number AS seller_phone,
           u.email       AS seller_email
         FROM listings l
         JOIN users      u ON u.user_id      = l.user_id
         JOIN categories c ON c.category_id  = l.category_id
         LEFT JOIN provinces p ON p.province_id = l.province_id
         LEFT JOIN districts d ON d.district_id = l.district_id
         LEFT JOIN villages  v ON v.village_id  = l.village_id
         WHERE l.listing_id = ?`,
        [id],
      );

      if (!listing) {
        return { responseCode: '01', message: 'Listing not found' };
      }

      // Load images
      const images = await this.dataSource.query(
        `SELECT image_id, image_url, is_cover, sort_order
         FROM listing_images WHERE listing_id = ? ORDER BY sort_order`,
        [id],
      );

      // Load land details (if any)
      const [landDetail] = await this.dataSource.query(
        `SELECT * FROM land_details WHERE listing_id = ?`,
        [id],
      );

      return {
        responseCode: '00',
        data: { ...listing, images, land_detail: landDetail || null },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // GET MY LISTINGS (current user)
  // ==========================================
  async getMyListings(userId: number, query: ListingQueryDto): Promise<any> {
    try {
      const { page = 1, limit = 12, status } = query;
      const offset = (Number(page) - 1) * Number(limit);

      const conditions = ['l.user_id = ?'];
      const params: any[] = [userId];
      if (status) { conditions.push('l.status = ?'); params.push(status); }

      const where = conditions.join(' AND ');

      const [countRow] = await this.dataSource.query(
        `SELECT COUNT(*) AS total FROM listings l WHERE ${where}`, params,
      );
      const total = Number(countRow.total);

      const data = await this.dataSource.query(
        `SELECT
           l.listing_id, l.title, l.price, l.currency,
           l.area, l.area_unit, l.listing_type, l.status,
           l.is_featured, l.views_count, l.negotiable,
           l.contact_phone, l.contact_name,
           l.created_date, l.expires_at, l.reject_reason,
           c.name AS category,
           p.province_name AS province,
           d.district_name AS district,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1
            LIMIT 1) AS cover_image,
           CASE WHEN f.favorite_id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite
         FROM listings l
         JOIN categories c ON c.category_id = l.category_id
         LEFT JOIN provinces p ON p.province_id = l.province_id
         LEFT JOIN districts d ON d.district_id = l.district_id
         LEFT JOIN favorites f ON f.listing_id = l.listing_id AND f.user_id = ${userId}
         WHERE ${where}
         ORDER BY l.created_date DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset],
      );

      return {
        responseCode: '00',
        data,
        meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // CREATE LISTING
  // ==========================================
  async create(dto: CreateListingDto, userId: number): Promise<any> {
    try {
      // Validate category exists
      const [cat] = await this.dataSource.query(
        `SELECT category_id FROM categories WHERE category_id = ? AND is_active = 1`,
        [dto.category_id],
      );
      if (!cat) return { responseCode: '01', message: 'Category not found or inactive' };

      const result = await this.dataSource.query(
        `INSERT INTO listings
           (user_id, category_id, title, title_en, description,
            price, currency, price_per_unit, negotiable,
            area, area_unit,
            province_id, district_id, village_id,
            address_detail, latitude, longitude, map_url,
            listing_type, status,
            contact_name, contact_phone, contact_email,
            contact_line, contact_whatsapp, expires_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          userId,
          dto.category_id,
          dto.title,
          dto.title_en || null,
          dto.description || null,
          dto.price,
          dto.currency || 'LAK',
          dto.price_per_unit || null,
          dto.negotiable ?? 1,
          dto.area || null,
          dto.area_unit || 'sqm',
          dto.province_id || null,
          dto.district_id || null,
          dto.village_id || null,
          dto.address_detail || null,
          dto.latitude || null,
          dto.longitude || null,
          dto.map_url || null,
          dto.listing_type || 'sale',
          'pending',                        // always pending on create
          dto.contact_name || null,
          dto.contact_phone || null,
          dto.contact_email || null,
          dto.contact_line || null,
          dto.contact_whatsapp || null,
          dto.expires_at || null,
        ],
      );

      return {
        responseCode: '00',
        message: 'Listing created successfully — pending admin approval',
        data: { listing_id: result.insertId },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // UPDATE LISTING
  // ==========================================
  async update(id: number, dto: UpdateListingDto, userId: number, userRole: string): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT user_id, status FROM listings WHERE listing_id = ?`, [id],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };

      // Only owner or Admin/Manager can edit
      if (listing.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      // Build dynamic SET clause
      const fields: string[] = [];
      const params: any[] = [];

      const setField = (col: string, val: any) => {
        if (val !== undefined) { fields.push(`${col} = ?`); params.push(val); }
      };

      setField('category_id',      dto.category_id);
      setField('title',            dto.title);
      setField('title_en',         dto.title_en);
      setField('description',      dto.description);
      setField('price',            dto.price);
      setField('currency',         dto.currency);
      setField('price_per_unit',   dto.price_per_unit);
      setField('negotiable',       dto.negotiable);
      setField('area',             dto.area);
      setField('area_unit',        dto.area_unit);
      setField('province_id',      dto.province_id);
      setField('district_id',      dto.district_id);
      setField('village_id',       dto.village_id);
      setField('address_detail',   dto.address_detail);
      setField('latitude',         dto.latitude);
      setField('longitude',        dto.longitude);
      setField('map_url',          dto.map_url);
      setField('listing_type',     dto.listing_type);
      setField('contact_name',     dto.contact_name);
      setField('contact_phone',    dto.contact_phone);
      setField('contact_email',    dto.contact_email);
      setField('contact_line',     dto.contact_line);
      setField('contact_whatsapp', dto.contact_whatsapp);
      setField('expires_at',       dto.expires_at);

      // Admin/Manager only fields
      if (['Admin', 'Manager'].includes(userRole)) {
        setField('status',        dto.status);
        setField('reject_reason', dto.reject_reason);
        setField('is_featured',   dto.is_featured);
      }

      if (fields.length === 0) return { responseCode: '02', message: 'No fields to update' };

      params.push(id);
      await this.dataSource.query(
        `UPDATE listings SET ${fields.join(', ')} WHERE listing_id = ?`, params,
      );

      return { responseCode: '00', message: 'Listing updated successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // DELETE LISTING
  // ==========================================
  async remove(id: number, userId: number, userRole: string): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT user_id FROM listings WHERE listing_id = ?`, [id],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };

      if (listing.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      await this.dataSource.query(`DELETE FROM listings WHERE listing_id = ?`, [id]);
      return { responseCode: '00', message: 'Listing deleted successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // APPROVE / REJECT (Admin/Manager)
  // ==========================================
  async approve(id: number): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE listings SET status = 'active', reject_reason = NULL WHERE listing_id = ?`, [id],
      );
      return { responseCode: '00', message: 'Listing approved and now active' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  async reject(id: number, reason: string): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE listings SET status = 'rejected', reject_reason = ? WHERE listing_id = ?`,
        [reason, id],
      );
      return { responseCode: '00', message: 'Listing rejected' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // IMAGES — Upload
  // ==========================================
  async addImages(
    listingId: number,
    files: Express.Multer.File[],
    userId: number,
    userRole: string,
    appUrl: string,
  ): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT user_id FROM listings WHERE listing_id = ?`, [listingId],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };
      if (listing.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      // Count existing images
      const [countRow] = await this.dataSource.query(
        `SELECT COUNT(*) AS cnt FROM listing_images WHERE listing_id = ?`, [listingId],
      );
      const existing = Number(countRow.cnt);

      if (existing + files.length > 10) {
        return { responseCode: '02', message: `Max 10 images per listing (currently ${existing})` };
      }

      const inserted: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const imageUrl = `${appUrl}/uploads/listings/${files[i].filename}`;
        const isCover = existing === 0 && i === 0 ? 1 : 0;

        const result = await this.dataSource.query(
          `INSERT INTO listing_images (listing_id, image_url, is_cover, sort_order)
           VALUES (?, ?, ?, ?)`,
          [listingId, imageUrl, isCover, existing + i],
        );
        inserted.push({ image_id: result.insertId, image_url: imageUrl, is_cover: isCover });
      }

      return { responseCode: '00', message: `${files.length} image(s) uploaded`, data: inserted };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // IMAGES — Delete
  // ==========================================
  async deleteImage(imageId: number, userId: number, userRole: string): Promise<any> {
    try {
      const [image] = await this.dataSource.query(
        `SELECT li.image_id, l.user_id
         FROM listing_images li
         JOIN listings l ON l.listing_id = li.listing_id
         WHERE li.image_id = ?`,
        [imageId],
      );
      if (!image) return { responseCode: '01', message: 'Image not found' };
      if (image.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      await this.dataSource.query(`DELETE FROM listing_images WHERE image_id = ?`, [imageId]);
      return { responseCode: '00', message: 'Image deleted' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // IMAGES — Set Cover
  // ==========================================
  async setCover(imageId: number, userId: number, userRole: string): Promise<any> {
    try {
      const [image] = await this.dataSource.query(
        `SELECT li.image_id, li.listing_id, l.user_id
         FROM listing_images li
         JOIN listings l ON l.listing_id = li.listing_id
         WHERE li.image_id = ?`,
        [imageId],
      );
      if (!image) return { responseCode: '01', message: 'Image not found' };
      if (image.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      // Reset all covers for this listing then set new one
      await this.dataSource.query(
        `UPDATE listing_images SET is_cover = 0 WHERE listing_id = ?`, [image.listing_id],
      );
      await this.dataSource.query(
        `UPDATE listing_images SET is_cover = 1 WHERE image_id = ?`, [imageId],
      );
      return { responseCode: '00', message: 'Cover image updated' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // LAND DETAILS — Save / Update
  // ==========================================
  async saveLandDetail(listingId: number, dto: LandDetailDto, userId: number, userRole: string): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT user_id FROM listings WHERE listing_id = ?`, [listingId],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };
      if (listing.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      // UPSERT
      await this.dataSource.query(
        `INSERT INTO land_details
           (listing_id, title_deed_type, width_meter, depth_meter,
            road_access, road_width_meter, electricity, water_supply, zoning, shape)
         VALUES (?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE
           title_deed_type  = VALUES(title_deed_type),
           width_meter      = VALUES(width_meter),
           depth_meter      = VALUES(depth_meter),
           road_access      = VALUES(road_access),
           road_width_meter = VALUES(road_width_meter),
           electricity      = VALUES(electricity),
           water_supply     = VALUES(water_supply),
           zoning           = VALUES(zoning),
           shape            = VALUES(shape)`,
        [
          listingId,
          dto.title_deed_type || null,
          dto.width_meter || null,
          dto.depth_meter || null,
          dto.road_access ?? 0,
          dto.road_width_meter || null,
          dto.electricity ?? 0,
          dto.water_supply ?? 0,
          dto.zoning || null,
          dto.shape || null,
        ],
      );

      return { responseCode: '00', message: 'Land details saved' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // FAVORITES — Toggle (add/remove)
  // ==========================================
  async toggleFavorite(listingId: number, userId: number): Promise<any> {
    try {
      const [existing] = await this.dataSource.query(
        `SELECT favorite_id FROM favorites WHERE user_id = ? AND listing_id = ?`,
        [userId, listingId],
      );

      if (existing) {
        await this.dataSource.query(
          `DELETE FROM favorites WHERE favorite_id = ?`, [existing.favorite_id],
        );
        return { responseCode: '00', message: 'Removed from favorites', is_favorite: false };
      } else {
        await this.dataSource.query(
          `INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)`, [userId, listingId],
        );
        return { responseCode: '00', message: 'Added to favorites', is_favorite: true };
      }
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // FAVORITES — Get My Favorites
  // ==========================================
  async getMyFavorites(userId: number): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT
           l.listing_id, l.title, l.price, l.currency,
           l.area, l.area_unit, l.listing_type, l.status,
           c.name AS category,
           p.province_name AS province,
           f.created_date AS saved_at,
           (SELECT image_url FROM listing_images li
            WHERE li.listing_id = l.listing_id AND li.is_cover = 1
            LIMIT 1) AS cover_image
         FROM favorites f
         JOIN listings   l ON l.listing_id  = f.listing_id
         JOIN categories c ON c.category_id = l.category_id
         LEFT JOIN provinces p ON p.province_id = l.province_id
         WHERE f.user_id = ?
         ORDER BY f.created_date DESC`,
        [userId],
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // INQUIRIES — Send message
  // ==========================================
  async createInquiry(dto: CreateInquiryDto, userId?: number): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT listing_id FROM listings WHERE listing_id = ? AND status = 'active'`,
        [dto.listing_id],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found or not active' };

      await this.dataSource.query(
        `INSERT INTO inquiries
           (listing_id, sender_id, sender_name, sender_phone, sender_email, message)
         VALUES (?,?,?,?,?,?)`,
        [
          dto.listing_id,
          userId || null,
          dto.sender_name || null,
          dto.sender_phone || null,
          dto.sender_email || null,
          dto.message,
        ],
      );
      return { responseCode: '00', message: 'Inquiry sent successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // INQUIRIES — Get for a listing (owner/admin)
  // ==========================================
  async getInquiries(listingId: number, userId: number, userRole: string): Promise<any> {
    try {
      const [listing] = await this.dataSource.query(
        `SELECT user_id FROM listings WHERE listing_id = ?`, [listingId],
      );
      if (!listing) return { responseCode: '01', message: 'Listing not found' };
      if (listing.user_id !== userId && !['Admin', 'Manager'].includes(userRole)) {
        return { responseCode: '03', message: 'Permission denied' };
      }

      const data = await this.dataSource.query(
        `SELECT i.*, u.full_name AS user_name, u.avatar_url
         FROM inquiries i
         LEFT JOIN users u ON u.user_id = i.sender_id
         WHERE i.listing_id = ?
         ORDER BY i.created_date DESC`,
        [listingId],
      );

      // Mark as read
      await this.dataSource.query(
        `UPDATE inquiries SET is_read = 1 WHERE listing_id = ?`, [listingId],
      );

      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // CATEGORIES & LOCATION DROPDOWNS
  // ==========================================
  async getCategories(): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT category_id, name, name_en, icon
         FROM categories WHERE is_active = 1 ORDER BY sort_order`,
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  async getProvinces(): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT province_id, province_name, province_code FROM provinces ORDER BY province_id`,
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  async getDistricts(provinceId: number): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT district_id, district_name FROM districts
         WHERE province_id = ? ORDER BY district_id`,
        [provinceId],
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  async getVillages(districtId: number): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT village_id, village_name FROM villages
         WHERE district_id = ? ORDER BY village_id`,
        [districtId],
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // PACKAGES
  // ==========================================
  async getPackages(): Promise<any> {
    try {
      const data = await this.dataSource.query(
        `SELECT * FROM packages WHERE is_active = 1 ORDER BY price`,
      );
      return { responseCode: '00', data };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}