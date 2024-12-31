import { IsString, IsOptional } from 'class-validator';

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

export class GetManagersQuery {
  @IsOptional()
  limit: number;

  @IsOptional()
  offset: number;

  @IsOptional()
  searchName: string;
}
