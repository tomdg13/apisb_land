import { RolesService } from 'src/service/roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getAll(): Promise<any>;
    create(body: any): Promise<any>;
    update(id: number, body: any): Promise<any>;
    delete(id: number): Promise<any>;
    getAllMenus(): Promise<any>;
    getMenuMapping(id: number): Promise<any>;
    saveMenuMapping(id: number, body: any): Promise<any>;
}
