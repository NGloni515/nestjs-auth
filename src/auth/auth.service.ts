import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../user/dto/user.dto';
import { AccessValidationError } from './exceptions/auth.exception';
import { UserNotFoundException } from '../user/exceptions/user.exception';
import { isInstance } from 'class-validator';

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
    const payload = { ...user };
    return {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
      },
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

  async validateUserApiKeys(
    apiKeyId: string,
    apiKeySecret: string,
  ): Promise<UserDto> {
    if (
      !apiKeyId ||
      !apiKeySecret ||
      apiKeyId.trim() == '' ||
      apiKeySecret.trim() == ''
    ) {
      throw new AccessValidationError('Invalid API keys');
    }

    const user = await this.usersService
      .findOneByApiKey(apiKeyId, apiKeySecret)
      .catch((e) => {
        if (!isInstance(e, UserNotFoundException)) {
          throw e;
        }
      });

    if (user) {
      return user;
    } else {
      throw new AccessValidationError('Invalid API keys');
    }
  }
}
