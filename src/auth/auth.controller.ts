import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/refresh.guard';
import { Public } from '../common/decorators/public.decorator';
import { JwtPayload, JwtSign } from './auth.interface';
import { Request } from 'express';
import { Roles } from './decorators/role.decorator';
import { RoleGuard } from './guards/role.guard';
import { ApiKeysGuard } from './guards/api-keys.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async jwtRefresh(@Req() req: Request): Promise<JwtSign> {
    return this.authService.login(req.user as JwtPayload);
  }

  // @Roles('customer') // role validation
  @UseGuards(AuthGuard(['jwt', 'api-keys']), RoleGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
