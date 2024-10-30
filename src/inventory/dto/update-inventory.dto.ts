import { IsInt, IsOptional } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsInt()
  quantity?: number;
}
