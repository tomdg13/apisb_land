import { DataSource } from 'typeorm';
export declare class RolesService {
    private dataSource;
    constructor(dataSource: DataSource);
    getAll(): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
    getAllMenus(): Promise<any>;
    getMenuMapping(roleId: number): Promise<any>;
    saveMenuMapping(roleId: number, mappings: any[]): Promise<any>;
}
