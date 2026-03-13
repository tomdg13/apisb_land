import { HttpService } from "@nestjs/axios";
export declare class SmsService {
    private readonly httpService;
    private readonly logger;
    private accessToken;
    z: any;
    private tokenExpiryTime;
    constructor(httpService: HttpService);
    private getClientConfig;
    getAccessToken(): Promise<string>;
    makeAuthenticatedRequest<T>(endpoint: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T>;
    sendSMS(smsData: TelbizSmsRequest, subject?: string): Promise<TelbizSmsResponse>;
}
export interface TelbizSmsRequest {
    title: string;
    phone: string;
    message: string;
}
export interface TelbizSmsResponse {
    response: {
        code: string;
        message: string;
        success: boolean;
        detail: string;
    };
    key: {
        partitionKey: string;
        rangeKey: string;
    };
}
