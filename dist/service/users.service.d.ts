import { DataSource } from 'typeorm';
import { userstDto } from 'src/dto/users.dto';
export declare class usersService {
    private dataSource;
    constructor(dataSource: DataSource);
    find(userstdto: userstDto): Promise<any>;
    getAll(): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    remove(id: number): Promise<any>;
    unlock(id: number): Promise<any>;
    getBranches(): Promise<any>;
    getCountersByBranch(branchId: number): Promise<any>;
    register(dto: any): Promise<any>;
    getRoles(): Promise<any>;
    createRole(body: any): Promise<any>;
    updateRole(id: number, body: any): Promise<any>;
    deleteRole(id: number): Promise<any>;
    getMenus(): Promise<any>;
    createMenu(body: any): Promise<any>;
    updateMenu(id: number, body: any): Promise<any>;
    deleteMenu(id: number): Promise<any>;
    getRoleMap(): Promise<any>;
    updateRoleMap(body: any): Promise<any>;
}
