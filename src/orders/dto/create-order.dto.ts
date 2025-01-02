import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class createOrderDTO {
  @IsNumber()
  lead_id: number;

  @IsNumber()
  order_value: number;

  @IsString()
  placed_on: string;

  @IsString()
  @IsOptional()
  closed_on: string;

  @IsBoolean()
  isCreated: boolean;

  @IsBoolean()
  isApproved: boolean;

  @IsString()
  @IsOptional()
  approved_on: string;
}

export class GetOrdersQuery {
  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  offset: number;
  @IsOptional()
  today: boolean;
}
