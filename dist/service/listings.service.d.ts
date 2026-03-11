/// <reference types="multer" />
import { DataSource } from 'typeorm';
import { CreateListingDto, UpdateListingDto, LandDetailDto, CreateInquiryDto, ListingQueryDto } from 'src/dto/listings.dto';
export declare class ListingsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getAll(query: ListingQueryDto, userId?: number | null): Promise<any>;
    getOne(id: number): Promise<any>;
    getMyListings(userId: number, query: ListingQueryDto): Promise<any>;
    create(dto: CreateListingDto, userId: number): Promise<any>;
    update(id: number, dto: UpdateListingDto, userId: number, userRole: string): Promise<any>;
    remove(id: number, userId: number, userRole: string): Promise<any>;
    approve(id: number): Promise<any>;
    reject(id: number, reason: string): Promise<any>;
    addImages(listingId: number, files: Express.Multer.File[], userId: number, userRole: string, appUrl: string): Promise<any>;
    deleteImage(imageId: number, userId: number, userRole: string): Promise<any>;
    setCover(imageId: number, userId: number, userRole: string): Promise<any>;
    saveLandDetail(listingId: number, dto: LandDetailDto, userId: number, userRole: string): Promise<any>;
    toggleFavorite(listingId: number, userId: number): Promise<any>;
    getMyFavorites(userId: number): Promise<any>;
    createInquiry(dto: CreateInquiryDto, userId?: number): Promise<any>;
    getInquiries(listingId: number, userId: number, userRole: string): Promise<any>;
    getCategories(): Promise<any>;
    getProvinces(): Promise<any>;
    getDistricts(provinceId: number): Promise<any>;
    getVillages(districtId: number): Promise<any>;
    getPackages(): Promise<any>;
}
