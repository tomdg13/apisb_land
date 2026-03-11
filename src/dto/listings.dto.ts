import { IsString, IsNumber, IsOptional, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

// ── CREATE LISTING ────────────────────────────────────────────
export class CreateListingDto {
  @IsInt()
  @Type(() => Number)
  category_id: number;

  @IsString()
  title: string;

  @IsOptional() @IsString()
  title_en?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional() @IsIn(['LAK', 'USD', 'THB'])
  currency?: 'LAK' | 'USD' | 'THB';

  @IsOptional() @IsNumber()
  @Type(() => Number)
  price_per_unit?: number;

  @IsOptional() @IsNumber()
  @Type(() => Number)
  negotiable?: number;

  @IsOptional() @IsNumber()
  @Type(() => Number)
  area?: number;

  @IsOptional() @IsIn(['sqm', 'rai', 'ngan', 'sqft'])
  area_unit?: 'sqm' | 'rai' | 'ngan' | 'sqft';

  @IsOptional() @IsInt()
  @Type(() => Number)
  province_id?: number;

  @IsOptional() @IsInt()
  @Type(() => Number)
  district_id?: number;

  @IsOptional() @IsInt()
  @Type(() => Number)
  village_id?: number;

  @IsOptional() @IsString()
  address_detail?: string;

  @IsOptional() @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional() @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional() @IsString()
  map_url?: string;

  @IsOptional() @IsIn(['sale', 'rent', 'lease'])
  listing_type?: 'sale' | 'rent' | 'lease';

  // ✅ Allow frontend to set status on create
  @IsOptional() @IsIn(['draft', 'pending', 'active'])
  status?: 'draft' | 'pending' | 'active';

  @IsOptional() @IsString()
  contact_name?: string;

  @IsOptional() @IsString()
  contact_phone?: string;

  @IsOptional() @IsString()
  contact_email?: string;

  @IsOptional() @IsString()
  contact_line?: string;

  @IsOptional() @IsString()
  contact_whatsapp?: string;

  @IsOptional() @IsString()
  expires_at?: string;
}

// ── UPDATE LISTING ────────────────────────────────────────────
export class UpdateListingDto {
  @IsOptional() @IsInt() @Type(() => Number)
  category_id?: number;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  title_en?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  price?: number;

  @IsOptional() @IsIn(['LAK', 'USD', 'THB'])
  currency?: 'LAK' | 'USD' | 'THB';

  @IsOptional() @IsNumber() @Type(() => Number)
  price_per_unit?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  negotiable?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  area?: number;

  @IsOptional() @IsIn(['sqm', 'rai', 'ngan', 'sqft'])
  area_unit?: 'sqm' | 'rai' | 'ngan' | 'sqft';

  @IsOptional() @IsInt() @Type(() => Number)
  province_id?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  district_id?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  village_id?: number;

  @IsOptional() @IsString()
  address_detail?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  latitude?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  longitude?: number;

  @IsOptional() @IsString()
  map_url?: string;

  @IsOptional() @IsIn(['sale', 'rent', 'lease'])
  listing_type?: 'sale' | 'rent' | 'lease';

  @IsOptional() @IsIn(['draft', 'pending', 'active', 'sold', 'rented', 'expired', 'rejected'])
  status?: 'draft' | 'pending' | 'active' | 'sold' | 'rented' | 'expired' | 'rejected';

  @IsOptional() @IsString()
  reject_reason?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  is_featured?: number;

  @IsOptional() @IsString()
  contact_name?: string;

  @IsOptional() @IsString()
  contact_phone?: string;

  @IsOptional() @IsString()
  contact_email?: string;

  @IsOptional() @IsString()
  contact_line?: string;

  @IsOptional() @IsString()
  contact_whatsapp?: string;

  @IsOptional() @IsString()
  expires_at?: string;
}

// ── LAND DETAIL ───────────────────────────────────────────────
export class LandDetailDto {
  @IsOptional() @IsString()
  title_deed_type?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  width_meter?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  depth_meter?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  road_access?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  road_width_meter?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  electricity?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  water_supply?: number;

  @IsOptional() @IsString()
  zoning?: string;

  @IsOptional() @IsString()
  shape?: string;
}

// ── INQUIRY ───────────────────────────────────────────────────
export class CreateInquiryDto {
  @IsInt() @Type(() => Number)
  listing_id: number;

  @IsOptional() @IsString()
  sender_name?: string;

  @IsOptional() @IsString()
  sender_phone?: string;

  @IsOptional() @IsString()
  sender_email?: string;

  @IsString()
  message: string;
}

// ── QUERY / FILTER ────────────────────────────────────────────
export class ListingQueryDto {
  @IsOptional() @IsInt() @Type(() => Number)
  page?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  limit?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  category_id?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  province_id?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  district_id?: number;

  @IsOptional() @IsString()
  listing_type?: string;

  @IsOptional() @IsString()
  status?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  min_price?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  max_price?: number;

  @IsOptional() @IsInt() @Type(() => Number)
  is_featured?: number;

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString()
  sort_by?: string;

  @IsOptional() @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC';
}