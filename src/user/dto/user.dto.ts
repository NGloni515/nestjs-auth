import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  apiKeyId: string;

  @IsString()
  apiKeySecret: string;
}
