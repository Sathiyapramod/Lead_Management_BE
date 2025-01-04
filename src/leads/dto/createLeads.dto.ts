import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

enum CallFrequency {
  daily = 'daily',
  weekly = 'weekly',
}

export class CreateLeadDTO {
  @IsString()
  lead_name: string;
  @IsString()
  rest_name: string;

  @IsString()
  rest_addr1: string;

  @IsString()
  rest_addr2: string;

  @IsBoolean()
  lead_status: boolean;

  @IsNumber()
  mgr_id: number;

  @IsString()
  call_freq: CallFrequency;

  @IsString()
  phone: string;

  @IsOptional()
  @IsNumber()
  orders_placed?: number;

  @IsOptional()
  @IsNumber()
  orders_done?: number;
}

export class GetLeadsQuery {
  @IsOptional()
  @IsString()
  call_freq: CallFrequency;

  @IsOptional()
  @IsString()
  mgr_id: string;

  @IsOptional()
  @IsString()
  lead_id: string;

  @IsOptional()
  last_call_date: Date;

  @IsOptional()
  limit: number;

  @IsOptional()
  offset: number;

  @IsOptional()
  today: boolean;

  @IsOptional()
  searchName: string;
}
