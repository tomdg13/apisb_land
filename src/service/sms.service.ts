import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private accessToken: string | null = null; z
    private tokenExpiryTime: number | null = null;

    constructor(
        private readonly httpService: HttpService
    ) { }

    //Below Configuration is hardcode for SMS provider Telbiz
    private getClientConfig(): TelbizClientConfig {
        return {
            clientId: '16996090398809808',
            secret: 'ed3406be-069e-49b6-b782-75b5c942f787',
            grantType: 'client_credentials',
            scope: 'Telbiz_API_SCOPE openid profile offline_access',
            baseUrl: 'https://api.telbiz.la',
        };
    }


    async getAccessToken(): Promise<string> {
        // Check if we have a valid token
        if (this.accessToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime) {
            return this.accessToken;
        }

        try {
            const config = this.getClientConfig();
            const tokenUrl = `${config.baseUrl}/api/v1/connect/token`;

            const requestBody = {
                clientID: config.clientId,
                secret: config.secret,
                grantType: config.grantType,
                scope: config.scope,
            };

            this.logger.log('Requesting new access token from Telbiz API');

            const response = await firstValueFrom(
                this.httpService.post<TelbizTokenResponse>(tokenUrl, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );

            if (response.data.success) {
                this.accessToken = response.data.accessToken;
                // Set expiry time (subtract 5 minutes for safety)
                this.tokenExpiryTime = Date.now() + (response.data.expire - 300) * 1000;

                this.logger.log('Successfully obtained access token');
                return this.accessToken;
            } else {
                throw new HttpException(
                    `Failed to get access token: ${response.data.message}`,
                    HttpStatus.UNAUTHORIZED,
                );
            }
        } catch (error) {
            this.logger.error('Error getting access token:', error);
            throw new HttpException(
                'Failed to authenticate with Telbiz API',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    async makeAuthenticatedRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        data?: any,
    ): Promise<T> {
        const token = await this.getAccessToken();
        const config = this.getClientConfig();
        const url = `${config.baseUrl}${endpoint}`;

        try {
            const requestConfig = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            let response;
            switch (method) {
                case 'GET':
                    response = await firstValueFrom(this.httpService.get<T>(url, requestConfig));
                    break;
                case 'POST':
                    response = await firstValueFrom(this.httpService.post<T>(url, data, requestConfig));
                    break;
                case 'PUT':
                    response = await firstValueFrom(this.httpService.put<T>(url, data, requestConfig));
                    break;
                case 'DELETE':
                    response = await firstValueFrom(this.httpService.delete<T>(url, requestConfig));
                    break;
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Error making ${method} request to ${endpoint}:`, error);
            throw new HttpException(
                `API request failed: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async sendSMS(smsData: TelbizSmsRequest, subject: string = 'Sabaikee-App'): Promise<TelbizSmsResponse> {
        const endpoint = `/api/v1/smsservice/newtransaction?subject=${encodeURIComponent(subject)}`;

        try {
            this.logger.log(`Sending SMS to ${smsData.phone} with title: ${smsData.title}`);

            const response = await this.makeAuthenticatedRequest<TelbizSmsResponse>(
                endpoint,
                'POST',
                smsData,
            );

            this.logger.log(`SMS sent successfully. Status: ${response.response.code}`);
            return response;
        } catch (error) {
            this.logger.error('Error sending SMS:', error);
            throw new HttpException(
                `Failed to send SMS: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

}

//For token response
interface TelbizTokenResponse {
    username: string | null;
    accessToken: string;
    expire: number;
    refreshToken: string | null;
    password: string;
    code: string;
    message: string;
    success: boolean;
    detail: string;
}

// Sms configuration
interface TelbizClientConfig {
    clientId: string;
    secret: string;
    grantType: string;
    scope: string;
    baseUrl: string;
}

// Sms send request
export interface TelbizSmsRequest {
    title: string;
    phone: string;
    message: string;
}

//Sms send response
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