import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Contact_Roles } from '@prisma/client';

export class CreateContactDto {
  @IsNumber()
  lead_id: number;

  @IsString()
  cnct_name: string;

  @IsString()
  cnct_role: Contact_Roles;

  @IsString()
  cnct_info: string;

  @IsString()
  phone: string;
}

export class GetContactsQuery {
  @IsOptional()
  lead_id: string;

  @IsOptional()
  limit: number;

  @IsOptional()
  offset: number;

  @IsOptional()
  searchName: string;
}
