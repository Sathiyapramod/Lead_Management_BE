import { IsString } from 'class-validator';
import { Roles } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  role: Roles;

  @IsString()
  time_id: string;
}
