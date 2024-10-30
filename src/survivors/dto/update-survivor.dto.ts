import { IsString, IsOptional, IsInt, IsBoolean, IsLatitude, IsLongitude } from 'class-validator';

export class UpdateSurvivorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsLatitude()
  lastLatitude?: number;

  @IsOptional()
  @IsLongitude()
  lastLongitude?: number;

  @IsOptional()
  @IsBoolean()
  infected?: boolean;
}