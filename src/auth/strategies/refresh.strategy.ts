import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload } from '../auth.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwtRefreshSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const res: JwtPayload = {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
    };
    // const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return res;
  }
}
