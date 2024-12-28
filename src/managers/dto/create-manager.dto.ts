import { IsString } from 'class-validator';

enum RoleId {
  admin = 'admin',
  manager = 'manager',
}

export class CreateManagerDto {
  @IsString()
  mgr_name: string;

  @IsString()
  role: RoleId;

  @IsString()
  phone: string;
}
