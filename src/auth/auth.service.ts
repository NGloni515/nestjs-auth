import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(dto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
  }

  login(user: JwtPayload) {
    console.log('user', user);
    const payload = { ...user };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwtSecret'),
        expiresIn: this.configService.get('jwtExpirationTime'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: this.configService.get('jwtRefreshExpirationTime'),
      }),
    };
  }
}
