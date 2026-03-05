import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { usersService } from 'src/service/users.service';
import { RegisterDto } from 'src/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: usersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userstdto: any): Promise<any> {
    const result = await this.usersService.find(userstdto);
    if (result.responseCode === '00') {
      const user = result.data;
      const payload = {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        department: user.department,
      };
      const token = this.jwtService.sign(payload);
      return {
        responseCode: '00',
        message: 'Login successful',
        data: result.data,
        menus: result.menus,
        access_token: token,
      };
    }
    return result;
  }

  async register(dto: RegisterDto): Promise<any> {
    return await this.usersService.register(dto);
  }
}