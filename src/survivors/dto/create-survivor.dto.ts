// src/survivors/dto/create-survivor.dto.ts
import { IsBoolean, IsLatitude, IsLongitude, IsInt, IsOptional, IsString, Min, Length, IsNotEmpty } from 'class-validator';

export class CreateSurvivorDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNotEmpty()
  @IsLatitude()
  lastLatitude: number;

  @IsNotEmpty()
  @IsLongitude()
  lastLongitude: number;

  @IsOptional()
  @IsBoolean()
  infected?: boolean = false;
}
