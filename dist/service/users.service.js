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
exports.usersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
let usersService = class usersService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async find(userstdto) {
        const { userId, password } = userstdto;
        console.log('[LOGIN] attempt:', { userId });
        try {
            if (!userId || !password)
                return { responseCode: '01', message: 'userId and password are required' };
            const result = await this.dataSource.query(`SELECT u.*, b.branch_name, b.branch_code, c.counter_name, c.counter_code
         FROM users u
         LEFT JOIN branches b ON u.branch_id = b.branch_id
         LEFT JOIN counters c ON u.counter_id = c.counter_id
         WHERE u.phone_number = ?`, [userId]);
            console.log('[LOGIN] query result count:', result?.length);
            if (!result || result.length === 0)
                return { responseCode: '01', message: 'User not found' };
            const user = result[0];
            console.log('[LOGIN] user found:', { user_id: user.user_id, role: user.role, is_active: user.is_active });
            if (!user.is_active)
                return { responseCode: '03', message: 'Account is inactive' };
            if (user.account_locked)
                return { responseCode: '04', message: 'Account is locked' };
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            console.log('[LOGIN] password valid:', isPasswordValid);
            if (!isPasswordValid) {
                await this.dataSource.query(`UPDATE users SET failed_login_attempts = failed_login_attempts + 1,
             account_locked = IF(failed_login_attempts >= 4, 1, 0)
           WHERE user_id = ?`, [user.user_id]);
                return { responseCode: '02', message: 'Invalid password' };
            }
            await this.dataSource.query(`UPDATE users SET failed_login_attempts = 0, last_login = NOW()
         WHERE user_id = ?`, [user.user_id]);
            console.log('[LOGIN] success for user:', user.user_id);
            return { responseCode: '00', data: user };
        }
        catch (error) {
            console.error('[LOGIN] error:', error.message);
            return { responseCode: '99', message: error.message };
        }
    }
    async getAll() {
        try {
            const result = await this.dataSource.query(`SELECT u.user_id, u.username, u.full_name, u.email, u.phone_number,
                u.department, u.role, u.is_active, u.account_locked,
                u.failed_login_attempts, u.last_login, u.created_date, u.created_by,
                u.branch_id, b.branch_name, b.branch_code,
                u.counter_id, c.counter_name, c.counter_code
         FROM users u
         LEFT JOIN branches b ON u.branch_id = b.branch_id
         LEFT JOIN counters c ON u.counter_id = c.counter_id
         ORDER BY u.user_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async create(body) {
        try {
            const existingPhone = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [body.phone_number]);
            if (existingPhone.length > 0)
                return { responseCode: '01', message: 'Phone number already exists' };
            const existingUser = await this.dataSource.query(`SELECT user_id FROM users WHERE username = ?`, [body.username]);
            if (existingUser.length > 0)
                return { responseCode: '02', message: 'Username already exists' };
            if (body.branch_id) {
                const branch = await this.dataSource.query(`SELECT branch_id FROM branches WHERE branch_id = ? AND is_active = 1`, [body.branch_id]);
                if (branch.length === 0)
                    return { responseCode: '03', message: 'Branch not found or inactive' };
            }
            if (body.counter_id) {
                const counter = await this.dataSource.query(`SELECT counter_id FROM counters WHERE counter_id = ? AND branch_id = ? AND is_active = 1`, [body.counter_id, body.branch_id]);
                if (counter.length === 0)
                    return { responseCode: '04', message: 'Counter not found or does not belong to branch' };
            }
            const hash = await bcrypt.hash(body.password || 'sbland123', 10);
            await this.dataSource.query(`INSERT INTO users (username, full_name, email, phone_number, password_hash,
                            department, role, is_active, created_by, branch_id, counter_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [body.username, body.full_name, body.email || null, body.phone_number, hash,
                body.department || null, body.role || 'Customer', body.is_active ?? 1,
                body.created_by || 'admin', body.branch_id || null, body.counter_id || null]);
            return { responseCode: '00', message: 'User created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async update(id, body) {
        try {
            if (body.branch_id) {
                const branch = await this.dataSource.query(`SELECT branch_id FROM branches WHERE branch_id = ? AND is_active = 1`, [body.branch_id]);
                if (branch.length === 0)
                    return { responseCode: '03', message: 'Branch not found or inactive' };
            }
            if (body.counter_id) {
                const counter = await this.dataSource.query(`SELECT counter_id FROM counters WHERE counter_id = ? AND branch_id = ? AND is_active = 1`, [body.counter_id, body.branch_id]);
                if (counter.length === 0)
                    return { responseCode: '04', message: 'Counter not found or does not belong to branch' };
            }
            let query = `UPDATE users SET full_name = ?, email = ?, phone_number = ?,
                    role = ?, department = ?, is_active = ?,
                    branch_id = ?, counter_id = ?`;
            const params = [
                body.full_name, body.email, body.phone_number, body.role,
                body.department, body.is_active, body.branch_id || null, body.counter_id || null
            ];
            if (body.password) {
                query += `, password_hash = ?`;
                params.push(await bcrypt.hash(body.password, 10));
            }
            query += ` WHERE user_id = ?`;
            params.push(id);
            await this.dataSource.query(query, params);
            return { responseCode: '00', message: 'User updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async remove(id) {
        try {
            await this.dataSource.query(`DELETE FROM users WHERE user_id = ?`, [id]);
            return { responseCode: '00', message: 'User deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async unlock(id) {
        try {
            await this.dataSource.query(`UPDATE users SET account_locked = 0, failed_login_attempts = 0
         WHERE user_id = ?`, [id]);
            return { responseCode: '00', message: 'User unlocked successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getBranches() {
        try {
            const result = await this.dataSource.query(`SELECT branch_id, branch_code, branch_name
         FROM branches WHERE is_active = 1 ORDER BY branch_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getCountersByBranch(branchId) {
        try {
            const result = await this.dataSource.query(`SELECT counter_id, counter_code, counter_name
         FROM counters WHERE branch_id = ? AND is_active = 1 ORDER BY counter_id`, [branchId]);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getRoles() {
        try {
            const result = await this.dataSource.query(`SELECT role_id, role_name, role_description, is_active,
                created_by, created_date, last_modified_by
         FROM roles ORDER BY role_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async createRole(body) {
        try {
            const existing = await this.dataSource.query(`SELECT role_id FROM roles WHERE role_name = ?`, [body.role_name]);
            if (existing.length > 0)
                return { responseCode: '01', message: 'Role name already exists' };
            await this.dataSource.query(`INSERT INTO roles (role_name, role_description, is_active, created_by)
         VALUES (?, ?, ?, ?)`, [body.role_name, body.role_description || null,
                body.is_active ?? 1, body.created_by || 'admin']);
            return { responseCode: '00', message: 'Role created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateRole(id, body) {
        try {
            await this.dataSource.query(`UPDATE roles SET role_name = ?, role_description = ?,
         is_active = ?, last_modified_by = ? WHERE role_id = ?`, [body.role_name, body.role_description || null,
                body.is_active ?? 1, body.modified_by || 'admin', id]);
            return { responseCode: '00', message: 'Role updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteRole(id) {
        try {
            const inUse = await this.dataSource.query(`SELECT COUNT(*) as cnt FROM users WHERE role =
         (SELECT role_name FROM roles WHERE role_id = ?)`, [id]);
            if (inUse[0].cnt > 0)
                return { responseCode: '01',
                    message: `ບໍ່ສາມາດລຶບໄດ້ — ມີ ${inUse[0].cnt} users ໃຊ້ role ນີ້` };
            await this.dataSource.query(`DELETE FROM roles WHERE role_id = ?`, [id]);
            return { responseCode: '00', message: 'Role deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getMenus() {
        try {
            const result = await this.dataSource.query(`SELECT m.*, p.menu_name as parent_name
         FROM menus m
         LEFT JOIN menus p ON m.parent_menu_id = p.menu_id
         ORDER BY m.menu_order, m.menu_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async createMenu(body) {
        try {
            await this.dataSource.query(`INSERT INTO menus (menu_name, menu_icon, menu_path,
                            parent_menu_id, menu_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`, [body.menu_name, body.menu_icon || null, body.menu_path || null,
                body.parent_menu_id || null, body.menu_order || 99, body.is_active ?? 1]);
            return { responseCode: '00', message: 'Menu created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateMenu(id, body) {
        try {
            await this.dataSource.query(`UPDATE menus SET menu_name = ?, menu_icon = ?, menu_path = ?,
         parent_menu_id = ?, menu_order = ?, is_active = ? WHERE menu_id = ?`, [body.menu_name, body.menu_icon || null, body.menu_path || null,
                body.parent_menu_id || null, body.menu_order || 99, body.is_active ?? 1, id]);
            return { responseCode: '00', message: 'Menu updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteMenu(id) {
        try {
            const children = await this.dataSource.query(`SELECT COUNT(*) as cnt FROM menus WHERE parent_menu_id = ?`, [id]);
            if (children[0].cnt > 0)
                return { responseCode: '01',
                    message: `ບໍ່ສາມາດລຶບໄດ້ — ມີ ${children[0].cnt} sub-menus` };
            await this.dataSource.query(`DELETE FROM role_menu_mapping WHERE menu_id = ?`, [id]);
            await this.dataSource.query(`DELETE FROM menus WHERE menu_id = ?`, [id]);
            return { responseCode: '00', message: 'Menu deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getRoleMap() {
        try {
            const roles = await this.dataSource.query(`SELECT role_id, role_name FROM roles WHERE is_active = 1 ORDER BY role_id`);
            const menus = await this.dataSource.query(`SELECT menu_id, menu_name, menu_icon, parent_menu_id, menu_order
         FROM menus WHERE is_active = 1 ORDER BY menu_order, menu_id`);
            const mapping = await this.dataSource.query(`SELECT mapping_id, role_id, menu_id,
                can_view, can_create, can_edit, can_delete
         FROM role_menu_mapping`);
            return { responseCode: '00', data: { roles, menus, mapping } };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateRoleMap(body) {
        try {
            for (const m of body.mappings) {
                const existing = await this.dataSource.query(`SELECT mapping_id FROM role_menu_mapping
           WHERE role_id = ? AND menu_id = ?`, [m.role_id, m.menu_id]);
                if (m.can_view === 0 && m.can_create === 0 &&
                    m.can_edit === 0 && m.can_delete === 0) {
                    if (existing.length > 0)
                        await this.dataSource.query(`DELETE FROM role_menu_mapping WHERE mapping_id = ?`, [existing[0].mapping_id]);
                }
                else if (existing.length > 0) {
                    await this.dataSource.query(`UPDATE role_menu_mapping
             SET can_view = ?, can_create = ?, can_edit = ?, can_delete = ?
             WHERE mapping_id = ?`, [m.can_view, m.can_create, m.can_edit, m.can_delete,
                        existing[0].mapping_id]);
                }
                else {
                    await this.dataSource.query(`INSERT INTO role_menu_mapping
             (role_id, menu_id, can_view, can_create, can_edit, can_delete, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [m.role_id, m.menu_id, m.can_view, m.can_create,
                        m.can_edit, m.can_delete, 'admin']);
                }
            }
            return { responseCode: '00', message: 'Role map updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getCategories() {
        try {
            const result = await this.dataSource.query(`SELECT category_id, name, name_en, icon, sort_order, is_active, created_date
         FROM categories ORDER BY sort_order, category_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async createCategory(body) {
        try {
            const existing = await this.dataSource.query(`SELECT category_id FROM categories WHERE name = ? OR name_en = ?`, [body.name, body.name_en]);
            if (existing.length > 0)
                return { responseCode: '01', message: 'Category already exists' };
            await this.dataSource.query(`INSERT INTO categories (name, name_en, icon, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?)`, [body.name, body.name_en || null, body.icon || null,
                body.sort_order || 99, body.is_active ?? 1]);
            return { responseCode: '00', message: 'Category created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateCategory(id, body) {
        try {
            await this.dataSource.query(`UPDATE categories SET name = ?, name_en = ?, icon = ?,
         sort_order = ?, is_active = ? WHERE category_id = ?`, [body.name, body.name_en || null, body.icon || null,
                body.sort_order || 99, body.is_active ?? 1, id]);
            return { responseCode: '00', message: 'Category updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteCategory(id) {
        try {
            const inUse = await this.dataSource.query(`SELECT COUNT(*) as cnt FROM listings WHERE category_id = ?`, [id]);
            if (inUse[0].cnt > 0)
                return { responseCode: '01',
                    message: `ບໍ່ສາມາດລຶບໄດ້ — ມີ ${inUse[0].cnt} listings ໃຊ້ category ນີ້` };
            await this.dataSource.query(`DELETE FROM categories WHERE category_id = ?`, [id]);
            return { responseCode: '00', message: 'Category deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getProvinces() {
        try {
            const result = await this.dataSource.query(`SELECT province_id, province_name, province_code
         FROM provinces ORDER BY province_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async createProvince(body) {
        try {
            const existing = await this.dataSource.query(`SELECT province_id FROM provinces WHERE province_code = ?`, [body.province_code]);
            if (existing.length > 0)
                return { responseCode: '01', message: 'Province code already exists' };
            await this.dataSource.query(`INSERT INTO provinces (province_name, province_code) VALUES (?, ?)`, [body.province_name, body.province_code]);
            return { responseCode: '00', message: 'Province created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateProvince(id, body) {
        try {
            await this.dataSource.query(`UPDATE provinces SET province_name = ?, province_code = ?
         WHERE province_id = ?`, [body.province_name, body.province_code, id]);
            return { responseCode: '00', message: 'Province updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteProvince(id) {
        try {
            const inUse = await this.dataSource.query(`SELECT COUNT(*) as cnt FROM listings WHERE province_id = ?`, [id]);
            if (inUse[0].cnt > 0)
                return { responseCode: '01',
                    message: `ບໍ່ສາມາດລຶບໄດ້ — ມີ ${inUse[0].cnt} listings ໃຊ້ province ນີ້` };
            await this.dataSource.query(`DELETE FROM provinces WHERE province_id = ?`, [id]);
            return { responseCode: '00', message: 'Province deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getDistricts(provinceId) {
        try {
            const query = provinceId
                ? `SELECT d.district_id, d.province_id, d.district_name, p.province_name
           FROM districts d JOIN provinces p ON d.province_id = p.province_id
           WHERE d.province_id = ? ORDER BY d.district_id`
                : `SELECT d.district_id, d.province_id, d.district_name, p.province_name
           FROM districts d JOIN provinces p ON d.province_id = p.province_id
           ORDER BY d.province_id, d.district_id`;
            const result = await this.dataSource.query(query, provinceId ? [provinceId] : []);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async createDistrict(body) {
        try {
            await this.dataSource.query(`INSERT INTO districts (province_id, district_name) VALUES (?, ?)`, [body.province_id, body.district_name]);
            return { responseCode: '00', message: 'District created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateDistrict(id, body) {
        try {
            await this.dataSource.query(`UPDATE districts SET province_id = ?, district_name = ?
         WHERE district_id = ?`, [body.province_id, body.district_name, id]);
            return { responseCode: '00', message: 'District updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async deleteDistrict(id) {
        try {
            const inUse = await this.dataSource.query(`SELECT COUNT(*) as cnt FROM listings WHERE district_id = ?`, [id]);
            if (inUse[0].cnt > 0)
                return { responseCode: '01',
                    message: `ບໍ່ສາມາດລຶບໄດ້ — ມີ ${inUse[0].cnt} listings ໃຊ້ district ນີ້` };
            await this.dataSource.query(`DELETE FROM districts WHERE district_id = ?`, [id]);
            return { responseCode: '00', message: 'District deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getDashboardStats() {
        try {
            const listingStats = await this.dataSource.query(`
        SELECT COUNT(*) AS total_listings,
          SUM(status = 'active')   AS active_listings,
          SUM(status = 'pending')  AS pending_listings,
          SUM(status = 'rejected') AS rejected_listings,
          SUM(status = 'expired')  AS expired_listings,
          SUM(is_featured = 1 AND status = 'active') AS featured_listings
        FROM listings`);
            const userStats = await this.dataSource.query(`
        SELECT COUNT(*) AS total_users,
          SUM(is_active = 1) AS active_users,
          SUM(role = 'Agent') AS agents,
          SUM(role = 'Customer') AS customers,
          SUM(DATE(created_date) = CURDATE()) AS new_today
        FROM users`);
            const inquiryStats = await this.dataSource.query(`
        SELECT COUNT(*) AS total_inquiries, SUM(is_read = 0) AS unread_inquiries
        FROM inquiries`);
            const byCategory = await this.dataSource.query(`
        SELECT c.name, c.icon, COUNT(l.listing_id) AS count
        FROM categories c
        LEFT JOIN listings l ON l.category_id = c.category_id AND l.status = 'active'
        GROUP BY c.category_id, c.name, c.icon ORDER BY count DESC`);
            const byProvince = await this.dataSource.query(`
        SELECT p.province_name, COUNT(l.listing_id) AS count
        FROM provinces p
        LEFT JOIN listings l ON l.province_id = p.province_id AND l.status = 'active'
        GROUP BY p.province_id, p.province_name ORDER BY count DESC LIMIT 5`);
            const recentActivity = await this.dataSource.query(`
        SELECT DATE(created_date) AS date, COUNT(*) AS count
        FROM listings
        WHERE created_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_date) ORDER BY date ASC`);
            const recentPending = await this.dataSource.query(`
        SELECT l.listing_id, l.title, l.listing_type, l.price, l.currency,
               l.created_date, c.name AS category, u.full_name AS seller_name,
               (SELECT image_url FROM listing_images li
                WHERE li.listing_id = l.listing_id AND li.is_cover = 1 LIMIT 1) AS cover_image
        FROM listings l
        JOIN categories c ON c.category_id = l.category_id
        JOIN users u ON u.user_id = l.user_id
        WHERE l.status = 'pending' ORDER BY l.created_date DESC LIMIT 5`);
            return {
                responseCode: '00',
                data: {
                    listings: listingStats[0], users: userStats[0],
                    inquiries: inquiryStats[0], by_category: byCategory,
                    by_province: byProvince, recent_activity: recentActivity,
                    recent_pending: recentPending,
                },
            };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    _genOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async requestOtp(phone, type = 'register') {
        try {
            if (type === 'register') {
                const existing = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone]);
                if (existing.length > 0)
                    return { responseCode: '01', message: 'ເບີນີ້ລົງທະບຽນແລ້ວ' };
            }
            if (type === 'forgot_password') {
                const existing = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone]);
                if (existing.length === 0)
                    return { responseCode: '01', message: 'ບໍ່ພົບເບີນີ້ໃນລະບົບ' };
            }
            await this.dataSource.query(`UPDATE user_otp SET is_used = 1
         WHERE phone_number = ? AND otp_type = ? AND is_used = 0`, [phone, type]);
            const otp = this._genOtp();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            await this.dataSource.query(`INSERT INTO user_otp (phone_number, otp_code, otp_type, expires_at)
         VALUES (?, ?, ?, ?)`, [phone, otp, type, expiresAt]);
            console.log(`[OTP] ${phone} → ${otp} (${type})`);
            return { responseCode: '00', message: 'OTP ສົ່ງສຳເລັດ' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async verifyOtp(phone, code, type = 'register') {
        try {
            const [otp] = await this.dataSource.query(`SELECT * FROM user_otp
         WHERE phone_number = ? AND otp_type = ?
           AND is_used = 0 AND is_verified = 0
         ORDER BY created_at DESC LIMIT 1`, [phone, type]);
            if (!otp)
                return { responseCode: '01', message: 'ບໍ່ພົບ OTP — ກົດຂໍ OTP ໃໝ່' };
            if (otp.attempt_count >= 5) {
                await this.dataSource.query(`UPDATE user_otp SET is_used = 1 WHERE otp_id = ?`, [otp.otp_id]);
                return { responseCode: '02', message: 'OTP ໝົດຈຳນວນທົດລອງ — ກົດຂໍ OTP ໃໝ່' };
            }
            if (new Date() > new Date(otp.expires_at)) {
                await this.dataSource.query(`UPDATE user_otp SET is_used = 1 WHERE otp_id = ?`, [otp.otp_id]);
                return { responseCode: '03', message: 'OTP ໝົດອາຍຸ — ກົດຂໍ OTP ໃໝ່' };
            }
            await this.dataSource.query(`UPDATE user_otp SET attempt_count = attempt_count + 1 WHERE otp_id = ?`, [otp.otp_id]);
            if (otp.otp_code !== code)
                return { responseCode: '04',
                    message: `OTP ບໍ່ຖືກຕ້ອງ (ເຫຼືອ ${4 - otp.attempt_count} ຄັ້ງ)` };
            await this.dataSource.query(`UPDATE user_otp SET is_verified = 1, is_used = 1, verified_at = NOW()
         WHERE otp_id = ?`, [otp.otp_id]);
            return { responseCode: '00', message: 'OTP ຖືກຕ້ອງ', verified: true };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async registerWithOtp(body) {
        try {
            const { phone_number, password, full_name } = body;
            const [otp] = await this.dataSource.query(`SELECT * FROM user_otp
         WHERE phone_number = ? AND otp_type = 'register'
           AND is_verified = 1
           AND verified_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
         ORDER BY verified_at DESC LIMIT 1`, [phone_number]);
            if (!otp)
                return { responseCode: '01', message: 'ກະລຸນາຢືນຢັນ OTP ກ່ອນ' };
            const [existing] = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone_number]);
            if (existing)
                return { responseCode: '02', message: 'ເບີນີ້ລົງທະບຽນແລ້ວ' };
            const hashed = await bcrypt.hash(password, 10);
            const result = await this.dataSource.query(`INSERT INTO users
           (username, phone_number, password_hash, full_name, role, is_active, created_by)
         VALUES (?, ?, ?, ?, 'Customer', 1, 'self-register')`, [phone_number, phone_number, hashed, full_name || '']);
            return { responseCode: '00', message: 'ລົງທະບຽນສຳເລັດ',
                data: { user_id: result.insertId } };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async register(dto) {
        try {
            const { phone_number, full_name, password } = dto;
            if (!phone_number || !full_name || !password)
                return { responseCode: '01', message: 'phone_number, full_name and password are required' };
            const existingPhone = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone_number]);
            if (existingPhone.length > 0)
                return { responseCode: '02', message: 'ເບີໂທລະສັບນີ້ຖືກໃຊ້ງານແລ້ວ' };
            const hash = await bcrypt.hash(password, 10);
            await this.dataSource.query(`INSERT INTO users (username, full_name, phone_number, password_hash,
                            role, is_active, created_by)
         VALUES (?, ?, ?, ?, 'Customer', 1, 'self-register')`, [phone_number, full_name, phone_number, hash]);
            return { responseCode: '00', message: 'ສະໝັກສຳເລັດ' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async adminResetPassword(userId, newPassword, resetByUserId) {
        const tag = `[RESET-PWD] user_id=${userId} by=${resetByUserId ?? 'unknown'}`;
        try {
            const [user] = await this.dataSource.query(`SELECT user_id, full_name, phone_number FROM users WHERE user_id = ?`, [userId]);
            if (!user) {
                console.warn(`${tag} ❌ FAILED — user not found`);
                return { responseCode: '01', message: 'ບໍ່ພົບ User' };
            }
            console.log(`${tag} target="${user.full_name}" (${user.phone_number})`);
            if (!newPassword || newPassword.length < 6) {
                console.warn(`${tag} ❌ FAILED — password too short`);
                return { responseCode: '02', message: 'ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 6 ຕົວ' };
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            console.log(`${tag} password hashed OK`);
            const result = await this.dataSource.query(`UPDATE users SET password_hash = ?,
           account_locked = 0, failed_login_attempts = 0
         WHERE user_id = ?`, [hashed, userId]);
            console.log(`${tag} DB updated affectedRows=${result.affectedRows}`);
            if (result.affectedRows === 0) {
                console.warn(`${tag} ❌ FAILED — affectedRows=0`);
                return { responseCode: '03', message: 'ອັບເດດລົ້ມເຫລວ' };
            }
            console.log(`${tag} ✅ SUCCESS`);
            return { responseCode: '00', message: 'Reset password ສຳເລັດ' };
        }
        catch (error) {
            console.error(`${tag} ❌ EXCEPTION —`, error.message);
            console.error(error.stack);
            return { responseCode: '99', message: error.message };
        }
    }
    async selfResetPassword(phone, newPassword) {
        const tag = `[SELF-RESET] phone=${phone}`;
        try {
            const [otp] = await this.dataSource.query(`SELECT * FROM user_otp
         WHERE phone_number = ? AND otp_type = 'forgot_password'
           AND is_verified = 1
           AND verified_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
         ORDER BY verified_at DESC LIMIT 1`, [phone]);
            if (!otp) {
                console.warn(`${tag} ❌ OTP not verified or expired`);
                return { responseCode: '01', message: 'ກະລຸນາຢືນຢັນ OTP ກ່ອນ' };
            }
            if (!newPassword || newPassword.length < 6)
                return { responseCode: '02', message: 'ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 6 ຕົວ' };
            const [user] = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone]);
            if (!user) {
                console.warn(`${tag} ❌ User not found`);
                return { responseCode: '03', message: 'ບໍ່ພົບຜູ້ໃຊ້' };
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            await this.dataSource.query(`UPDATE users SET password_hash = ?,
           account_locked = 0, failed_login_attempts = 0
         WHERE user_id = ?`, [hashed, user.user_id]);
            await this.dataSource.query(`UPDATE user_otp SET is_used = 1 WHERE otp_id = ?`, [otp.otp_id]);
            console.log(`${tag} ✅ SUCCESS user_id=${user.user_id}`);
            return { responseCode: '00', message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ' };
        }
        catch (error) {
            console.error(`${tag} ❌ EXCEPTION —`, error.message);
            return { responseCode: '99', message: error.message };
        }
    }
};
exports.usersService = usersService;
exports.usersService = usersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], usersService);
//# sourceMappingURL=users.service.js.map