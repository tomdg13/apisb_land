/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { ListingsService } from 'src/service/listings.service';
import { CreateListingDto, UpdateListingDto, LandDetailDto, CreateInquiryDto, ListingQueryDto } from 'src/dto/listings.dto';
export declare class ListingsController {
    private readonly listingsService;
    private readonly config;
    constructor(listingsService: ListingsService, config: ConfigService);
    private get appUrl();
    getAll(query: ListingQueryDto, req: any): Promise<any>;
    getCategories(): Promise<any>;
    getProvinces(): Promise<any>;
    getDistricts(id: number): Promise<any>;
    getVillages(id: number): Promise<any>;
    getPackages(): Promise<any>;
    createInquiry(dto: CreateInquiryDto, req: any): Promise<any>;
    getOne(id: number): Promise<any>;
    getMyListings(req: any, query: ListingQueryDto): Promise<any>;
    getMyFavorites(req: any): Promise<any>;
    create(dto: CreateListingDto, req: any): Promise<any>;
    update(id: number, dto: UpdateListingDto, req: any): Promise<any>;
    remove(id: number, req: any): Promise<any>;
    approve(id: number): Promise<any>;
    reject(id: number, body: {
        reason: string;
    }): Promise<any>;
    uploadImages(id: number, files: Express.Multer.File[], req: any): Promise<any>;
    deleteImage(imageId: number, req: any): Promise<any>;
    setCover(imageId: number, req: any): Promise<any>;
    saveLandDetail(id: number, dto: LandDetailDto, req: any): Promise<any>;
    toggleFavorite(id: number, req: any): Promise<any>;
    getInquiries(id: number, req: any): Promise<any>;
}
