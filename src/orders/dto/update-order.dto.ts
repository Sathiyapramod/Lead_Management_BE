import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class updateOrderDTO {
  @IsBoolean()
  @IsOptional()
  isCreated: boolean;

  @IsBoolean()
  @IsOptional()
  isApproved: boolean;

  @IsNumber()
  @IsOptional()
  lead_id: number;

  @IsString()
  @IsOptional()
  approved_on: string;
}
