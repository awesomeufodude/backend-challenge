import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsInt()
  survivorId: number;

  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
