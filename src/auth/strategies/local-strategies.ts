import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<JwtPayload> {
    const user = await this.authService.validateUser({ email, password });
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
