import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, PrismaService, AuthService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
