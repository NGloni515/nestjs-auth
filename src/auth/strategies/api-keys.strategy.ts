import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isInstance } from 'class-validator';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { validate as isValidUUID } from 'uuid';
import { JwtPayload } from '../auth.interface';
import { AuthService } from '../auth.service';
import { AccessValidationError } from '../exceptions/auth.exception';

@Injectable()
export class ApiKeysStrategy extends PassportStrategy(Strategy, 'api-keys') {
  constructor(private auth: AuthService) {
    super();
  }

  async validate(req: Request): Promise<JwtPayload> {
    try {
      const apiKeyId = req.header('api-key-id') ?? '';
      const apiKeySecret = req.header('api-key-secret') ?? '';

      const user = await this.auth.validateUserApiKeys(apiKeyId, apiKeySecret);

      return {
        sub: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (e) {
      if (isInstance(e, AccessValidationError)) {
        throw new UnauthorizedException(e.message);
      } else {
        throw e;
      }
    }
  }
}
