/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/service/profile.service';
export declare class ProfileController {
    private readonly profileService;
    private readonly config;
    constructor(profileService: ProfileService, config: ConfigService);
    private get appUrl();
    getMyProfile(req: any): Promise<any>;
    getProfile(userId: number, req: any): Promise<any>;
    updateProfile(body: any, req: any): Promise<any>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<any>;
    uploadCover(file: Express.Multer.File, req: any): Promise<any>;
    changePassword(body: {
        current_password: string;
        new_password: string;
    }, req: any): Promise<any>;
    addReview(sellerId: number, body: {
        rating: number;
        review_text?: string;
        listing_id?: number;
    }, req: any): Promise<any>;
}
