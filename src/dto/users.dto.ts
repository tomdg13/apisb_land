import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

// ── Login ─────────────────────────────────────────────────────
export class userstDto {
  [x: string]: string;
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// ── Register (public self-signup) ────────────────────────────
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  phone_number: string;   // ໃຊ້ເປັນ username ດ້ວຍ

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}


export class CustomerpDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  id?: number;
}

export interface TelbizSmsRequest {
    title: string;
    phone: string;
    message: string;
}