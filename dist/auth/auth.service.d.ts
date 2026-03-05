import { JwtService } from '@nestjs/jwt';
import { usersService } from 'src/service/users.service';
import { RegisterDto } from 'src/dto/users.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: usersService, jwtService: JwtService);
    login(userstdto: any): Promise<any>;
    register(dto: RegisterDto): Promise<any>;
}
