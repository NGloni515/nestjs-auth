import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserNotFoundException } from './exceptions/user.exception';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new ConflictException('user not found');

    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) throw new ConflictException('user not found');

    return user;
  }

  public async findOneByApiKey(
    keyId: string,
    keySecret: string,
  ): Promise<UserDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        apiKeyId: keyId,
        apiKeySecret: keySecret,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
