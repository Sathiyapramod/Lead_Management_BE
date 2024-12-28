import { IsDate, IsOptional, IsString } from 'class-validator';

export class RecordCallDto {
  @IsOptional()
  @IsString()
  startTime?: Date;

  @IsOptional()
  @IsString()
  endTime?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  dateCreated?: Date;

  @IsString()
  sid: string;
}
