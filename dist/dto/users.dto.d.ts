export declare class userstDto {
    [x: string]: string;
    userId: string;
    password: string;
}
export declare class RegisterDto {
    phone_number: string;
    full_name: string;
    password: string;
}
export declare class CustomerpDto {
    phone?: string;
    id?: number;
}
export interface TelbizSmsRequest {
    title: string;
    phone: string;
    message: string;
}
