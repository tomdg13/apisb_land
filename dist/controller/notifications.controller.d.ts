import { NotificationsService } from '../service/notifications.service';
export declare class NotificationsController {
    private readonly svc;
    constructor(svc: NotificationsService);
    getAll(req: any): Promise<any>;
    unreadCount(req: any): Promise<any>;
    markRead(id: string, req: any): Promise<any>;
    markAllRead(req: any): Promise<any>;
}
