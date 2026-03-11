export declare class CreateListingDto {
    category_id: number;
    title: string;
    title_en?: string;
    description?: string;
    price: number;
    currency?: 'LAK' | 'USD' | 'THB';
    price_per_unit?: number;
    negotiable?: number;
    area?: number;
    area_unit?: 'sqm' | 'rai' | 'ngan' | 'sqft';
    province_id?: number;
    district_id?: number;
    village_id?: number;
    address_detail?: string;
    latitude?: number;
    longitude?: number;
    map_url?: string;
    listing_type?: 'sale' | 'rent' | 'lease';
    status?: 'draft' | 'pending' | 'active';
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_line?: string;
    contact_whatsapp?: string;
    expires_at?: string;
}
export declare class UpdateListingDto {
    category_id?: number;
    title?: string;
    title_en?: string;
    description?: string;
    price?: number;
    currency?: 'LAK' | 'USD' | 'THB';
    price_per_unit?: number;
    negotiable?: number;
    area?: number;
    area_unit?: 'sqm' | 'rai' | 'ngan' | 'sqft';
    province_id?: number;
    district_id?: number;
    village_id?: number;
    address_detail?: string;
    latitude?: number;
    longitude?: number;
    map_url?: string;
    listing_type?: 'sale' | 'rent' | 'lease';
    status?: 'draft' | 'pending' | 'active' | 'sold' | 'rented' | 'expired' | 'rejected';
    reject_reason?: string;
    is_featured?: number;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_line?: string;
    contact_whatsapp?: string;
    expires_at?: string;
}
export declare class LandDetailDto {
    title_deed_type?: string;
    width_meter?: number;
    depth_meter?: number;
    road_access?: number;
    road_width_meter?: number;
    electricity?: number;
    water_supply?: number;
    zoning?: string;
    shape?: string;
}
export declare class CreateInquiryDto {
    listing_id: number;
    sender_name?: string;
    sender_phone?: string;
    sender_email?: string;
    message: string;
}
export declare class ListingQueryDto {
    page?: number;
    limit?: number;
    category_id?: number;
    province_id?: number;
    district_id?: number;
    listing_type?: string;
    status?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}
