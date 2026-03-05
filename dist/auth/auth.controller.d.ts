import { AuthService } from './auth.service';
import { userstDto, RegisterDto } from 'src/dto/users.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(userstdto: userstDto): Promise<any>;
    register(dto: RegisterDto): Promise<any>;
}
