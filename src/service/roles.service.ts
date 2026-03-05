import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(private dataSource: DataSource) {}

  // ==========================================
  // GET ALL ROLES
  // ==========================================
  async getAll(): Promise<any> {
    try {
      const result = await this.dataSource.query(
        `SELECT r.*, 
                (SELECT COUNT(*) FROM users u WHERE u.role = r.role_name) AS user_count
         FROM roles r 
         ORDER BY r.role_id`,
      );
      return { responseCode: '00', data: result };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // CREATE ROLE
  // ==========================================
  async create(body: any): Promise<any> {
    try {
      // Check duplicate
      const existing = await this.dataSource.query(
        `SELECT role_id FROM roles WHERE role_name = ?`,
        [body.role_name],
      );
      if (existing.length > 0) {
        return { responseCode: '01', message: 'Role name already exists' };
      }

      const result = await this.dataSource.query(
        `INSERT INTO roles (role_name, role_description, is_active, created_by)
         VALUES (?, ?, ?, ?)`,
        [
          body.role_name,
          body.role_description || null,
          body.is_active ?? 1,
          body.created_by || 'admin',
        ],
      );
      return {
        responseCode: '00',
        message: 'Role created successfully',
        data: { role_id: result.insertId },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // UPDATE ROLE
  // ==========================================
  async update(id: number, body: any): Promise<any> {
    try {
      await this.dataSource.query(
        `UPDATE roles SET role_description = ?, is_active = ?, last_modified_by = ?
         WHERE role_id = ?`,
        [body.role_description, body.is_active, body.modified_by || 'admin', id],
      );
      return { responseCode: '00', message: 'Role updated successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // DELETE ROLE (cascade deletes mappings)
  // ==========================================
  async remove(id: number): Promise<any> {
    try {
      // Check if users still use this role
      const role = await this.dataSource.query(
        `SELECT role_name FROM roles WHERE role_id = ?`,
        [id],
      );
      if (role.length === 0) {
        return { responseCode: '01', message: 'Role not found' };
      }

      const usersWithRole = await this.dataSource.query(
        `SELECT COUNT(*) AS cnt FROM users WHERE role = ?`,
        [role[0].role_name],
      );
      if (usersWithRole[0].cnt > 0) {
        return {
          responseCode: '02',
          message: `Cannot delete: ${usersWithRole[0].cnt} user(s) still assigned to this role`,
        };
      }

      // CASCADE will delete role_menu_mapping entries
      await this.dataSource.query(`DELETE FROM roles WHERE role_id = ?`, [id]);
      return { responseCode: '00', message: 'Role deleted successfully' };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // GET ALL MENUS (for mapping UI)
  // ==========================================
  async getAllMenus(): Promise<any> {
    try {
      const result = await this.dataSource.query(
        `SELECT menu_id, menu_name, menu_icon, menu_path, 
                parent_menu_id, menu_order, is_active
         FROM menus 
         WHERE is_active = 1
         ORDER BY menu_order, parent_menu_id, menu_id`,
      );
      return { responseCode: '00', data: result };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // GET ROLE-MENU MAPPING
  // ==========================================
  async getMenuMapping(roleId: number): Promise<any> {
    try {
      const result = await this.dataSource.query(
        `SELECT rmm.mapping_id, rmm.role_id, rmm.menu_id,
                rmm.can_view, rmm.can_create, rmm.can_edit, rmm.can_delete,
                m.menu_name, m.menu_icon, m.menu_path, 
                m.parent_menu_id, m.menu_order
         FROM role_menu_mapping rmm
         JOIN menus m ON rmm.menu_id = m.menu_id
         WHERE rmm.role_id = ? AND m.is_active = 1
         ORDER BY m.menu_order, m.parent_menu_id, m.menu_id`,
        [roleId],
      );
      return { responseCode: '00', data: result };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }

  // ==========================================
  // SAVE ROLE-MENU MAPPING (replace all)
  // ==========================================
  // Body: { mappings: [{ menu_id, can_view, can_create, can_edit, can_delete }] }
  async saveMenuMapping(roleId: number, mappings: any[]): Promise<any> {
    try {
      // Delete existing mappings for this role
      await this.dataSource.query(
        `DELETE FROM role_menu_mapping WHERE role_id = ?`,
        [roleId],
      );

      // Insert new mappings
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

        await this.dataSource.query(
          `INSERT INTO role_menu_mapping 
           (role_id, menu_id, can_view, can_create, can_edit, can_delete, created_by)
           VALUES ${placeholders}`,
          flatValues,
        );
      }

      return {
        responseCode: '00',
        message: 'Menu mapping saved successfully',
        data: { count: mappings?.length || 0 },
      };
    } catch (error) {
      return { responseCode: '99', message: error.message };
    }
  }
}