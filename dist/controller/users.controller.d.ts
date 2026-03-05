import { usersService } from 'src/service/users.service';
export declare class usersController {
    private readonly testService;
    constructor(testService: usersService);
    getAll(): Promise<any>;
    getBranches(): Promise<any>;
    getCountersByBranch(branchId: number): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    delete(id: number): Promise<any>;
    unlock(id: number): Promise<any>;
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
