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
const bcrypt = require("bcryptjs");
let usersService = class usersService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async find(userstdto) {
        const { userId, password } = userstdto;
        try {
            if (!userId || !password) {
                return { responseCode: '01', message: 'userId and password are required' };
            }
            const result = await this.dataSource.query(`SELECT u.*, b.branch_name, b.branch_code, c.counter_name, c.counter_code
         FROM users u
         LEFT JOIN branches b ON u.branch_id = b.branch_id
         LEFT JOIN counters c ON u.counter_id = c.counter_id
         WHERE u.phone_number = ?`, [userId]);
            if (!result || result.length === 0) {
                return { responseCode: '01', message: 'User not found' };
            }
            const user = result[0];
            if (!user.is_active) {
                return { responseCode: '03', message: 'Account is inactive' };
            }
            if (user.account_locked) {
                return { responseCode: '04', message: 'Account is locked' };
            }
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                await this.dataSource.query(`UPDATE users SET failed_login_attempts = failed_login_attempts + 1,
           account_locked = CASE WHEN failed_login_attempts >= 4 THEN 1 ELSE 0 END
           WHERE user_id = ?`, [user.user_id]);
                return { responseCode: '02', message: 'Invalid password' };
            }
            await this.dataSource.query(`UPDATE users SET failed_login_attempts = 0, last_login = NOW() WHERE user_id = ?`, [user.user_id]);
            const menus = await this.dataSource.query(`SELECT 
            m.menu_id, m.menu_name, m.menu_icon, m.menu_path,
            m.parent_menu_id, m.menu_order,
            rmm.can_view, rmm.can_create, rmm.can_edit, rmm.can_delete
         FROM roles r
         JOIN role_menu_mapping rmm ON r.role_id = rmm.role_id
         JOIN menus m ON rmm.menu_id = m.menu_id
         WHERE r.role_name = ? AND rmm.can_view = 1 AND m.is_active = 1
         ORDER BY m.menu_order, m.parent_menu_id, m.menu_id`, [user.role]);
            const { password_hash, ...userWithoutPassword } = user;
            return {
                responseCode: '00',
                message: 'Login successful',
                data: userWithoutPassword,
                menus: menus,
            };
        }
        catch (error) {
            console.error('Error during login', error);
            return { responseCode: '99', message: error.message };
        }
    }
    async getAll() {
        try {
            const result = await this.dataSource.query(`SELECT u.user_id, u.username, u.full_name, u.email, u.phone_number,
                u.department, u.role, u.is_active, u.account_locked,
                u.failed_login_attempts, u.last_login,
                u.created_date, u.created_by,
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
            if (existingPhone.length > 0) {
                return { responseCode: '01', message: 'Phone number already exists' };
            }
            const existingUser = await this.dataSource.query(`SELECT user_id FROM users WHERE username = ?`, [body.username]);
            if (existingUser.length > 0) {
                return { responseCode: '02', message: 'Username already exists' };
            }
            if (body.branch_id) {
                const branch = await this.dataSource.query(`SELECT branch_id FROM branches WHERE branch_id = ? AND is_active = 1`, [body.branch_id]);
                if (branch.length === 0) {
                    return { responseCode: '03', message: 'Branch not found or inactive' };
                }
            }
            if (body.counter_id) {
                const counter = await this.dataSource.query(`SELECT counter_id FROM counters WHERE counter_id = ? AND branch_id = ? AND is_active = 1`, [body.counter_id, body.branch_id]);
                if (counter.length === 0) {
                    return { responseCode: '04', message: 'Counter not found or does not belong to selected branch' };
                }
            }
            const hash = await bcrypt.hash(body.password || 'minimart123', 10);
            await this.dataSource.query(`INSERT INTO users (username, full_name, email, phone_number, password_hash,
                            department, role, is_active, created_by, branch_id, counter_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                body.username,
                body.full_name,
                body.email || null,
                body.phone_number,
                hash,
                body.department || null,
                body.role || 'Trainee',
                body.is_active ?? 1,
                body.created_by || 'admin',
                body.branch_id || null,
                body.counter_id || null,
            ]);
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
                if (branch.length === 0) {
                    return { responseCode: '03', message: 'Branch not found or inactive' };
                }
            }
            if (body.counter_id) {
                const counter = await this.dataSource.query(`SELECT counter_id FROM counters WHERE counter_id = ? AND branch_id = ? AND is_active = 1`, [body.counter_id, body.branch_id]);
                if (counter.length === 0) {
                    return { responseCode: '04', message: 'Counter not found or does not belong to selected branch' };
                }
            }
            let query = `UPDATE users SET full_name = ?, email = ?, phone_number = ?,
                    role = ?, department = ?, is_active = ?,
                    branch_id = ?, counter_id = ?`;
            const params = [
                body.full_name,
                body.email,
                body.phone_number,
                body.role,
                body.department,
                body.is_active,
                body.branch_id || null,
                body.counter_id || null,
            ];
            if (body.password) {
                const hash = await bcrypt.hash(body.password, 10);
                query += `, password_hash = ?`;
                params.push(hash);
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
            await this.dataSource.query(`UPDATE users SET account_locked = 0, failed_login_attempts = 0 WHERE user_id = ?`, [id]);
            return { responseCode: '00', message: 'User unlocked successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getBranches() {
        try {
            const result = await this.dataSource.query(`SELECT branch_id, branch_code, branch_name FROM branches WHERE is_active = 1 ORDER BY branch_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getCountersByBranch(branchId) {
        try {
            const result = await this.dataSource.query(`SELECT counter_id, counter_code, counter_name FROM counters 
         WHERE branch_id = ? AND is_active = 1 ORDER BY counter_id`, [branchId]);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async register(dto) {
        try {
            const { phone_number, full_name, password } = dto;
            if (!phone_number || !full_name || !password) {
                return { responseCode: '01', message: 'phone_number, full_name and password are required' };
            }
            const existingPhone = await this.dataSource.query(`SELECT user_id FROM users WHERE phone_number = ?`, [phone_number]);
            if (existingPhone.length > 0) {
                return { responseCode: '02', message: 'ເບີໂທລະສັບນີ້ຖືກໃຊ້ງານແລ້ວ' };
            }
            const hash = await bcrypt.hash(password, 10);
            await this.dataSource.query(`INSERT INTO users (username, full_name, phone_number, password_hash,
                          role, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                phone_number,
                full_name,
                phone_number,
                hash,
                'Customer',
                1,
                'self-register',
            ]);
            return { responseCode: '00', message: 'ສະໝັກສຳເລັດ' };
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
         VALUES (?, ?, ?, ?, ?, ?)`, [body.menu_name, body.menu_icon || null,
                body.menu_path || null,
                body.parent_menu_id || null,
                body.menu_order || 99,
                body.is_active ?? 1]);
            return { responseCode: '00', message: 'Menu created successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async updateMenu(id, body) {
        try {
            await this.dataSource.query(`UPDATE menus SET menu_name = ?, menu_icon = ?, menu_path = ?,
         parent_menu_id = ?, menu_order = ?, is_active = ?
         WHERE menu_id = ?`, [body.menu_name, body.menu_icon || null,
                body.menu_path || null,
                body.parent_menu_id || null,
                body.menu_order || 99,
                body.is_active ?? 1, id]);
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
                    if (existing.length > 0) {
                        await this.dataSource.query(`DELETE FROM role_menu_mapping WHERE mapping_id = ?`, [existing[0].mapping_id]);
                    }
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
};
exports.usersService = usersService;
exports.usersService = usersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], usersService);
//# sourceMappingURL=users.service.js.map