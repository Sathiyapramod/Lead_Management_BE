import { IsOptional, IsString } from 'class-validator';

export class GetOrdersQuery {
  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  offset: number;
  @IsOptional()
  today: boolean;
}
