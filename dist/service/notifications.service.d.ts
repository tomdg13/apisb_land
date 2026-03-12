import { DataSource } from 'typeorm';
export declare class NotificationsService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getNotifications(userId: number, limit?: number): Promise<any>;
    getUnreadCount(userId: number): Promise<any>;
    markRead(notifId: number, userId: number): Promise<any>;
    markAllRead(userId: number): Promise<any>;
}
