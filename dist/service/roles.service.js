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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let RolesService = class RolesService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getAll() {
        try {
            const result = await this.dataSource.query(`SELECT r.*, 
                (SELECT COUNT(*) FROM users u WHERE u.role = r.role_name) AS user_count
         FROM roles r 
         ORDER BY r.role_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async create(body) {
        try {
            const existing = await this.dataSource.query(`SELECT role_id FROM roles WHERE role_name = ?`, [body.role_name]);
            if (existing.length > 0) {
                return { responseCode: '01', message: 'Role name already exists' };
            }
            const result = await this.dataSource.query(`INSERT INTO roles (role_name, role_description, is_active, created_by)
         VALUES (?, ?, ?, ?)`, [
                body.role_name,
                body.role_description || null,
                body.is_active ?? 1,
                body.created_by || 'admin',
            ]);
            return {
                responseCode: '00',
                message: 'Role created successfully',
                data: { role_id: result.insertId },
            };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async update(id, body) {
        try {
            await this.dataSource.query(`UPDATE roles SET role_description = ?, is_active = ?, last_modified_by = ?
         WHERE role_id = ?`, [body.role_description, body.is_active, body.modified_by || 'admin', id]);
            return { responseCode: '00', message: 'Role updated successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async remove(id) {
        try {
            const role = await this.dataSource.query(`SELECT role_name FROM roles WHERE role_id = ?`, [id]);
            if (role.length === 0) {
                return { responseCode: '01', message: 'Role not found' };
            }
            const usersWithRole = await this.dataSource.query(`SELECT COUNT(*) AS cnt FROM users WHERE role = ?`, [role[0].role_name]);
            if (usersWithRole[0].cnt > 0) {
                return {
                    responseCode: '02',
                    message: `Cannot delete: ${usersWithRole[0].cnt} user(s) still assigned to this role`,
                };
            }
            await this.dataSource.query(`DELETE FROM roles WHERE role_id = ?`, [id]);
            return { responseCode: '00', message: 'Role deleted successfully' };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getAllMenus() {
        try {
            const result = await this.dataSource.query(`SELECT menu_id, menu_name, menu_icon, menu_path, 
                parent_menu_id, menu_order, is_active
         FROM menus 
         WHERE is_active = 1
         ORDER BY menu_order, parent_menu_id, menu_id`);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async getMenuMapping(roleId) {
        try {
            const result = await this.dataSource.query(`SELECT rmm.mapping_id, rmm.role_id, rmm.menu_id,
                rmm.can_view, rmm.can_create, rmm.can_edit, rmm.can_delete,
                m.menu_name, m.menu_icon, m.menu_path, 
                m.parent_menu_id, m.menu_order
         FROM role_menu_mapping rmm
         JOIN menus m ON rmm.menu_id = m.menu_id
         WHERE rmm.role_id = ? AND m.is_active = 1
         ORDER BY m.menu_order, m.parent_menu_id, m.menu_id`, [roleId]);
            return { responseCode: '00', data: result };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
    async saveMenuMapping(roleId, mappings) {
        try {
            await this.dataSource.query(`DELETE FROM role_menu_mapping WHERE role_id = ?`, [roleId]);
            if (mappings && mappings.length > 0) {
                const values = mappings.map((m) => [
                    roleId,
                    m.menu_id,
                    m.can_view ?? 0,
                    m.can_create ?? 0,
                    m.can_edit ?? 0,
                    m.can_delete ?? 0,
                    'admin',
                ]);
                const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
                const flatValues = values.flat();
                await this.dataSource.query(`INSERT INTO role_menu_mapping 
           (role_id, menu_id, can_view, can_create, can_edit, can_delete, created_by)
           VALUES ${placeholders}`, flatValues);
            }
            return {
                responseCode: '00',
                message: 'Menu mapping saved successfully',
                data: { count: mappings?.length || 0 },
            };
        }
        catch (error) {
            return { responseCode: '99', message: error.message };
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RolesService);
//# sourceMappingURL=roles.service.js.map