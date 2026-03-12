import { DataSource } from 'typeorm';
export declare class ProfileService {
    private dataSource;
    constructor(dataSource: DataSource);
    getProfile(userId: number, viewerId?: number | null): Promise<any>;
    getMyProfile(userId: number): Promise<any>;
    updateProfile(userId: number, dto: any): Promise<any>;
    updateAvatar(userId: number, avatarUrl: string): Promise<any>;
    updateCoverUrl(userId: number, coverUrl: string): Promise<any>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<any>;
    addReview(sellerId: number, reviewerId: number, rating: number, text: string, listingId?: number): Promise<any>;
}
